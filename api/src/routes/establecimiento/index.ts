import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";
import { establecimientoModel, establecimientoPostModel } from "../../models/establecimientoModel.js";

const establecimientoRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener establecimientos",
        tags: ["Establecimiento"],
        description: "Ruta para obtener todos los establecimientos.",
        response: {
          200: Type.Array(establecimientoModel),
        },
      },
    },
    async (req, rep) => {
      return await fastify.EstablecimientoDB.getAll();
    },
  );

  fastify.post(
    "",
    {
      schema: {
        summary: "Crear establecimiento",
        tags: ["Establecimiento"],
        description: "Ruta para crear un establecimiento. Se requiere ser administrador.",
        body: establecimientoPostModel,
        response: {
          201: establecimientoModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      rep.code(201).send(await fastify.EstablecimientoDB.create(req.body));
    },
  );
};

export default establecimientoRoutes;
