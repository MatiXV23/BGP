import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";
import {
  resultadoEleccionModel,
  votosPorDepartamentoModel,
  votosPorPartidoModel,
  votosPorCandidatoModel,
} from "../../models/reporetsModel.js";

const reportesRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "/resultados-eleccion",
    {
      schema: {
        summary: "Obtener resultados por elección y papeleta",
        tags: ["Reportes"],
        description: "Reporte basado en la vista v_resultados_eleccion.",
        response: {
          200: Type.Array(resultadoEleccionModel),
        },
      },
    },
    async () => {
      return await fastify.ReportesDB.getResultadosEleccion();
    },
  );

  fastify.get(
    "/votos-por-departamento",
    {
      schema: {
        summary: "Obtener votos por departamento",
        tags: ["Reportes"],
        description: "Reporte basado en la vista v_votos_por_departamento.",
        response: {
          200: Type.Array(votosPorDepartamentoModel),
        },
      },
    },
    async () => {
      return await fastify.ReportesDB.getVotosPorDepartamento();
    },
  );

  fastify.get(
    "/votos-por-partido",
    {
      schema: {
        summary: "Obtener votos por partido",
        tags: ["Reportes"],
        description: "Reporte basado en la vista v_votos_por_partido.",
        response: {
          200: Type.Array(votosPorPartidoModel),
        },
      },
    },
    async () => {
      return await fastify.ReportesDB.getVotosPorPartido();
    },
  );

  fastify.get(
    "/votos-por-candidato",
    {
      schema: {
        summary: "Obtener votos por candidato",
        tags: ["Reportes"],
        description: "Reporte basado en la vista v_votos_por_candidato.",
        response: {
          200: Type.Array(votosPorCandidatoModel),
        },
      },
    },
    async () => {
      return await fastify.ReportesDB.getVotosPorCandidato();
    },
  );
};

export default reportesRoutes;
