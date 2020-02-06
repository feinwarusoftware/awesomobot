import { useState } from "react";
import Link from "next/link";

// import { useTranslation } from "../i18n";

export default function Navbar({ transparent = false }) {

  // const { i18n }:any = useTranslation(["common", "languageInfo"]);

  // // Note: e[0] is the key, e[1] is the value
  // const translationListElements = i18n.store.data.en?.languageInfo ? Object.entries(i18n.store.data.en.languageInfo).map((e:any, i) => (
  //     <li key={i} onClick={() => i18n.changeLanguage(e[1].i18nCode)} >
  //       <img src={`http://www.sciencekids.co.nz/images/pictures/flags120/${e[1].flag}.jpg`} />
  //       {e[1].language}
  //     </li>
  //   )): null

  const [dashboardVisibility, setDashboardVisibility] = useState(false);

  return (
    <>
    <nav className={transparent ? "transparent" : ""}>
      <div className="container">
        <div className="row">
          <div className="col logo">
            <img src={require("../static/img/awesomo_logo.svg")} />
          </div>
          <div className="col language">
            <ul className="nav-items">
              <li className="active">
                <Link href="/">Home</Link>
              </li>
              <li onClick={() => setDashboardVisibility(!dashboardVisibility)}>
                <a>Dashboard <i className="fas fa-chevron-down ml-2" data-active={dashboardVisibility} /></a>
                
              </li>
              <li>
                <Link href="/docs">Documentation</Link>
              </li>
              <li>
                <a href="https://patreon.com/awesomo">Support Us</a>
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
    <div className={`dashboard-dropdown ${dashboardVisibility && "visible"}`}>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6 col-lg-3">
            <i className="fas fa-star" />
            <h3>Favourites</h3>
            <div className="divider" />

          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <i className="fas fa-server" />
            <h3>Server</h3>
            <div className="divider" />
            <ul>
              <li>Server Manager</li>
              <li>Legacy Stats</li>
            </ul>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <i className="fas fa-code" />
            <h3>Scripts</h3>
            <div className="divider" />
            <ul>
              <li><Link href="/dashboard/marketplace">Marketplace</Link></li>
              <li><Link href="/dashboard/editor/basic">Basic Editor</Link></li>
              <li><Link href="/dashboard/editor/advanced">Advanced Editor</Link></li>
            </ul>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <i className="fas fa-user" />
            <h3>Mattheous</h3>
            <div className="divider" />
            <ul>
              <li><Link href="/dashboard/profile/@me">View Profile</Link></li>
              <li>Logout</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}