export interface Alert {
  id: string;
  titulo: string;
  descripcion: string;
  severidad: 'ALTA' | 'MEDIA' | 'BAJA';
  fecha: string;
}
