import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { departamentoModel } from "../../../models/departamentoModel.js";

const departamentoByIdRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener departamento",
        tags: ["Departamento"],
        description: "Ruta para obtener un departamento por ID.",
        params: Type.Pick(departamentoModel, ["id_departamento"]),
        response: {
          200: departamentoModel,
        },
      },
    },
    async (req, rep) => {
      return await fastify.DepartamentoDB.getById(req.params.id_departamento);
    },
  );

  fastify.put(
    "",
    {
      schema: {
        summary: "Modificar departamento",
        tags: ["Departamento"],
        description: "Ruta para modificar un departamento. Se requiere ser administrador.",
        params: Type.Pick(departamentoModel, ["id_departamento"]),
        body: departamentoModel,
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.DepartamentoDB.update(req.params.id_departamento, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.patch(
    "",
    {
      schema: {
        summary: "Modificar departamento parcialmente",
        tags: ["Departamento"],
        description: "Ruta para modificar parcialmente un departamento. Se requiere ser administrador.",
        params: Type.Pick(departamentoModel, ["id_departamento"]),
        body: Type.Partial(departamentoModel),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.DepartamentoDB.update(req.params.id_departamento, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.delete(
    "",
    {
      schema: {
        summary: "Eliminar departamento",
        tags: ["Departamento"],
        description: "Ruta para eliminar un departamento. Se requiere ser administrador.",
        params: Type.Pick(departamentoModel, ["id_departamento"]),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.DepartamentoDB.delete(req.params.id_departamento);
      rep.code(204).send(null);
    },
  );
};

export default departamentoByIdRoutes;
