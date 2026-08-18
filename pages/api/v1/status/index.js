import { createRouter } from "next-connect";
import database from "infra/database.js";
import controller from "infra/controllers.js";
import authorization from "models/authorization.js";

const router = createRouter();

router.use(controller.injectAnonymousOrUser);
router.get(controller.canRequest("create:session"), getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const userTryingToGet = request.context.user;
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

  const resource = {
    updated_at: updatedAt,
    postgres_version: postgresVersion.rows[0].server_version,
    max_connections: parseInt(maxConnections.rows[0].max_conexoes),
    used_connections: parseInt(usedConnections.rows[0].count),
  };

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    "read:status",
    resource,
  );

  return response.status(200).json(secureOutputValues);
}
