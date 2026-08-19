import orchestrator from "tests/orchestrator.js";
import webserver from "infra/webserver.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch(`${webserver.origin}/api/v1/status`);
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        max_connections: 100,
        used_connections: 1,
      });
    });
  });

  describe("Default user", () => {
    test("Retrieving current system status", async () => {
      const defaultUser = await orchestrator.createUser();

      await orchestrator.activateUser(defaultUser);

      const sessionObject = await orchestrator.createSession(defaultUser.id);

      const response = await fetch(`${webserver.origin}/api/v1/status`, {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        max_connections: 100,
        used_connections: 1,
      });
    });
  });

  describe("Privileged user", () => {
    test("Retrieving current system status", async () => {
      const privilegedUser = await orchestrator.createUser();

      await orchestrator.activateUser(privilegedUser);

      const sessionObject = await orchestrator.createSession(privilegedUser.id);

      await orchestrator.addFeaturesToUser(privilegedUser, [
        "read:status:admin",
      ]);

      const response = await fetch(`${webserver.origin}/api/v1/status`, {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        postgres_version: "16.0",
        updated_at: responseBody.updated_at,
        max_connections: 100,
        used_connections: 1,
      });
    });
  });
});
