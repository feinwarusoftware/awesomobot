import { createBaseService } from "./base";
import { UserModel } from "../models";
import { Service } from "typedi";
import { Types, Model, Document } from "mongoose";
import { fetchUser } from "../../../../bot/client";
import { User } from "discord.js";
import { IUser } from "../types";
import { SortDirection } from "../../../../api/routes/graphql/args";

enum DiscordUserFields {
  NONE = 0x0,
  USERNAME = 0x1,
  AVATAR_URL = 0x2,
}

const getManyDefaults = {
  take: 12,
  skip: 0,
  sort: SortDirection.NONE
};

const BaseUserService = createBaseService(UserModel);

@Service()
class UserService extends BaseUserService {
  public getOneByDiscordId(discordId: string): Promise<Partial<IUser>> {
    return new Promise(async (resolve, reject) => {
      try {
        const data = (await this.modelTypeCls.find({ discord_id: discordId }))[0]?.toObject();
        if (data == null) {
          return reject("Service errored at getOneById: Data not found");
        }

        resolve(data);

      } catch (error) {
        reject(`Service errored at getOneByDiscordId: ${error}`)
      }
    });
  }

  // TODO: Return type
  public getOneByDiscordIdWithDiscordFields(discordId: string, discordFields: number) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.getOneByDiscordId(discordId);

        if (discordFields === DiscordUserFields.NONE) {
          return resolve(user);
        }

        const discordUser = await fetchUser(discordId);

        resolve({
          ...user,
          username: discordFields & DiscordUserFields.USERNAME ? discordUser.username : null,
          avatarUrl: discordFields & DiscordUserFields.AVATAR_URL ? discordUser.avatarURL : null,
        });

      } catch (error) {
        reject(`Service errored at getOneByDiscordIdWithDiscordFields: ${error}`)
      }
    });
  }

  public getOneByIdWithDiscordFields(id: Types.ObjectId, discordFields: number) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.getOneById(id);

        if (discordFields === DiscordUserFields.NONE) {
          return resolve(user);
        }

        // If user.discord_id isnt set, we have bigger isues lmao
        const discordUser = await fetchUser(user.discord_id as string);

        resolve({
          ...user,
          username: discordFields & DiscordUserFields.USERNAME ? discordUser.username : null,
          avatarUrl: discordFields & DiscordUserFields.AVATAR_URL ? discordUser.avatarURL : null,
        });

      } catch (error) {
        reject(`Service errored at getOneByDiscordIdWithDiscordFields: ${error}`)
      }
    });
  }

  public getManyWithDiscordFields(take: number = getManyDefaults.take, skip: number = getManyDefaults.skip, sort: number = getManyDefaults.sort, sortField?: string, filters?: object, discordFields?: number) {
    return new Promise(async (resolve, reject) => {
      try {
        // temp holy fuck
        discordFields = discordFields == null ? DiscordUserFields.NONE : discordFields;

        const users = await this.getMany(take, skip, sort, sortField, filters);

        if (discordFields === DiscordUserFields.NONE) {
          return resolve(users);
        }

        let discordUsers = await Promise.all(users.data.map(e => fetchUser(e.discord_id as string)));

        resolve({
          count: users.count,
          data: users.data.map((e, i) => ({
            ...e,
            username: discordFields as number & DiscordUserFields.USERNAME ? discordUsers[i].username : null,
            avatarUrl: discordFields as number & DiscordUserFields.AVATAR_URL ? discordUsers[i].avatarURL : null,
          })),
        });

      } catch (error) {
        reject(`Service errored at getOneByDiscordIdWithDiscordFields: ${error}`)
      }
    });
  }

  public addUserScriptLike(id: Types.ObjectId, scriptId: string) {

  }

  public removeUserScriptLike(id: Types.ObjectId, scriptId: string) {
    
  }

  public addUserScriptLikeByDiscordId(discordId: string, scriptId: string) {
    
  }

  public removeUserScriptLikeByDiscordId(discordId: string, scriptId: string) {
    
  }
}

export default UserService;
