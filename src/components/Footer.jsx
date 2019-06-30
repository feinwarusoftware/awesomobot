import React, { Component } from "react";
import { Link } from "react-router-dom";

class Footer extends Component {
  render() {
    return (
      <React.Fragment>
        <footer>
          <img draggable="false" className="swoosh" src={require("../static/img/footer.svg")} />
          <div className="footer-contents">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-xs-12 col-md-6 col-lg-3">
                  <img
                    draggable="false"
                    className="img-fluid mx-auto px-4 mb-3"
                    src={require("../static/img/feinwaru_logo.svg")}
                  />
                  <p>&copy; 2017 - {new Date().getFullYear()} Copyright: Feinwaru Software</p>
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                  <h2>ABOUT</h2>
                  <h1>FEINWARU</h1>
                  <ul>
                    <li>
                      <a href="https://awesomo.feinwaru.com/soontm">Our Team</a>
                    </li>
                    <li>
                      <Link to={{ pathname: "/branding" }}>Branding</Link>
                    </li>
                    <li>
                      <a href="https://discord.feinwaru.com/">Discord</a>
                    </li>
                    <li>
                      <a href="https://awesomo.feinwaru.com/soontm">Careers</a>
                    </li>
                  </ul>
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                  <h2>OUR</h2>
                  <h1>PROJECTS</h1>
                  <ul>
                    <li>
                      <a href="https://awesomo.feinwaru.com/">AWESOM-O</a>
                    </li>
                    <li>
                      <a href="https://sppd.feinwaru.com/">SPPD</a>
                    </li>
                    <li>
                      <a href="https://awesomo.feinwaru.com/soontm">SPPD Mobile</a>
                    </li>
                    <li>
                      <a href="https://awesomo.feinwaru.com/soontm">more...</a>
                    </li>
                  </ul>
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                  <h2>EXTRA</h2>
                  <h1>RESOURCES</h1>
                  <ul>
                    <li>
                      <a href="https://awesomo.feinwaru.com/docs/welcome">Help & Support</a>
                    </li>
                    <li>
                      <a href="https://github.com/feinwarusoftware/sppd">Developers</a>
                    </li>
                    <li>
                      <a href="https://github.com/feinwarusoftware/sppd/issues/new">Feedback</a>
                    </li>
                    <li>
                      <a href="https://awesomo.feinwaru.com/soontm">Terms & Privacy</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </React.Fragment>
    );
  }
}

export default Footer;
