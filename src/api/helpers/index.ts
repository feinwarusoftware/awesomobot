import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import { User } from "discord.js";

// import { sessionService } from "../../lib/db";

const kTempJwtSecret = "rawrxd";
const kDiscordUserUrl = "https://discordapp.com/api/v6/users/@me";

// temp
interface ISession extends Object {
  id: string,
  access_token: string,
  token_type: string,
  expires_in: string,
  refresh_token: string,
  scope: string,
}

const isString = (toCheck: any) => Object.prototype.toString.call(toCheck) === "[object String]";
//

const jwtSign = (payload: string | object, secret: string = kTempJwtSecret) => jwt.sign(payload, secret);

const jwtVerify = (token: string, secret: string = kTempJwtSecret) => new Promise<string | object>((resolve, reject) => {
    jwt.verify(token, secret, (error, decoded) => {
      if (error == null) {
        return resolve(decoded);
      }
      return reject(error);
    });
  });

// const fetchSession = (token: string, secret: string = kTempJwtSecret) => {
//   jwtVerify(token, secret)
//     .then(async decoded => {
//       if (isString("string")) {
//         throw new Error("session was a string, should be an object");
//       }

//       const decodedSession = decoded as ISession;

//       const session = await sessionService
//         .getOne({
//           discord: {
//             id: decodedSession.id,
//           },
//         });

//         return session;
//     });
// };

const decodeSession = (token: string, secret: string = kTempJwtSecret) => jwtVerify(token, secret)
  .then(async decoded => {
    if (isString(decoded)) {
      throw new Error("session was a string, should be an object");
    }

    return decoded as ISession;
  });

const fetchDiscordUser = (accessToken?: string): Promise<User> => {
  if (accessToken == null) {
    // fetch using client
    throw new Error("TODO: implement this!");
  }

  return fetch(kDiscordUserUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(response => response.json());
};

export {
  jwtSign,
  jwtVerify,
  decodeSession,
  fetchDiscordUser,
};
