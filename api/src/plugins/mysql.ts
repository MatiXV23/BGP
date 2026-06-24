import fp from "fastify-plugin";
import fastifyMysql, { MySQLPromisePool } from "@fastify/mysql";
import type { FastifyInstance } from "fastify";

export default fp(async (fastify: FastifyInstance) => {
  fastify.register(fastifyMysql, {
    promise: true, 
    host: process.env.MYSQL_HOST ?? "localhost",
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,

    connectionLimit: 10,        
    waitForConnections: true,
    queueLimit: 0,
    connectTimeout: 10000,      
    idleTimeout: 1000,          
  });
});


declare module "fastify" {
  interface FastifyInstance {
    mysql: MySQLPromisePool;
  }
}