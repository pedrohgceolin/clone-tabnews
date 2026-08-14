import { createRouter } from "next-connect";
import controller from "infra/controllers.js";
import migrator from "models/migrator.js";
import authorization from "models/authorization.js";

const router = createRouter();

router.use(controller.injectAnonymousOrUser);
router.get(controller.canRequest("read:migrations"), getHandler);
router.post(controller.canRequest("update:migrations"), postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const userTryingToPost = request.context.user;
  const pendingMigrations = await migrator.listPendingMigrations();

  const secureOutputValues = authorization.filterOutput(
    userTryingToPost,
    "read:migrations",
    pendingMigrations,
  );
  return response.status(200).json(secureOutputValues);
}

async function postHandler(request, response) {
  const userTryingToPost = request.context.user;
  const migratedMigrations = await migrator.runPendingMigrations();

  if (migratedMigrations.length > 0) {
    const secureOutputValues = authorization.filterOutput(
      userTryingToPost,
      "update:migrations",
      migratedMigrations,
    );

    return response.status(201).json(secureOutputValues);
  }

  const secureOutputValues = authorization.filterOutput(
    userTryingToPost,
    "update:migrations",
    migratedMigrations,
  );

  return response.status(200).json(secureOutputValues);
}
