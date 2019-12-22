"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// All the other imports (basically react lol)
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
// All of our shit
require("./app.scss");
require("./i18n");
const Home_1 = __importDefault(require("./views/Home"));
react_dom_1.default.render(react_1.default.createElement(Home_1.default), document.getElementById("root"));
