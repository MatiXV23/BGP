export type IntegranteMesa = {
  cedula_identidad: string;
  nombre_completo: string;
};

export type AgenteSeguridad = {
  cedula_identidad: string;
  nombre_completo: string;
  comisaria: string;
};

export type PapeletaResultado = {
  id_papeleta: number;
  numero_lista?: number;
  descripcion?: string;
  color?: string;
  partido?: string;
  organo_candidatura?: string;
  votos: number;
};

export type MesaActual = {
  id_mesa: number;
  estado: 'Abierta' | 'Cerrada';

  id_circuito: number;
  numero_circuito: string;
  localidad: string;
  barrio_zona?: string;
  es_accesible: boolean;

  id_establecimiento: number;
  establecimiento: string;
  tipo_establecimiento: string;
  zona: string;
  circuitos_en_establecimiento: number;

  id_departamento: number;
  departamento: string;

  id_eleccion: number;
  eleccion_fecha: string;
  eleccion_tipo: string;
  eleccion_descripcion?: string;

  presidente: IntegranteMesa;
  secretario: IntegranteMesa;
  vocal: IntegranteMesa;

  habilitados: number;
  votos_emitidos: number;
  votos_validos: number;
  votos_anulados: number;
  votos_blancos: number;
  votos_observados: number;

  seguridad: AgenteSeguridad[];
  papeletas: PapeletaResultado[];
};

export type VerificacionVotante = {
  nombre_completo: string;
  ya_voto: boolean;
  observado: boolean;
};

export type VotoEmitido = {
  id_voto: number;
  estado: 'Valido' | 'Blanco';
  observado: boolean;
};
