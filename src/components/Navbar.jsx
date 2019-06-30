import React, { Component } from "react";
import { Link } from "react-router-dom";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.navbar = React.createRef();
    this.dashboard = React.createRef();
    this.button = React.createRef();
  }

  componentDidMount() {
    /* ~~ Fancy OwO Console Log UwU ycnaF ~~ */
    console.log(`%cSPPD by Feinwaru`, "font-weight: bold; font-size: 50px; color: #1E98A1");
    console.log("GitHub: https://github.com/feinwarusoftware/sppd");
    console.log("Discord: https://discord.feinwaru.com/");
    console.log("API Docs: https://github.com/feinwarusoftware/sppd/blob/master/docs/api.md");
  }

  mobileDropdown = () => {
    if (this.navbar.current.classList.contains("dropped")) {
      this.navbar.current.classList.remove("dropped");
    } else {
      this.navbar.current.classList.add("dropped");
    }
  };

  displayDashboard = () => {
    if (this.button.current.classList.contains("active")) {
      this.button.current.classList.remove("active");
      this.dashboard.current.classList.remove("active");
    } else {
      this.button.current.classList.add("active");
      this.dashboard.current.classList.add("active");
    }
  };

  render() {
    return (
      <React.Fragment>
        <nav ref={this.navbar}>
          <div className="container">
            <Link to={{ pathname: "/" }}>
              <img draggable="false" src={require("../static/img/awesomo_mini.svg")} />
            </Link>
            <i
              onClick={() => this.mobileDropdown()}
              id="dropdown"
              className="fas fa-bars float-right fa-2x"
            />
            <ul>
              <li>
                <Link to={{ pathname: "/" }}>Home</Link>
              </li>
              <li className="dashboard" ref={this.button}>
                <a
                  onClick={() => {
                    this.displayDashboard();
                  }}
                >
                  Dashboard
                </a>
                <i className="fas fa-chevron-down" />
              </li>
              <li>
                <Link to={{ pathname: "/" }}>Documentation</Link>
              </li>
              <li>
                <a href="https://sppd.feinwaru.com/">Phone Destroyer</a>
              </li>
              <li>
                <a className="premium" href="https://patreon.com/awesomo/">
                  Premium
                </a>
              </li>
              <li>
                <a>
                  <i className="fas fa-globe-africa" /> EN
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div id="dashboard" ref={this.dashboard}>
          <div className="container">
            <div className="row my-5 justify-content-end">
              <div className="col-12 col-sm-6 col-lg-3">
                <h2 className="font-weight-bold mb-0">
                  <i className="fas fa-star" /> Favourites
                </h2>
                <div className="divider" />
                <ul>
                  <li>
                    <a href="https://sppd.feinwaru.com/">Phone Destroyer</a>
                  </li>
                  <li>
                    <a href="https://patreon.com/awesomo/">Premium</a>
                  </li>
                </ul>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <h2 className="font-weight-bold mb-0">Scripts</h2>
                <div className="divider" />
                {/*<div className="promo text" style={{backgroundImage: "url(https://cdn.discordapp.com/attachments/456771924639612940/466128291171008522/banner.png)"}}>
                  <div>
                    <a href="https://patreon.com/awesomo/">Marketplace</a>
                  </div>
                </div> */}
                <ul>
                  <li>
                    <a href="https://sppd.feinwaru.com/">Commands List</a>
                  </li>
                  <li>
                    <Link to={{ pathname: "/marketplace" }}>Marketplace</Link>
                  </li>
                  <li>
                    <a href="https://patreon.com/awesomo/">Basic Script Editor</a>
                  </li>
                  <li>
                    <a href="https://patreon.com/awesomo/">Advanced Script Editor</a>
                  </li>
                </ul>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <h2 className="font-weight-bold mb-0">Patrons</h2>
                <div className="divider" />
                <ul>
                  <li>
                    <Link to={{ pathname: "/servermanager" }}>Server Manager</Link>
                  </li>
                  <li>
                    <a href="https://patreon.com/awesomo/">Script Manager</a>
                  </li>
                </ul>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <h2 className="font-weight-bold mb-0">Mattheous</h2>
                <div className="divider" />
                <div
                  className="promo text"
                  style={{
                    backgroundImage:
                      "url(https://cdn.discordapp.com/avatars/190914446774763520/3316fe4c96a0dd028bf44bc1bcb06142.png?size=512)"
                  }}
                >
                  <div>
                    <a href="https://patreon.com/awesomo/">Super Best Friend</a>
                  </div>
                </div>
                <ul>
                  <li>
                    <a href="https://sppd.feinwaru.com/">View/Edit Profile</a>
                  </li>
                  <li>
                    <a href="https://sppd.feinwaru.com/">Sign Out</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Navbar;
