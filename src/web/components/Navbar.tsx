import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

export default function Navbar({ transparent = false }) {

  const meQuery = gql`
  query {
    me {
      _id
      discord_id
      username
      banner
      bio
      socials {
        name
        icon
        url
      }
      modules {
        name
        enabled
        content
        __typename
      }
      colours {
        progress
        level
        name
        rank
      }
      admin
      verified
      developer
      tier
      premium
      xp
      shits
      trophies
      likes
    }
  }
`;
  const { loading, error, data } = useQuery(meQuery);
  const [dashboardVisibility, setDashboardVisibility] = useState(false);

  return (
    <>
    <nav className={transparent ? "transparent" : ""}>
      <div className="container">
        <div className="row">
          <div className="col logo">
          <Link href="/"><img src={require("../static/img/awesomo_logo.svg")} /></Link>
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
          <h3>{data?.me.username ?? "User"}</h3>
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