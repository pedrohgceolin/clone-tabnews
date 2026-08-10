import email from "infra/email.js";
import database from "infra/database.js";
import webserver from "infra/webserver.js";
import { NotFoundError } from "infra/errors.js";
import users from "models/users.js";

const EXPIRATION_IN_MILLISECONDS = 15 * 60 * 1000; // 15 minutes

async function create(userId) {
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const newToken = await runInsertQuery(userId, expiresAt);
  return newToken;

  async function runInsertQuery(userId, expiresAt) {
    const results = await database.query({
      text: `
                INSERT INTO 
                    user_activation_tokens (user_id, expires_at)
                VALUES 
                    ($1, $2)
                RETURNING
                    *
                ;`,
      values: [userId, expiresAt],
    });
    return results.rows[0];
  }
}

async function sendEmailToUser(user, activationToken) {
  await email.send({
    from: "Five contato@five.com",
    to: user.email,
    subject: "Ative seu cadastro na Five",
    text: `${user.username}, clique no link abaixo para ativar sua conta:

${webserver.origin}/cadastro/ativar/${activationToken.id}

Atenciosamente,
Equipe Five`,
  });
}

async function searchByToken(tokenId) {
  const tokenFound = await runSelectQuery(tokenId);

  return tokenFound;

  async function runSelectQuery(tokenId) {
    const results = await database.query({
      text: `
            SELECT 
                *
            FROM
                user_activation_tokens
            WHERE
                id = $1
            AND
                expires_at > NOW()
            AND 
                used_at IS NULL
            LIMIT
                1
            ;`,
      values: [tokenId],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message:
          "O token de atificação informado não foi encontrado no sistema ou expirou.",
        action: "Faça um novo cadastro",
      });
    }

    return results.rows[0];
  }
}

async function markTokenAsUsed(activationTokenId) {
  const usedActivationToken = await runUpdateQuery(activationTokenId);
  return usedActivationToken;

  async function runUpdateQuery(activationTokenId) {
    const results = await database.query({
      text: `
            UPDATE 
                user_activation_tokens
            SET
                used_at = timezone('utc',now()),
                updated_at = timezone('utc',now())
            WHERE
                id = $1
            RETURNING
                *
            `,
      values: [activationTokenId],
    });
    return results.rows[0];
  }
}

async function activateUserByUserId(userId) {
  const activatedUser = await users.setFeatures(userId, ["create:session"]);
  return activatedUser;
}

const activation = {
  sendEmailToUser,
  create,
  searchByToken,
  markTokenAsUsed,
  activateUserByUserId,
};

export default activation;
