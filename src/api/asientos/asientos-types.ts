export interface DatCentro {
  id?: number;
  codigo: string;
  nombre: string;
  activo: boolean;
  empresa_id: number;
}

export interface Asiento {
  id: number;
  empresa_id: number;
  fecha_emision: string;
  nro_asiento?: string;
  comentario?: string;
  codigo_transaccion: string;
  estado: string;
  nro_referencia?: string;
  codigo_centro: string;
  total_debe: number;
  total_haber: number;
  lineItems: AsientoItem[];
}

export interface AsientoItem {
  id: number;
  codigo_centro: string;
  cta: string;
  cta_nombre: string;
  debe: number;
  haber: number;
  nota?: string;
  asiento_id: number;
}

export interface CreateAsientoDto {
  empresa_id: number;
  fecha_emision?: string;
  nro_asiento: string;
  comentario?: string;
  codigo_transaccion: string;
  estado: string;
  nro_referencia?: string;
  codigo_centro: string;
  total_debe: number;
  total_haber: number;
  lineItems: CreateAsientoItemDto[];
}

export interface CreateAsientoItemDto {
  codigo_centro: string;
  cta: string;
  cta_nombre: string;
  debe: number;
  haber: number;
  nota?: string;
}

