import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { eleccionModel } from "../../../../models/eleccionModel.js";
import { resultadosEleccionModel } from "../../../../models/resultadosModel.js";

const resultadosRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener resultados de una elección",
        tags: ["Eleccion"],
        description:
          "Ruta para obtener los resultados de una elección por papeleta, por departamento y por partido, usando las vistas v_resultados_eleccion, v_votos_por_departamento y v_votos_por_partido.",
        params: Type.Pick(eleccionModel, ["id_eleccion"]),
        response: {
          200: resultadosEleccionModel,
        },
      },
    },
    async (req, rep) => {
      return await fastify.ResultadosDB.getResultadosPorEleccion(req.params.id_eleccion);
    },
  );
};

export default resultadosRoutes;
