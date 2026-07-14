import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody.updated_at).toBeDefined();
      const parseUpdatedAt = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toEqual(parseUpdatedAt);

      expect(responseBody.postgres_version).toBeDefined();
      expect(responseBody.postgres_version).toEqual("16.0");

      expect(responseBody.max_connections).toBeDefined();
      expect(responseBody.max_connections).toEqual(100);

      expect(responseBody.used_connections).toBeDefined();
      expect(responseBody.used_connections).toEqual(1);
    });
  });
});
