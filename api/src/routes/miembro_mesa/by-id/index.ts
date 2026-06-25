import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { miembroMesaModel } from "../../../models/miembroMesaModel.js";

const miembroMesaByIdRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener miembro de mesa",
        tags: ["MiembroMesa"],
        description: "Ruta para obtener un miembro de mesa por cédula de identidad.",
        params: Type.Pick(miembroMesaModel, ["cedula_identidad"]),
        response: {
          200: miembroMesaModel,
        },
      },
    },
    async (req, rep) => {
      return await fastify.MiembroMesaDB.getById(req.params.cedula_identidad);
    },
  );

  fastify.put(
    "",
    {
      schema: {
        summary: "Modificar miembro de mesa",
        tags: ["MiembroMesa"],
        description: "Ruta para modificar un miembro de mesa. Se requiere ser administrador.",
        params: Type.Pick(miembroMesaModel, ["cedula_identidad"]),
        body: miembroMesaModel,
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.MiembroMesaDB.update(req.params.cedula_identidad, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.patch(
    "",
    {
      schema: {
        summary: "Modificar miembro de mesa parcialmente",
        tags: ["MiembroMesa"],
        description: "Ruta para modificar parcialmente un miembro de mesa. Se requiere ser administrador.",
        params: Type.Pick(miembroMesaModel, ["cedula_identidad"]),
        body: Type.Partial(miembroMesaModel),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.MiembroMesaDB.update(req.params.cedula_identidad, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.delete(
    "",
    {
      schema: {
        summary: "Eliminar miembro de mesa",
        tags: ["MiembroMesa"],
        description: "Ruta para eliminar un miembro de mesa. Se requiere ser administrador.",
        params: Type.Pick(miembroMesaModel, ["cedula_identidad"]),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.MiembroMesaDB.delete(req.params.cedula_identidad);
      rep.code(204).send(null);
    },
  );
};

export default miembroMesaByIdRoutes;
