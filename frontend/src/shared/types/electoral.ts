// ─── Departamento ────────────────────────────────────────────────────────────

export type Departamento = {
  id_departamento: number;
  nombre: string;
};

export type DepartamentoPost = Omit<Departamento, 'id_departamento'>;

// ─── Zona ────────────────────────────────────────────────────────────────────

export type Zona = {
  id_zona: number;
  nombre: string;
  id_departamento: number;
};

export type ZonaPost = Omit<Zona, 'id_zona'>;

// ─── Establecimiento ─────────────────────────────────────────────────────────

export type EstablecimientoTipo = 'Escuela' | 'Liceo' | 'Universidad' | 'Otro';

export type Establecimiento = {
  id_establecimiento: number;
  nombre: string;
  tipo: EstablecimientoTipo;
  id_zona: number;
};

export type EstablecimientoPost = Omit<Establecimiento, 'id_establecimiento'>;

// ─── Circuito ────────────────────────────────────────────────────────────────

export type Circuito = {
  id_circuito: number;
  numero: string;
  id_establecimiento: number;
  id_departamento: number;
  localidad: string;
  barrio_zona?: string;
  es_accesible: boolean;
};

export type CircuitoPost = Omit<Circuito, 'id_circuito'>;

// ─── Ciudadano ───────────────────────────────────────────────────────────────

export type Ciudadano = {
  cedula_identidad: string;
  credencial_civica: string;
  nombre_completo: string;
  fecha_nacimiento: string; // ISO date: YYYY-MM-DD
};

// ─── Tipo de elección ────────────────────────────────────────────────────────

export type TipoEleccionNombre =
  | 'Presidencial'
  | 'Ballotage'
  | 'Municipal'
  | 'Plebiscito'
  | 'Referendum'
  | 'Interna';

export type TipoEleccion = {
  id_tipo: number;
  nombre: TipoEleccionNombre;
};

export type TipoEleccionPost = Omit<TipoEleccion, 'id_tipo'>;

// ─── Elección ────────────────────────────────────────────────────────────────

export type Eleccion = {
  id_eleccion: number;
  fecha: string; // ISO date: YYYY-MM-DD
  id_tipo: number;
  descripcion?: string;
};

export type EleccionPost = Omit<Eleccion, 'id_eleccion'>;

// ─── Organismo del Estado ────────────────────────────────────────────────────

export type OrganismoEstado = {
  id_organismo: number;
  nombre: string;
};

export type OrganismoEstadoPost = Omit<OrganismoEstado, 'id_organismo'>;

// ─── Miembro de Mesa ─────────────────────────────────────────────────────────

export type MiembroMesa = {
  cedula_identidad: string;
  id_organismo: number;
};

// ─── Comisaría ───────────────────────────────────────────────────────────────

export type Comisaria = {
  id_comisaria: number;
  nombre: string;
  id_departamento: number;
};

export type ComisariaPost = Omit<Comisaria, 'id_comisaria'>;

// ─── Agente Policial ─────────────────────────────────────────────────────────

export type AgentePolicial = {
  cedula_identidad: string;
  id_comisaria: number;
};

// ─── Mesa ────────────────────────────────────────────────────────────────────

export type Mesa = {
  id_mesa: number;
  id_circuito: number;
  id_eleccion: number;
  ci_presidente: string;
  ci_secretario: string;
  ci_vocal: string;
};

export type MesaPost = Omit<Mesa, 'id_mesa'>;

// ─── Partido Político ────────────────────────────────────────────────────────

export type PartidoPolitico = {
  id_partido: number;
  nombre: string;
  direccion_sede?: string;
};

export type PartidoPoliticoPost = Omit<PartidoPolitico, 'id_partido'>;

// ─── Papeleta ────────────────────────────────────────────────────────────────

export type OrganoEnum = 'Senadores' | 'Diputados' | 'Junta Departamental' | 'Concejo Municipal';

export type Papeleta = {
  id_papeleta: number;
  id_eleccion: number;
  numero_lista?: number;
  es_lista: boolean;
  descripcion?: string;
  color?: string;
  id_partido?: number;
  organo_candidatura?: OrganoEnum;
  id_departamento?: number;
};

export type PapeletaPost = Omit<Papeleta, 'id_papeleta'>;

// ─── Participación Votante ───────────────────────────────────────────────────

export type ParticipacionVotante = {
  id_participacion: number;
  credencial_civica: string;
  id_eleccion: number;
  fecha_hora: string; // ISO datetime
  es_observado: boolean;
  id_circuito: number;
};

export type ParticipacionVotantePost = Omit<
  ParticipacionVotante,
  'id_participacion' | 'fecha_hora'
>;

// ─── Voto ────────────────────────────────────────────────────────────────────

export type VotoEstado = 'Valido' | 'Anulado' | 'Blanco';

export type Voto = {
  id_voto: number;
  id_circuito: number;
  id_eleccion: number;
  fecha_hora: string; // ISO datetime
  estado: VotoEstado;
  es_observado: boolean;
};

export type VotoPost = Omit<Voto, 'id_voto' | 'fecha_hora'>;
