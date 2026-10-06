from __future__ import annotations

import html
import base64
import hashlib
import json
import logging
import os
import re
import smtplib
import ssl
import time
from collections import defaultdict, deque
from email.message import EmailMessage
from pathlib import Path
from threading import Lock
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from flask import Flask, jsonify, request, send_from_directory


ROOT = Path(__file__).resolve().parent
DIST = ROOT / "dist"
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
SAFE_TEXT_RE = re.compile(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]")
JSON_LD_RE = re.compile(r'<script type="application/ld\+json">(.*?)</script>', re.DOTALL)

app = Flask(__name__, static_folder=None)
app.config["MAX_CONTENT_LENGTH"] = 32 * 1024
app.logger.setLevel(logging.INFO)

_rate_buckets: dict[str, deque[float]] = defaultdict(deque)
_rate_lock = Lock()


def _env_list(name: str) -> set[str]:
    return {item.strip() for item in os.getenv(name, "").split(",") if item.strip()}


def _clean(value: object, max_length: int) -> str:
    text = SAFE_TEXT_RE.sub("", str(value or "")).strip()
    return text[:max_length]


def _allowed_origin() -> bool:
    allowed = _env_list("CONTACT_ALLOWED_ORIGINS")
    origin = request.headers.get("Origin")
    if not origin:
        return True
    return origin in allowed


def _rate_limited() -> bool:
    key = request.remote_addr or "unknown"
    now = time.monotonic()
    window = 3600
    limit = int(os.getenv("CONTACT_MAX_REQUESTS_PER_HOUR", "8"))
    with _rate_lock:
        bucket = _rate_buckets[key]
        while bucket and now - bucket[0] > window:
            bucket.popleft()
        if len(bucket) >= limit:
            return True
        bucket.append(now)
    return False


def _verify_turnstile(token: str) -> bool:
    secret = os.getenv("TURNSTILE_SECRET_KEY", "").strip()
    if not secret:
        return True
    body = json.dumps({
        "secret": secret,
        "response": token,
        "remoteip": request.remote_addr,
    }).encode("utf-8")
    req = Request(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urlopen(req, timeout=5) as response:
            result = json.loads(response.read().decode("utf-8"))
        return bool(result.get("success"))
    except Exception:
        app.logger.warning("Turnstile validation unavailable")
        return False


def _send_email(message: EmailMessage) -> None:
    host = os.environ["MASTERBASE_SMTP_HOST"]
    port = int(os.getenv("MASTERBASE_SMTP_PORT", "587"))
    username = os.environ["MASTERBASE_SMTP_USERNAME"]
    password = os.environ["MASTERBASE_SMTP_PASSWORD"]
    context = ssl.create_default_context()
    with smtplib.SMTP(host, port, timeout=12) as smtp:
        smtp.ehlo()
        smtp.starttls(context=context)
        smtp.ehlo()
        smtp.login(username, password)
        smtp.send_message(message)


def _mail_message(subject: str, recipient: str, text: str, html_body: str) -> EmailMessage:
    message = EmailMessage()
    message["Subject"] = subject.replace("\r", " ").replace("\n", " ")[:140]
    message["From"] = os.environ["MASTERBASE_FROM_EMAIL"]
    message["To"] = recipient
    message.set_content(text)
    message.add_alternative(html_body, subtype="html")
    return message


@app.after_request
def security_headers(response):
    asset_url = os.getenv("ASSET_BASE_URL", "https://crystal.com.co/static/store")
    asset_origin = f"{urlparse(asset_url).scheme}://{urlparse(asset_url).netloc}"
    script_hashes = ""
    if response.mimetype == "text/html":
        response.direct_passthrough = False
        document = response.get_data(as_text=True)
        hashes = []
        for payload in JSON_LD_RE.findall(document):
            digest = base64.b64encode(hashlib.sha256(payload.encode("utf-8")).digest()).decode("ascii")
            hashes.append(f"'sha256-{digest}'")
        script_hashes = " " + " ".join(hashes) if hashes else ""
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        f"img-src 'self' data: {asset_origin}; "
        f"media-src 'self' {asset_origin}; "
        f"script-src 'self'{script_hashes}; style-src 'self'; font-src 'self'; "
        "connect-src 'self' https://challenges.cloudflare.com; "
        "frame-src https://challenges.cloudflare.com; "
        "base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'"
    )
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=(), payment=()"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
    if request.is_secure:
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


