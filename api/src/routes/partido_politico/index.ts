import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";
import { partidoPoliticoModel, partidoPoliticoPostModel } from "../../models/partidoPoliticoModel.js";

const partidoPoliticoRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener partidos políticos",
        tags: ["PartidoPolitico"],
        description: "Ruta para obtener todos los partidos políticos.",
        response: {
          200: Type.Array(partidoPoliticoModel),
        },
      },
    },
    async (req, rep) => {
      return await fastify.PartidoPoliticoDB.getAll();
    },
  );

  fastify.post(
    "",
    {
      schema: {
        summary: "Crear partido político",
        tags: ["PartidoPolitico"],
        description: "Ruta para crear un partido político. Se requiere ser administrador.",
        body: partidoPoliticoPostModel,
        response: {
          201: partidoPoliticoModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      rep.code(201).send(await fastify.PartidoPoliticoDB.create(req.body));
    },
  );
};

export default partidoPoliticoRoutes;
