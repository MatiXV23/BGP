import fastifyPlugin from "fastify-plugin";
import { DepartamentoDB } from "../services/departamentoDB.js";
import { ZonaDB } from "../services/zonaDB.js";
import { EstablecimientoDB } from "../services/establecimientoDB.js";
import { CircuitoDB } from "../services/circuitoDB.js";
import { CiudadanoDB } from "../services/ciudadanoDB.js";
import { TipoEleccionDB } from "../services/tipoEleccionDB.js";
import { EleccionDB } from "../services/eleccionDB.js";
import { OrganismoEstadoDB } from "../services/organismoEstadoDB.js";
import { MiembroMesaDB } from "../services/miembroMesaDB.js";
import { ComisariaDB } from "../services/comisariaDB.js";
import { AgentePolicialDB } from "../services/agentePolicialDB.js";
import { MesaDB } from "../services/mesaDB.js";
import { PartidoPoliticoDB } from "../services/partidoPoliticoDB.js";
import { PapeletaDB } from "../services/papeletaDB.js";
import { ParticipacionVotanteDB } from "../services/participacionVotanteDB.js";
import { VotoDB } from "../services/votoDB.js";

export default fastifyPlugin(async function (fastify) {
  fastify.decorate("DepartamentoDB", new DepartamentoDB(fastify.mysql));
  fastify.decorate("ZonaDB", new ZonaDB(fastify.mysql));
  fastify.decorate("EstablecimientoDB", new EstablecimientoDB(fastify.mysql));
  fastify.decorate("CircuitoDB", new CircuitoDB(fastify.mysql));
  fastify.decorate("CiudadanoDB", new CiudadanoDB(fastify.mysql));
  fastify.decorate("TipoEleccionDB", new TipoEleccionDB(fastify.mysql));
  fastify.decorate("EleccionDB", new EleccionDB(fastify.mysql));
  fastify.decorate("OrganismoEstadoDB", new OrganismoEstadoDB(fastify.mysql));
  fastify.decorate("MiembroMesaDB", new MiembroMesaDB(fastify.mysql));
  fastify.decorate("ComisariaDB", new ComisariaDB(fastify.mysql));
  fastify.decorate("AgentePolicialDB", new AgentePolicialDB(fastify.mysql));
  fastify.decorate("MesaDB", new MesaDB(fastify.mysql));
  fastify.decorate("PartidoPoliticoDB", new PartidoPoliticoDB(fastify.mysql));
  fastify.decorate("PapeletaDB", new PapeletaDB(fastify.mysql));
  fastify.decorate(
    "ParticipacionVotanteDB",
    new ParticipacionVotanteDB(fastify.mysql),
  );
  fastify.decorate("VotoDB", new VotoDB(fastify.mysql));
});

declare module "fastify" {
  interface FastifyInstance {
    DepartamentoDB: DepartamentoDB;
    ZonaDB: ZonaDB;
    EstablecimientoDB: EstablecimientoDB;
    CircuitoDB: CircuitoDB;
    CiudadanoDB: CiudadanoDB;
    TipoEleccionDB: TipoEleccionDB;
    EleccionDB: EleccionDB;
    OrganismoEstadoDB: OrganismoEstadoDB;
    MiembroMesaDB: MiembroMesaDB;
    ComisariaDB: ComisariaDB;
    AgentePolicialDB: AgentePolicialDB;
    MesaDB: MesaDB;
    PartidoPoliticoDB: PartidoPoliticoDB;
    PapeletaDB: PapeletaDB;
    ParticipacionVotanteDB: ParticipacionVotanteDB;
    VotoDB: VotoDB;
  }
}
