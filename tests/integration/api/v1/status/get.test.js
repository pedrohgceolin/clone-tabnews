test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();
  const parseUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parseUpdatedAt);

  expect(responseBody.postgres_version).toBeDefined();
  expect(responseBody.postgres_version).toEqual("16.0");
  console.log(responseBody.postgres_version);

  expect(responseBody.max_connections).toBeDefined();
  expect(responseBody.max_connections).toEqual(100);
  console.log(responseBody.max_connections);

  expect(responseBody.used_connections).toBeDefined();
  expect(responseBody.used_connections).toEqual(1);
  console.log(responseBody.used_connections);
});