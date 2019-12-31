import fetch from "node-fetch";
import jwt from "jsonwebtoken";

import { sessionService } from "../../lib/db";

const kTempJwtSecret = "rawrxd";

const jwtVerify = (token: string, secret: string) => new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error: any, decoded: any) => {
      if (error == null) {
        return resolve(decoded);
      }
      return reject(error);
    });
  });

const fetchSession = (token: string) => {
  jwtVerify(token, kTempJwtSecret)
    .then(async (decoded: any) => {
      const session = await sessionService
        .getOne({
          discord: {
            id: decoded.id
          }
        });

        return session;
    });
};

const fetchDiscordUser = (accessToken: string) => {
  fetch("https://discordapp.com/api/v6/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(response => response.json());
};

export {
  fetchDiscordUser,
  fetchSession,
};
