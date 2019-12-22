"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
function Header() {
    const [t, i18n] = react_i18next_1.useTranslation();
    // Note: e[0] is the key, e[1] is the value
    const translationListElements = Object.entries(i18n.store.data)
        .map((e, i) => (<li key={i} onClick={() => i18n.changeLanguage(e[0])}>
        <img src={`http://www.sciencekids.co.nz/images/pictures/flags120/${e[1].translation.flag}.jpg`}/>
        {e[1].translation.language}
      </li>));
    return (<nav>
      <div className="container">
        <div className="row">
          <div className="col logo">
            <img src={require("../static/img/awesomo_logo.svg")}/>
          </div>
          <div className="col language">
            <ul className="nav-items">
              <li className="active">
                <a>Home</a>
              </li>
              <li>
                <a>Dashboard</a>
              </li>
              <li>
                <a>Documentation</a>
              </li>
              <li>
                <a>Support Us</a>
              </li>
            </ul>
            <div className="selector">
              <p>{i18n.language.toUpperCase()}</p>
              <img className="icon" src={require("../static/img/language.svg")}/>
              <img className="arrow" src={require("../static/img/arrow_down.svg")}/>
            </div>
            <div className="dropdown">
              <ul>
                {translationListElements}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>);
}
exports.default = Header;
