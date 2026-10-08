import nodemailer from 'nodemailer';
import type { AppConfig } from './config.js';
import type { ContactBody } from '../schemas/contact.js';
export interface Mail { from:string;to:string[] | string;subject:string;text:string;html:string;replyTo?:string; }
export interface MailService { sendMail(mail: Mail): Promise<unknown>; }
export function createMailer(config: AppConfig): MailService {
  return nodemailer.createTransport({host:config.smtp.host,port:config.smtp.port,secure:false,requireTLS:true,auth:{user:config.smtp.username,pass:config.smtp.password},tls:{minVersion:'TLSv1.2',rejectUnauthorized:true},connectionTimeout:12000,greetingTimeout:12000,socketTimeout:15000});
}
const escape = (text: string) => text.replace(/[&<>"']/g,character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]!));
export function mailTemplates(body: ContactBody,config: AppConfig): Mail[] {
  const fields = [['Dirigido a',body.dirigido],['Nombre',body.nombre],['Apellido',body.apellido],['Correo',body.email],['Empresa',body.empresa],['Idioma',body.idioma],['Autorización de datos','Sí'],['Mensaje',body.mensaje]];
  const internal: Mail = {from:config.smtp.from,to:config.smtp.recipients,replyTo:body.email,subject:'Nuevo contacto — Crystal',text:fields.map(([label,value]) => `${label}: ${value}`).join('\n'),html:'<!doctype html><html><body><h1>Nuevo contacto — Crystal</h1>'+fields.map(([label,value]) => '<p><strong>'+escape(label!)+':</strong> '+escape(value!).replace(/\n/g,'<br>')+'</p>').join('')+'</body></html>'};
  // Existing repository behavior includes confirmation in the visitor's language.
  const english=body.idioma==='en';
  const message=english ? 'We received your message. Our team will contact you soon.' : 'Recibimos tu mensaje. Nuestro equipo se pondrá en contacto contigo.';
  const greeting=(english?'Hello ':'Hola ')+body.nombre;
  return [internal,{from:config.smtp.from,to:body.email,subject:english?'We received your message — Crystal':'Recibimos tu mensaje — Crystal',text:greeting+',\n\n'+message+'\n\nCrystal S.A.S.',html:'<!doctype html><html lang="'+body.idioma+'"><body><p>'+escape(greeting)+',</p><p>'+message+'</p><p><strong>Crystal S.A.S.</strong></p></body></html>'}];
}
