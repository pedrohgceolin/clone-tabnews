import { createRouter } from "next-connect";
import database from "infra/database.js";
import controller from "infra/controllers.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const updatedAt = new Date().toISOString();
  const postgresVersion = await database.query("SHOW server_version;");

  const maxConnections = await database.query(
    "SELECT setting AS max_conexoes FROM pg_settings WHERE name = 'max_connections';",
  );

  const databaseName = process.env.POSTGRES_DB;
  const usedConnections = await database.query({
    text: "SELECT count(*) FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  response.status(200).json({
    updated_at: updatedAt,
    postgres_version: postgresVersion.rows[0].server_version,
    max_connections: parseInt(maxConnections.rows[0].max_conexoes),
    used_connections: parseInt(usedConnections.rows[0].count),
  });
}
