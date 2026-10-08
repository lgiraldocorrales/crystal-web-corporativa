export const departments = ['Hilanderia','Industria','Paquete_Completo','Ventas_Institucionales','Ventas_Terceros','Marca_Gef','Marca_Punto_Blanco','Marca_Baby_Fresh','Marca_Galax','Marca_Parfois','Servicio_cliente','Etica','Manejo_franquicias_distribuidores','Impuestos','Facturacion_electronica','Proveedores_y_Compras'] as const;
export interface ContactBody {
  nombre: string;
  apellido: string;
  email: string;
  empresa: string;
  mensaje: string;
  dirigido: typeof departments[number];
  idioma: 'es' | 'en';
  datosPers: boolean;
  website?: string;
  turnstileToken?: string;
}
const text = (maxLength: number) => ({type:'string',minLength:1,maxLength});
export const contactSchema = {
  body:{type:'object',additionalProperties:false,required:['nombre','apellido','email','empresa','mensaje','dirigido','idioma','datosPers'],properties:{nombre:text(30),apellido:text(30),email:{...text(254),format:'email',pattern:'^[^\\s@<>]+@[^\\s@<>]+\\.[^\\s@<>]+$'},empresa:text(35),mensaje:text(4000),dirigido:{type:'string',enum:departments},idioma:{type:'string',enum:['es','en']},datosPers:{type:'boolean',const:true},website:{type:'string',maxLength:200},turnstileToken:{type:'string',maxLength:2048}}},
  response:{200:{type:'object',additionalProperties:false,required:['status'],properties:{status:{type:'string',enum:['sent']}}},202:{type:'object',additionalProperties:false,required:['status'],properties:{status:{type:'string',enum:['accepted']}}},'4xx':{type:'object',additionalProperties:false,required:['error'],properties:{error:{type:'string',enum:['request_failed']}}},'5xx':{type:'object',additionalProperties:false,required:['error'],properties:{error:{type:'string',enum:['request_failed']}}}}
};
export function sanitize(body: ContactBody): ContactBody {
  const clean = (text: string) => text.normalize('NFC').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,'').trim();
  return {...body,nombre:clean(body.nombre),apellido:clean(body.apellido),empresa:clean(body.empresa),mensaje:clean(body.mensaje),email:clean(body.email).toLowerCase()};
}
