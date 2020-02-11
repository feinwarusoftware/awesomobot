import { Types, Model, Document } from "mongoose";
import { GuildModel, ScriptModel, UserModel } from "../models";
import { IUser } from "../types";
import { ObjectType } from "typedi";
import { SortDirection } from "../../../../api/routes/graphql/args";

const getManyDefaults = {
  take: 12,
  skip: 0,
  sort: SortDirection.NONE
};

const stdCmp = (a: string | number | Date, b: string | number | Date) => {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
};

const createBaseService = <T extends Document>(modelTypeCls: Model<T>) => {
  abstract class BaseService {
    protected modelTypeCls = modelTypeCls;

    public getOneById(id: Types.ObjectId): Promise<Partial<T>> {
      return new Promise(async (resolve, reject) => {
        try {
          const data: Partial<T> = (await this.modelTypeCls.findById(id))?.toObject();
          if (data == null) {
            return reject("Service errored at getOneById: Data not found");
          }

          resolve(data);

        } catch (error) {
          reject(`Service errored at getOneById: ${error}`)
        }
      });
    }

    // NOTE: Temporary dirty filter implementation
    public getMany(take: number = getManyDefaults.take, skip: number = getManyDefaults.skip, sort: number = getManyDefaults.sort, sortField?: string, filters?: object): Promise<{ count: number, data: Partial<T>[] }> {
      return new Promise(async (resolve, reject) => {
        try {
          const count = await this.modelTypeCls.count(filters);

          let query = this.modelTypeCls.find(filters).skip(skip * take).limit(take);
          if (sort != null && sortField != null) {
            query = query.sort({
              [sortField]: sort,
            });
          }

          const data: Partial<T>[] = (await query).map(e => e.toObject());

          resolve({
            count,
            data,
          });

        } catch (error) {
          reject(`Service errored at getMany: ${error}`);
        }
      });
    }

    public createOne(data: Partial<T>): Promise<Partial<T>> {
      return new Promise(async (resolve, reject) => {
        try {
          const createData: Partial<T> = await this.modelTypeCls.create(data);
          if (createData == null) {
            return reject("Service errored at createOne: Failed to create document");
          }

          resolve(createData);

        } catch (error) {
          reject(`Service errored at createOne: ${error}`);
        }
      });
    }

        // NOTE: Temporary dirty update data implementation
    public updateOne(id: Types.ObjectId, data: object): Promise<boolean> {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await this.modelTypeCls.updateOne({ _id: id }, data);
          if (!res.ok) {
            return reject("Service errored at updateOne: Failed to update document");
          }
          
          resolve(true);

        } catch (error) {
          reject(`Service errored at updateOne: ${error}`);
        }
      });
    }

    public deleteOne(id: Types.ObjectId): Promise<boolean> {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await this.modelTypeCls.deleteOne({ _id: id });
          if (!res.ok) {
            return reject("Service errored at deleteOne: Failed to delete document");
          }

          resolve(true);

        } catch (error) {
          reject(`Service errored at deleteOne: ${error}`);
        }
      });
    }
  }

  return BaseService;
};

export {
  createBaseService,
};
