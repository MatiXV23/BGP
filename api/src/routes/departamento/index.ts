import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";
import { departamentoModel, departamentoPostModel } from "../../models/departamentoModel.js";

const departamentoRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener departamentos",
        tags: ["Departamento"],
        description: "Ruta para obtener todos los departamentos.",
        response: {
          200: Type.Array(departamentoModel),
        },
      },
    },
    async (req, rep) => {
      return await fastify.DepartamentoDB.getAll();
    },
  );

  fastify.post(
    "",
    {
      schema: {
        summary: "Crear departamento",
        tags: ["Departamento"],
        description: "Ruta para crear un departamento. Se requiere ser administrador.",
        body: departamentoPostModel,
        response: {
          201: departamentoModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      rep.code(201).send(await fastify.DepartamentoDB.create(req.body));
    },
  );
};

export default departamentoRoutes;
