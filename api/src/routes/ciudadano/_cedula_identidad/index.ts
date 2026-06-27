import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { ciudadanoModel } from "../../../models/ciudadanoModel.js";

const ciudadanoByIdRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener ciudadano",
        tags: ["Ciudadano"],
        description: "Ruta para obtener un ciudadano por cédula de identidad.",
        params: Type.Pick(ciudadanoModel, ["cedula_identidad"]),
        response: {
          200: ciudadanoModel,
        },
      },
    },
    async (req, rep) => {
      return await fastify.CiudadanoDB.getById(req.params.cedula_identidad);
    },
  );

  fastify.put(
    "",
    {
      schema: {
        summary: "Modificar ciudadano",
        tags: ["Ciudadano"],
        description: "Ruta para modificar un ciudadano. Se requiere ser administrador.",
        params: Type.Pick(ciudadanoModel, ["cedula_identidad"]),
        body: ciudadanoModel,
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.CiudadanoDB.update(req.params.cedula_identidad, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.patch(
    "",
    {
      schema: {
        summary: "Modificar ciudadano parcialmente",
        tags: ["Ciudadano"],
        description: "Ruta para modificar parcialmente un ciudadano. Se requiere ser administrador.",
        params: Type.Pick(ciudadanoModel, ["cedula_identidad"]),
        body: Type.Partial(ciudadanoModel),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.CiudadanoDB.update(req.params.cedula_identidad, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.delete(
    "",
    {
      schema: {
        summary: "Eliminar ciudadano",
        tags: ["Ciudadano"],
        description: "Ruta para eliminar un ciudadano. Se requiere ser administrador.",
        params: Type.Pick(ciudadanoModel, ["cedula_identidad"]),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.CiudadanoDB.delete(req.params.cedula_identidad);
      rep.code(204).send(null);
    },
  );
};

export default ciudadanoByIdRoutes;
