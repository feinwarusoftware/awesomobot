"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = __importStar(require("./schema"));
exports.schema = schema;
const models = __importStar(require("./models"));
exports.models = models;
const helpers = __importStar(require("./helpers"));
exports.helpers = helpers;
const kDefaultAddress = "127.0.0.1";
const kDefaultPort = 27017;
const kDefaultAuthSource = "admin";
const connect = (database, address = kDefaultAddress, port = kDefaultPort, authSource = kDefaultAuthSource, username, password) => {
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
        connectionString += `?authSource=${authSource}`;
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
            authSource: authSource
        };
        mongoose_1.default.connect(connectionString, connectionOptions);
        // So ts would stop complaining about it
        mongoose_1.default.Promise = global.Promise;
        const conn = mongoose_1.default.connection;
        // Im assuming that this can fire errors while connecting (before the open event)
        conn.on("error", error => {
            reject(`Could not connect to mongodb database: ${error}`);
        });
        conn.on("open", () => {
            resolve();
        });
    });
};
exports.connect = connect;
//# sourceMappingURL=index.js.map