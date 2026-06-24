import fastifyPlugin from "fastify-plugin";
import { UsuariosDB } from "../services/usuariosDB.js";

export default fastifyPlugin(async function (fastify) {
  fastify.decorate("UsuariosDB", new UsuariosDB(fastify.mysql));
});

declare module "fastify" {
  interface FastifyInstance {
    UsuariosDB: UsuariosDB;
  }
}
