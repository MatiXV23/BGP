import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";
import { miembroMesaModel, miembroMesaPostModel } from "../../models/miembroMesaModel.js";

const miembroMesaRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener miembros de mesa",
        tags: ["MiembroMesa"],
        description: "Ruta para obtener todos los miembros de mesa.",
        response: {
          200: Type.Array(miembroMesaModel),
        },
      },
    },
    async (req, rep) => {
      return await fastify.MiembroMesaDB.getAll();
    },
  );

  fastify.post(
    "",
    {
      schema: {
        summary: "Crear miembro de mesa",
        tags: ["MiembroMesa"],
        description: "Ruta para registrar un miembro de mesa. Se requiere ser administrador.",
        body: miembroMesaPostModel,
        response: {
          201: miembroMesaModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      rep.code(201).send(await fastify.MiembroMesaDB.create(req.body));
    },
  );
};

export default miembroMesaRoutes;
