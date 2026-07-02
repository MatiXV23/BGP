import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { usuarioModel } from "../../../../models/usuarioModel.js";

const usuarioPwdRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.put(
    "",
    {
      schema: {
        summary: "Cambiar contraseña",
        tags: ["Usuario"],
        description: "Ruta para cambiar la contraseña de un usuario. Se requiere ser administrador o el propio usuario.",
        params: Type.Pick(usuarioModel, ["id_usuario"]),
        body: Type.Object({ password: Type.String({ minLength: 4 }) }),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.UsuarioDB.updatePassword(req.params.id_usuario, req.body.password);
      rep.code(204).send(null);
    },
  );
};

export default usuarioPwdRoutes;
