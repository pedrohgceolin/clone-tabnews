import orchestrator from "tests/orchestrator.js";
import webserver from "infra/webserver.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.authorizationTestRunPendingMigrations();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Running pending migrations", async () => {
      const response = await fetch(`${webserver.origin}/api/v1/migrations`, {
        method: "POST",
      });
      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "Você não possui permissão para executar esta ação.",
        action:
          'Verifique se o seu usuário possui a feature "update:migrations"',
        status_code: 403,
      });
    });
  });

  describe("Default user", () => {
    test("Running pending migrations", async () => {
      const defaultUser = await orchestrator.createUser();
      await orchestrator.activateUser(defaultUser);

      const sessionObject = await orchestrator.createSession(defaultUser);

      const response = await fetch(`${webserver.origin}/api/v1/migrations`, {
        method: "POST",
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });
      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "Você não possui permissão para executar esta ação.",
        action:
          'Verifique se o seu usuário possui a feature "update:migrations"',
        status_code: 403,
      });
    });
  });

  describe("Privileged user", () => {
    describe("Running pending migrations", () => {
      let privilegedUser;
      let sessionObject;

      test("For the first time", async () => {
        privilegedUser = await orchestrator.createUser();
        await orchestrator.activateUser(privilegedUser);
        sessionObject = await orchestrator.createSession(privilegedUser);
        await orchestrator.addFeaturesToUser(privilegedUser, [
          "update:migrations",
        ]);
        const response = await fetch(`${webserver.origin}/api/v1/migrations`, {
          method: "POST",
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        });

        expect(response.status).toBe(201);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody.length).toBeGreaterThan(0);
      });

      test("For the second time", async () => {
        const response2 = await fetch(`${webserver.origin}/api/v1/migrations`, {
          method: "POST",
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        });
        expect(response2.status).toBe(200);

        const response2Body = await response2.json();

        expect(Array.isArray(response2Body)).toBe(true);
        expect(response2Body.length).toBe(0);
      });
    });
  });
});
