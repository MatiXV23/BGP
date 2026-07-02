export type Usuario = {
  id_usuario: number;
  cedula_identidad: string;
  is_admin: boolean;
  nombre_completo?: string;
  credencial_civica?: string;
};

export type UsuarioPost = {
  cedula_identidad: string;
  is_admin?: boolean;
  password: string;
};