@app.get("/health")
def health():
    return jsonify(status="ok")


@app.post("/api/contact")
def contact():
    if not _allowed_origin():
        return jsonify(error="origin_not_allowed"), 403
    if _rate_limited():
        return jsonify(error="rate_limited"), 429
    if not request.is_json:
        return jsonify(error="invalid_content_type"), 415

    payload = request.get_json(silent=True) or {}
    if _clean(payload.get("website"), 200):
        return jsonify(status="accepted"), 202

    name = _clean(payload.get("name"), 100)
    email = _clean(payload.get("email"), 254).lower()
    company = _clean(payload.get("company"), 120)
    phone = _clean(payload.get("phone"), 40)
    message_text = _clean(payload.get("message"), 3000)
    language = "en" if payload.get("language") == "en" else "es"
    token = _clean(payload.get("turnstileToken"), 2048)

    if not name or not EMAIL_RE.fullmatch(email) or len(message_text) < 10:
        return jsonify(error="invalid_fields"), 400
    if not _verify_turnstile(token):
        return jsonify(error="verification_failed"), 400

    recipients = _env_list("MASTERBASE_INTERNAL_RECIPIENTS")
    if not recipients:
        app.logger.error("Contact recipient configuration is missing")
        return jsonify(error="service_unavailable"), 503

    safe = {key: html.escape(value) for key, value in {
        "name": name, "email": email, "company": company,
        "phone": phone, "message": message_text,
    }.items()}
    internal_text = (
        f"Nombre: {name}\nCorreo: {email}\nEmpresa: {company or '-'}\n"
        f"Teléfono: {phone or '-'}\n\nMensaje:\n{message_text}"
    )
    internal_html = f"""<!doctype html><html><body style="font-family:Arial,sans-serif;color:#171516">
      <h1 style="font-size:24px">Nuevo contacto desde crystal.com.co</h1>
      <p><strong>Nombre:</strong> {safe['name']}<br><strong>Correo:</strong> {safe['email']}<br>
      <strong>Empresa:</strong> {safe['company'] or '-'}<br><strong>Teléfono:</strong> {safe['phone'] or '-'}</p>
      <p style="white-space:pre-wrap">{safe['message']}</p></body></html>"""

    try:
        for recipient in recipients:
            _send_email(_mail_message("Nuevo contacto — Crystal", recipient, internal_text, internal_html))

        if language == "en":
            confirmation_subject = "We received your message — Crystal"
            confirmation_text = f"Hello {name},\n\nWe received your message. Our team will contact you soon.\n\nCrystal S.A.S."
            confirmation_html = f"<p>Hello {safe['name']},</p><p>We received your message. Our team will contact you soon.</p><p><strong>Crystal S.A.S.</strong></p>"
        else:
            confirmation_subject = "Recibimos tu mensaje — Crystal"
            confirmation_text = f"Hola {name},\n\nRecibimos tu mensaje. Nuestro equipo se pondrá en contacto contigo.\n\nCrystal S.A.S."
            confirmation_html = f"<p>Hola {safe['name']},</p><p>Recibimos tu mensaje. Nuestro equipo se pondrá en contacto contigo.</p><p><strong>Crystal S.A.S.</strong></p>"
        _send_email(_mail_message(confirmation_subject, email, confirmation_text, confirmation_html))
    except (KeyError, OSError, smtplib.SMTPException):
        app.logger.exception("Contact delivery failed")
        return jsonify(error="delivery_failed"), 502

    return jsonify(status="sent"), 200


@app.get("/")
@app.get("/<path:path>")
def static_site(path: str = ""):
    candidate = DIST / path
    if candidate.is_dir():
        candidate = candidate / "index.html"
    if candidate.is_file() and DIST in candidate.resolve().parents:
        return send_from_directory(candidate.parent, candidate.name)
    fallback = DIST / path / "index.html"
    if fallback.is_file() and DIST in fallback.resolve().parents:
        return send_from_directory(fallback.parent, fallback.name)
    return send_from_directory(DIST, "404.html"), 404


@app.errorhandler(413)
def payload_too_large(_error):
    return jsonify(error="payload_too_large"), 413


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8000")), debug=False)
