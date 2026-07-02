export type Usuario = {
  id_usuario: number;
  cedula_identidad: string;
  is_admin: boolean;
  nombre_completo?: string;
};

export type UsuarioPost = {
  cedula_identidad: string;
  is_admin?: boolean;
  password: string;
};
