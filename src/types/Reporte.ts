export interface Ubicacion {
  id: number;
  lat: number;
  lng: number;
  direccion: string;
  comuna: string;
  region: string;
}

export interface Reporte {
  id: number;
  titulo: string;
  descripcion: string;
  estado: 'ACTIVO' | 'EN_ATENCION' | 'RESUELTO';
  fechaCreacion: string;
  ubicacion: Ubicacion | null;
}
