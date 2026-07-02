import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { emitirVotoBodyModel, emitirVotoResponseModel } from "../../../../models/mesaModel.js";

const votarRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    "",
    {
      schema: {
        summary: "Emitir voto",
        tags: ["Mesa"],
        description:
          "Registra la participación de la credencial (bloquea doble voto) y el voto emitido en la mesa del usuario logeado, con las papeletas elegidas o en blanco si no se selecciona ninguna.",
        body: emitirVotoBodyModel,
        response: {
          201: emitirVotoResponseModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
    },
    async (req, rep) => {
      rep.code(201).send(await fastify.MesaDB.emitirVoto(req.user.cedula_identidad, req.body));
    },
  );
};

export default votarRoutes;
