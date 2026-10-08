/* Preserve source fields, toasts and four-second confirmation behavior. */
const form = document.getElementById('form');
function ShowSelectedDirigido() {
  const field = document.getElementById('dirigido');
  field.style.background = field.value ? '#e8f0fe' : 'white';
  field.style.border = field.value ? '2px solid #4caf50' : '1px solid #9e9e9e';
}
function ShowSelectedMensaje() {
  const field = document.getElementById('mensaje');
  field.style.background = field.value ? '#e8f0fe' : 'white';
  field.style.border = field.value ? '2px solid #4caf50' : '1px solid #9e9e9e';
}
let turnstileToken = '';
const siteKey = document.querySelector('meta[name="contact-turnstile-key"]')?.content;
if (siteKey && form) {
  const container = document.createElement('div');
  form.querySelector('#form-button').before(container);
  const script = document.createElement('script');
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  script.onload = () => window.turnstile.ready(() => window.turnstile.render(container, {sitekey:siteKey,callback:token => { turnstileToken=token; }}));
  document.head.append(script);
}
form?.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  if (document.querySelector('meta[name="crystal-preview"]')?.content === 'pages') {
    document.getElementById('contact-status').textContent = form.querySelector('#idioma').value === 'en'
      ? 'Static preview: this form does not send emails.'
      : 'Vista previa estática: este formulario no envía correos.';
    return;
  }
  const button = document.getElementById('form-button');
  const loader = document.getElementById('load');
  const english = form.querySelector('#idioma').value === 'en';
  const status = document.getElementById('contact-status');
  button.classList.add('hidden');loader?.classList.remove('hidden');
  const payload = Object.fromEntries(new FormData(form));
  payload.datosPers = document.getElementById('datosPers').checked;
  payload.turnstileToken = turnstileToken;
  delete payload['form-button'];
  delete payload['cf-turnstile-response'];
  try {
    const response = await fetch('/api/contact', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    if (!response.ok) throw new Error('contact_failed');
    const message = english ? 'Message sent' : 'Mensaje enviado';
    status.textContent = message;
    if (window.M) M.toast({html:message,classes:'rounded',displayLength:4000});
    setTimeout(() => location.reload(),4000);
  } catch {
    status.textContent = english ? 'Your message could not be sent. Please try again.' : 'No fue posible enviar el mensaje. Intenta nuevamente.';
    button.classList.remove('hidden');loader?.classList.add('hidden');
  }
});

