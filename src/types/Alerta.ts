export interface Alerta {
  id: string;
  titulo: string;
  descripcion: string;
  severidad: 'ALTA' | 'MEDIA' | 'BAJA';
  fecha: string;
}
