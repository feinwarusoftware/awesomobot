import React from "react";
import { useTranslation } from "react-i18next";

export default function Header() {

  const [t, i18n] = useTranslation();

  // Note: e[0] is the key, e[1] is the value
  const translationListElements = Object.entries(i18n.store.data)
    .map((e, i) => (
      <li key={i} onClick={() => i18n.changeLanguage(e[0])} >
        <img src={`http://www.sciencekids.co.nz/images/pictures/flags120/${e[1].translation.flag}.jpg`} />
        {e[1].translation.language}
      </li>
    ));

  return (
    <div className="swoosh-container" style={{ backgroundImage: `url(${require("../static/img/header.svg")})` }}>
      <div>
        <div className="container language">
          <div className="selector">
            <p>{i18n.language.toUpperCase()}</p>
            <img className="icon" src={require("../static/img/language.svg")} />
            <img className="arrow" src={require("../static/img/arrow_down.svg")} />
          </div>
          <div className="dropdown">
            <ul>
              {translationListElements}
            </ul>
          </div>
        </div>
        <img className="logo" src={require("../static/img/header_logo.svg")} />
        <h1 dangerouslySetInnerHTML={{__html: t("Slogan")}}></h1>
      </div>
    </div>
  );
}
