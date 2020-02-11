import { createBaseService } from "./base";
import { GuildModel } from "../models";
import { Service } from "typedi";
import { Types, Model, Document } from "mongoose";

const BaseGuildService = createBaseService(GuildModel);

@Service()
class GuildService extends BaseGuildService {
  public getOneByDiscordId(discordId: string) {
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

  public addGuildScript(id: Types.ObjectId, scriptId: string) {

  }

  public removeGuildScript(id: Types.ObjectId, scriptId: string) {
    
  }

  public addGuildScriptByDiscordId(discordId: string, scriptId: string) {
    
  }

  public removeGuildScriptByDiscordId(discordId: string, scriptId: string) {
    
  }
}

export default GuildService;
