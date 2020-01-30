"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../lib/db");
const buildFastify_1 = __importDefault(require("./buildFastify"));
const port = process.env.WEBSERVER_PORT;
const config = {
    webServerSettings: {
        logger: true,
    },
    port,
    address: "0.0.0.0",
    database: "awnext",
};
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    const server = buildFastify_1.default(config.webServerSettings);
    try {
        yield db_1.connect(config.database);
        yield server.listen(config.port, config.address);
        server.log.info(`magic happens on port ${config.webServerSettings}`);
    }
    catch (error) {
        server.log.error(error);
        process.exit(-1);
    }
});
start();
//# sourceMappingURL=index.js.map