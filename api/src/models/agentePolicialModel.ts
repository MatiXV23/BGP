import { type Static, Type } from "@fastify/type-provider-typebox";

export const agentePolicialModel = Type.Object({
  cedula_identidad: Type.String({ maxLength: 8 }),
  id_comisaria: Type.Integer(),
});
export type AgentePolicial = Static<typeof agentePolicialModel>;

export const agentePolicialPostModel = Type.Object({
  cedula_identidad: Type.String({ maxLength: 8 }),
  id_comisaria: Type.Integer(),
});
export type AgentePolicialPost = Static<typeof agentePolicialPostModel>;
