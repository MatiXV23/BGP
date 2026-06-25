import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";
import { tipoEleccionModel, tipoEleccionPostModel } from "../../models/tipoEleccionModel.js";

const tipoEleccionRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener tipos de elección",
        tags: ["TipoEleccion"],
        description: "Ruta para obtener todos los tipos de elección.",
        response: {
          200: Type.Array(tipoEleccionModel),
        },
      },
    },
    async (req, rep) => {
      return await fastify.TipoEleccionDB.getAll();
    },
  );

  fastify.post(
    "",
    {
      schema: {
        summary: "Crear tipo de elección",
        tags: ["TipoEleccion"],
        description: "Ruta para crear un tipo de elección. Se requiere ser administrador.",
        body: tipoEleccionPostModel,
        response: {
          201: tipoEleccionModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      rep.code(201).send(await fastify.TipoEleccionDB.create(req.body));
    },
  );
};

export default tipoEleccionRoutes;
