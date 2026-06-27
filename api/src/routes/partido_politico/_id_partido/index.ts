import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { partidoPoliticoModel } from "../../../models/partidoPoliticoModel.js";

const partidoPoliticoByIdRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener partido político",
        tags: ["PartidoPolitico"],
        description: "Ruta para obtener un partido político por ID.",
        params: Type.Pick(partidoPoliticoModel, ["id_partido"]),
        response: {
          200: partidoPoliticoModel,
        },
      },
    },
    async (req, rep) => {
      return await fastify.PartidoPoliticoDB.getById(req.params.id_partido);
    },
  );

  fastify.put(
    "",
    {
      schema: {
        summary: "Modificar partido político",
        tags: ["PartidoPolitico"],
        description: "Ruta para modificar un partido político. Se requiere ser administrador.",
        params: Type.Pick(partidoPoliticoModel, ["id_partido"]),
        body: partidoPoliticoModel,
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.PartidoPoliticoDB.update(req.params.id_partido, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.patch(
    "",
    {
      schema: {
        summary: "Modificar partido político parcialmente",
        tags: ["PartidoPolitico"],
        description: "Ruta para modificar parcialmente un partido político. Se requiere ser administrador.",
        params: Type.Pick(partidoPoliticoModel, ["id_partido"]),
        body: Type.Partial(partidoPoliticoModel),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.PartidoPoliticoDB.update(req.params.id_partido, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.delete(
    "",
    {
      schema: {
        summary: "Eliminar partido político",
        tags: ["PartidoPolitico"],
        description: "Ruta para eliminar un partido político. Se requiere ser administrador.",
        params: Type.Pick(partidoPoliticoModel, ["id_partido"]),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.PartidoPoliticoDB.delete(req.params.id_partido);
      rep.code(204).send(null);
    },
  );
};

export default partidoPoliticoByIdRoutes;
