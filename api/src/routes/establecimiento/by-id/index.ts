import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { establecimientoModel } from "../../../models/establecimientoModel.js";

const establecimientoByIdRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener establecimiento",
        tags: ["Establecimiento"],
        description: "Ruta para obtener un establecimiento por ID.",
        params: Type.Pick(establecimientoModel, ["id_establecimiento"]),
        response: {
          200: establecimientoModel,
        },
      },
    },
    async (req, rep) => {
      return await fastify.EstablecimientoDB.getById(req.params.id_establecimiento);
    },
  );

  fastify.put(
    "",
    {
      schema: {
        summary: "Modificar establecimiento",
        tags: ["Establecimiento"],
        description: "Ruta para modificar un establecimiento. Se requiere ser administrador.",
        params: Type.Pick(establecimientoModel, ["id_establecimiento"]),
        body: establecimientoModel,
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.EstablecimientoDB.update(req.params.id_establecimiento, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.patch(
    "",
    {
      schema: {
        summary: "Modificar establecimiento parcialmente",
        tags: ["Establecimiento"],
        description: "Ruta para modificar parcialmente un establecimiento. Se requiere ser administrador.",
        params: Type.Pick(establecimientoModel, ["id_establecimiento"]),
        body: Type.Partial(establecimientoModel),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.EstablecimientoDB.update(req.params.id_establecimiento, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.delete(
    "",
    {
      schema: {
        summary: "Eliminar establecimiento",
        tags: ["Establecimiento"],
        description: "Ruta para eliminar un establecimiento. Se requiere ser administrador.",
        params: Type.Pick(establecimientoModel, ["id_establecimiento"]),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.EstablecimientoDB.delete(req.params.id_establecimiento);
      rep.code(204).send(null);
    },
  );
};

export default establecimientoByIdRoutes;
