import * as mongoose from "mongoose";

import * as schema from "./schema";
import * as models from "./models";
import * as helpers from "./helpers";

const kDefaultAddress = "127.0.0.1";
const kDefaultPort = 27017;
const kDefaultAuthSource = "admin";

const connect = (database: string, address: string = kDefaultAddress, port: number = kDefaultPort, authSource: string = kDefaultAuthSource, username?: string, password?: string) => {
  return new Promise((resolve, reject) => {

    // Build the connection string, yes this way is more readable than a million ternary operators
    let connectionString = "";
    connectionString += "mongodb://";
    if (username != null && password != null) {
      connectionString += `${username}:${password}@`;
    }
    connectionString += address;
    connectionString += `:${port}`;
    connectionString += `/${database}`;
    connectionString += `authSource=${authSource}`

    // Set the connection options
    // const connectionOptions = {
    //   useNewUrlParser: true,
    //   ...(username == null || password == null ? {} : {
    //     auth: {
    //       authdb: authSource
    //     }
    //   })
    // };

    const connectionOptions = {
      useNewUrlParser: true,
      authSource: (username == null || password == null) ?? authSource
    };

    mongoose.connect(connectionString, connectionOptions);

    // So ts would stop complaining about it
    (<any>mongoose).Promise = global.Promise;

    const conn = mongoose.connection;
    // Im assuming that this can fire errors while connecting (before the open event)
    conn.on("error", error => {
      reject(`Could not connect to mongodb database: ${error}`);
    });
    conn.on("open", () => {
      resolve();
    });
  });
}

export {
  schema,
  models,
  helpers,
  connect,
};
