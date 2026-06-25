import { type FastifyInstance } from "fastify";

// Geografía y establecimientos
import departamentoRoutes from "./departamento/index.js";
import departamentoByIdRoutes from "./departamento/by-id/index.js";
import zonaRoutes from "./zona/index.js";
import zonaByIdRoutes from "./zona/by-id/index.js";
import establecimientoRoutes from "./establecimiento/index.js";
import establecimientoByIdRoutes from "./establecimiento/by-id/index.js";
import circuitoRoutes from "./circuito/index.js";
import circuitoByIdRoutes from "./circuito/by-id/index.js";

// Ciudadanos
import ciudadanoRoutes from "./ciudadano/index.js";
import ciudadanoByIdRoutes from "./ciudadano/by-id/index.js";

// Elecciones
import tipoEleccionRoutes from "./tipo_eleccion/index.js";
import tipoEleccionByIdRoutes from "./tipo_eleccion/by-id/index.js";
import eleccionRoutes from "./eleccion/index.js";
import eleccionByIdRoutes from "./eleccion/by-id/index.js";

// Partidos y papeletas
import partidoPoliticoRoutes from "./partido_politico/index.js";
import partidoPoliticoByIdRoutes from "./partido_politico/by-id/index.js";
import papeletaRoutes from "./papeleta/index.js";
import papeletaByIdRoutes from "./papeleta/by-id/index.js";

// Mesas y organismos
import mesaRoutes from "./mesa/index.js";
import mesaByIdRoutes from "./mesa/by-id/index.js";
import organismoEstadoRoutes from "./organismo_estado/index.js";
import organismoEstadoByIdRoutes from "./organismo_estado/by-id/index.js";
import miembroMesaRoutes from "./miembro_mesa/index.js";
import miembroMesaByIdRoutes from "./miembro_mesa/by-id/index.js";

// Policía
import comisariaRoutes from "./comisaria/index.js";
import comisariaByIdRoutes from "./comisaria/by-id/index.js";
import agentePolicialRoutes from "./agente_policial/index.js";
import agentePolicialByIdRoutes from "./agente_policial/by-id/index.js";

// Participación y votos
import participacionVotanteRoutes from "./participacion_votante/index.js";
import participacionVotanteByIdRoutes from "./participacion_votante/by-id/index.js";
import votoRoutes from "./voto/index.js";
import votoByIdRoutes from "./voto/by-id/index.js";

export async function registerRoutes(fastify: FastifyInstance) {
  // Geografía y establecimientos
  await fastify.register(departamentoRoutes,      { prefix: "/departamentos" });
  await fastify.register(departamentoByIdRoutes,  { prefix: "/departamentos/:id_departamento" });
  await fastify.register(zonaRoutes,              { prefix: "/zonas" });
  await fastify.register(zonaByIdRoutes,          { prefix: "/zonas/:id_zona" });
  await fastify.register(establecimientoRoutes,   { prefix: "/establecimientos" });
  await fastify.register(establecimientoByIdRoutes, { prefix: "/establecimientos/:id_establecimiento" });
  await fastify.register(circuitoRoutes,          { prefix: "/circuitos" });
  await fastify.register(circuitoByIdRoutes,      { prefix: "/circuitos/:id_circuito" });

  // Ciudadanos
  await fastify.register(ciudadanoRoutes,         { prefix: "/ciudadanos" });
  await fastify.register(ciudadanoByIdRoutes,     { prefix: "/ciudadanos/:cedula_identidad" });

  // Elecciones
  await fastify.register(tipoEleccionRoutes,      { prefix: "/tipos-eleccion" });
  await fastify.register(tipoEleccionByIdRoutes,  { prefix: "/tipos-eleccion/:id_tipo" });
  await fastify.register(eleccionRoutes,          { prefix: "/elecciones" });
  await fastify.register(eleccionByIdRoutes,      { prefix: "/elecciones/:id_eleccion" });

  // Partidos y papeletas
  await fastify.register(partidoPoliticoRoutes,   { prefix: "/partidos" });
  await fastify.register(partidoPoliticoByIdRoutes, { prefix: "/partidos/:id_partido" });
  await fastify.register(papeletaRoutes,          { prefix: "/papeletas" });
  await fastify.register(papeletaByIdRoutes,      { prefix: "/papeletas/:id_papeleta" });

  // Mesas y organismos
  await fastify.register(mesaRoutes,              { prefix: "/mesas" });
  await fastify.register(mesaByIdRoutes,          { prefix: "/mesas/:id_mesa" });
  await fastify.register(organismoEstadoRoutes,   { prefix: "/organismos" });
  await fastify.register(organismoEstadoByIdRoutes, { prefix: "/organismos/:id_organismo" });
  await fastify.register(miembroMesaRoutes,       { prefix: "/miembros-mesa" });
  await fastify.register(miembroMesaByIdRoutes,   { prefix: "/miembros-mesa/:cedula_identidad" });

  // Policía
  await fastify.register(comisariaRoutes,         { prefix: "/comisarias" });
  await fastify.register(comisariaByIdRoutes,     { prefix: "/comisarias/:id_comisaria" });
  await fastify.register(agentePolicialRoutes,    { prefix: "/agentes" });
  await fastify.register(agentePolicialByIdRoutes, { prefix: "/agentes/:cedula_identidad" });

  // Participación y votos
  await fastify.register(participacionVotanteRoutes,   { prefix: "/participaciones" });
  await fastify.register(participacionVotanteByIdRoutes, { prefix: "/participaciones/:id_participacion" });
  await fastify.register(votoRoutes,              { prefix: "/votos" });
  await fastify.register(votoByIdRoutes,          { prefix: "/votos/:id_voto" });
}
