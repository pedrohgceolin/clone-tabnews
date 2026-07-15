import orchestrator from "tests/orchestrator.js";
import { version as uuidversion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: "pedroceolin",
            email: 'email@gmail.com',
            password: 'senha',
          })
        },
      );

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: 'pedroceolin',
        email: 'email@gmail.com',
        password: 'senha',
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidversion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
    test("With duplicated 'email'", async () => {
      const response1 = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: "emailduplicado1",
            email: 'duplicado@gmail.com',
            password: 'senha',
          })
        },
      );

      expect(response1.status).toBe(201);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: "emailduplicado2",
            email: 'Duplicado@gmail.com',
            password: 'senha',
          })
        },
      );

      expect(response2.status).toBe(400);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        name: "ValidationError",
        message: "o email informado já está sendo utilizado",
        action: "Utilize outro email para realizar o cadastro.",
        status_code: 400
      })

    });
    test("With duplicated 'username'", async () => {
      const response3 = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: "userduplicado",
            email: 'userduplicado1@gmail.com',
            password: 'senha',
          })
        },
      );

      expect(response3.status).toBe(201);

      const response4 = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: "UserDuplicado",
            email: 'userduplicado2@gmail.com',
            password: 'senha',
          })
        },
      );

      expect(response4.status).toBe(400);

      const response4Body = await response4.json();

      expect(response4Body).toEqual({
        name: "ValidationError",
        message: "O nome de usuário informado já está sendo utilizado",
        action: "Utilize outro nome de usuário para realizar o cadastro.",
        status_code: 400
      })

    });
    
  });
});
