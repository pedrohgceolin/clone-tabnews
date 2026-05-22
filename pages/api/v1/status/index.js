import database from "infra/database.js";
import { Query } from "pg";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const postgresVersion = await database.query("SHOW server_version;");

  const maxConnections = await database.query(
    "SELECT setting AS max_conexoes FROM pg_settings WHERE name = 'max_connections';",
  );
  const usedConnections = await database.query(
    "SELECT count(*) FROM pg_stat_activity;",
  );

  response.status(200).json({
    updated_at: updatedAt,
    postgres_version: postgresVersion.rows[0].server_version,
    max_connections: parseInt(maxConnections.rows[0].max_conexoes),
    used_connections: parseInt(usedConnections.rows[0].count),
  });
}

export default status;
