import email from "infra/email.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmail();
    await email.send({
      from: "Five <pedroceolin@gmail.com>",
      to: "<contato@gmail.com>",
      subject: "Teste de assunto",
      text: "Teste de corpo",
    });

    await email.send({
      from: "Five <pedroceolin@gmail.com>",
      to: "<contato@gmail.com>",
      subject: "Ultimo email enviado",
      text: "Teste de ultimo email",
    });

    const lastEmail = await orchestrator.getLastEmail();
    expect(lastEmail.sender).toBe("<pedroceolin@gmail.com>");
    expect(lastEmail.recipients[0]).toBe("<contato@gmail.com>");
    expect(lastEmail.subject).toBe("Ultimo email enviado");
    expect(lastEmail.text).toBe("Teste de ultimo email\n");
  });
});
