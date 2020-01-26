// import { useTranslation } from "../i18n";

export default function Navbar({ transparent = false }) {

  // const { i18n }:any = useTranslation(["common", "languageInfo"]);

  // // Note: e[0] is the key, e[1] is the value
  // const translationListElements = i18n.store.data.en?.languageInfo ? Object.entries(i18n.store.data.en.languageInfo).map((e:any, i) => (
  //     <li key={i} onClick={() => i18n.changeLanguage(e[1].i18nCode)} >
  //       <img src={`http://www.sciencekids.co.nz/images/pictures/flags120/${e[1].flag}.jpg`} />
  //       {e[1].language}
  //     </li>
  //   )): null;

  return (
    <nav className={transparent ? "transparent" : ""}>
      <div className="container">
        <div className="row">
          <div className="col logo">
            <img src={require("../static/img/awesomo_logo.svg")} />
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
            {/* <div className="selector">
              <p>{i18n.language?.toUpperCase()}</p>
              <img className="icon" src={require("../static/img/language.svg")} />
              <img className="arrow" src={require("../static/img/arrow_down.svg")} />
            </div>
            <div className="dropdown">
              <ul>
                {translationListElements}
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </nav>
  );
}