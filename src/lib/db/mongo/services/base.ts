import { Types, Model, Document } from "mongoose";
import { GuildModel, ScriptModel, UserModel } from "../models";
import { ObjectType } from "typedi";

const createBaseService = <T extends Document>(classTypeCls: Model<T>) => {
  abstract class BaseService {  
    public getOneById(id: Types.ObjectId) {

    }
  
    public getMany(take: number, skip: number, sort: number) {

    }
  
    public createOne(data: Partial<T>) {

    }
  
    public updateOne(id: Types.ObjectId, data: Partial<T>) {

    }
  
    public deleteOne(id: Types.ObjectId) {

    }
  }

  return BaseService;
};

const createBaseDiscordService = <T extends Document>(classTypeCls: Model<T>) => {
  const BaseService = createBaseService(classTypeCls);

  abstract class BaseDiscordService extends BaseService {  
    public getOneById(id: Types.ObjectId) {
  
    }
  
    public getMany(take: number, skip: number, sort: number) {
  
    }
  
    public createOne(data: Partial<T>) {
  
    }
  
    public updateOne(id: Types.ObjectId, data: Partial<T>) {
  
    }
  
    public deleteOne(id: Types.ObjectId) {
  
    }
  }

  return BaseDiscordService;
};

export {
  createBaseService,
  createBaseDiscordService,
};
