import { createBaseService } from "./base";
import { ScriptModel } from "../models";
import { Service } from "typedi";
import { Types, Model, Document } from "mongoose";
import { fetchUser } from "../../../../bot/client";
import UserService from "./user";
import { User } from "discord.js";
import { SortDirection } from "../../../../api/routes/graphql/args";

enum DiscordScriptUserFields {
  NONE = 0x0,
  USERNAME = 0x1,
  VERIFIED = 0x2,
}

const getManyDefaults = {
  take: 12,
  skip: 0,
  sort: SortDirection.NONE
};

const BaseScriptService = createBaseService(ScriptModel);

@Service()
class ScriptService extends BaseScriptService {
  private userService = new UserService();

  public getOneByIdWithDiscordUserFields(id: Types.ObjectId, discordUserFields: number) {
    return new Promise(async (resolve, reject) => {
      try {
        const script = await this.getOneById(id);

        if (discordUserFields === DiscordScriptUserFields.NONE) {
          return resolve(script);
        }

        let discordUser;

        // Kill me now
        if (script.author_id === "feinwaru-devs") {
          discordUser = {
            authorUsername: discordUserFields & DiscordScriptUserFields.USERNAME ? "Feinwaru" : null,
            authorVerified: discordUserFields & DiscordScriptUserFields.VERIFIED ? true : null,
          };
        } else {
          // Typecast - Dirty implementation but if author_id is unset, weve got bigger issues lol
          discordUser = await fetchUser(script.author_id as string);
        }

        // Typecast - Dirty implementation but if author_id is unset, weve got bigger issues lol
        const user = await this.userService.getOneByDiscordId(script.author_id as string);

        resolve({
          ...script,
          authorUsername: discordUserFields & DiscordScriptUserFields.USERNAME ? discordUser.username : null,
          authorVerified: discordUserFields & DiscordScriptUserFields.VERIFIED ? user.verified : null,
        })

      } catch (error) {
        reject(`Service errored at getOneByIdWithDiscordUserFields: ${error}`);
      }
    });
  }

  public getManyWithDiscordUserFields(take: number = getManyDefaults.take, skip: number = getManyDefaults.skip, sort: number = getManyDefaults.sort, sortField?: string, filters?: object, discordUserFields?: number) {
    return new Promise(async (resolve, reject) => {
      try {
        // temp holy fuck
        discordUserFields = discordUserFields == null ? DiscordScriptUserFields.NONE : discordUserFields;

        const scripts = await this.getMany(take, skip, sort, sortField, filters);

        if (discordUserFields === DiscordScriptUserFields.NONE) {
          return resolve(scripts);
        }

        let discordUserPromises = scripts.data
          .map(e => e.author_id === "feinwaru-devs"
            ? new Promise(resolve => resolve({
              authorUsername: discordUserFields as number & DiscordScriptUserFields.USERNAME ? "Feinwaru" : null,
              authorVerified: discordUserFields as number & DiscordScriptUserFields.VERIFIED ? true : null,
             }))
            : fetchUser(e.author_id as string));

        // Im truly sorry for the any
        let discordUsers: any = await Promise.all(discordUserPromises);

        const users = await Promise.all(scripts.data.map(e => this.userService.getOneByDiscordId(e.author_id as string)));

        resolve({
          count: scripts.count,
          data: scripts.data.map((e, i) => ({
            ...e,
            authorUsername: discordUserFields as number & DiscordScriptUserFields.USERNAME ? discordUsers[i].username : null,
            authorVerified: discordUserFields as number & DiscordScriptUserFields.VERIFIED ? users[i].verified : null,
          })),
        });

      } catch (error) {
        reject(`Service errored at getManyWithDiscordUserFields: ${error}`);
      }
    });
  }
}

export default ScriptService;
