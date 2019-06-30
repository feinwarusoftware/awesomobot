import React, { Component } from "react";
import { Navbar, Footer, Search, News, Cookie } from "../components";
import { withRouter } from "react-router-dom";
import MetaTags from "react-meta-tags";

// const Nav = withRouter(Navbar);

class ServerManager extends Component {
  constructor(props) {
    super(props);
    this.state = { width: window.innerWidth };
    this.nav = React.createRef();
  }

  componentDidMount = () => {
    this.updateWindowDimensions();
    this.updateScrollPosition();
    window.addEventListener("resize", this.updateWindowDimensions);
    window.addEventListener("scroll", this.updateScrollPosition);

    let navchild = this.nav.current.navbar.current;
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateWindowDimensions);
    window.removeEventListener("scroll", this.updateScrollPosition);
  };

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth });
  };

  updateScrollPosition = () => {
    //console.log(this.nav);

    if (window.scrollY < 60) {
      this.nav.current.navbar.current.classList.add("trans");
    } else {
      this.nav.current.navbar.current.classList.remove("trans");
    }

    //this.setState({ scroll: window.scrollY });
  };

  render() {
    return (
      <div>
        <MetaTags>
          <title>Feinwaru Software</title>
          <meta
            name="description"
            content="SPPD is a website created to let users see all the statistics for the game 'South Park: Phone Destroyer' in an easy to use and understand way."
          />
          <meta property="og:title" content="Card List | Feinwaru SPPD" />
          <meta
            property="og:image"
            content="https://cdn.discordapp.com/attachments/558375135719981056/564821280944029716/cards.png"
          />
        </MetaTags>

        <Navbar ref={this.nav} />
        <Cookie />

        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="titlebar main">
                <div className="col-8 col-md-10 pl-sm-0">
                  <h2 className="font-weight-bold mb-0">Server Manager</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-100 banner"
          viewBox={`${this.state.width > 1920 ? "0" : (1920 - this.state.width) / 2} 0 ${
            this.state.width > 1920 ? "1920" : this.state.width
          } 491.125`}
          filter="brightness(.5)"
        >
          <defs>
            <clipPath id="banner">
              <path
                d="M-1,325.3s370.314,177.1,930.267,91.215S1919,502.764,1919,502.764V11.639L-.991,11.684Z"
                transform="translate(1 -11.639)"
              />
            </clipPath>
          </defs>
          <image
            xlinkHref="https://cdn.discordapp.com/attachments/558375135719981056/594546183217872906/unknown.png"
            clipPath="url(#banner)"
            width="1920"
            height="500"
            y="-6px"
          />
        </svg>
        <div className="container my-5">
          <div className="row mt-5">
            <div className="col-12">
              <h2 className="font-weight-bold mb-0">
                You are currently using 2 of 3 servers available in your plan
              </h2>
              <div className="divider" />
              <p className="font-weight-bold">Don't see your server?</p>
              <ol>
                <li>
                  You need to be the Owner or have Admin permissions on the server for it to show up
                </li>
                <li>AWESOM-O has not been added to your server</li>
              </ol>
            </div>
          </div>

          {/* Not added */}
          <div className="row mt-5">
            <div className="col-md-6 col-lg-4">
              <div className="card my-5 pt-5">
                <img
                  src="https://cdn.discordapp.com/icons/285051699717210113/46c3644d5b186e2305295633140347b6"
                  className="circle"
                />
                <div className="m-3 mt-5 mb-5 text-center">
                  <h3 className="font-weight-bold">Dream Theater</h3>
                  <button href="#" className="btn px-4 btn-awesomo mt-4">
                    Add AWESOM-O
                  </button>
                </div>
              </div>
            </div>

            {/* Activated */}
            <div className="col-md-6 col-lg-4">
              <div className="card my-5 pt-5">
                <img
                  src="https://cdn.discordapp.com/icons/438701535208275978/a_56eb646ca2c60fbb37aea7cb8255a7a8"
                  className="circle"
                />
                <div className="m-3 mt-5 mb-5 text-center">
                  <h3 className="font-weight-bold">Feinwaru Server</h3>
                  <input
                    className="form-control mt-4"
                    placeholder="Command Prefix: -"
                    type="text"
                  />
                  <div className="d-flex mt-4">
                    <button href="#" className="btn px-auto btn-awesomo flex-fill mr-2">
                      Change Prefix
                    </button>
                    <button href="#" className="btn btn-awesomo flex-fill ml-2">
                      Set Default
                    </button>
                  </div>
                  <button href="#" className="btn px-4 btn-red mt-4">
                    Deactivate AWESOM-O
                  </button>
                </div>
              </div>
            </div>

            {/* Deactivated */}
            <div className="col-md-6 col-lg-4">
              <div className="card my-5 pt-5">
                <img
                  src="https://cdn.discordapp.com/icons/405129031445381120/901ad1ef182ee43cbaab95f4572695f2"
                  className="circle"
                />
                <div className="m-3 mt-5 mb-5 text-center">
                  <h3 className="font-weight-bold">Feinwaru Staff Server</h3>
                  <input
                    className="form-control mt-4"
                    placeholder="Command Prefix: -"
                    type="text"
                  />
                  <div className="d-flex mt-4">
                    <button href="#" className="btn px-auto btn-awesomo flex-fill mr-2">
                      Change Prefix
                    </button>
                    <button href="#" className="btn btn-awesomo flex-fill ml-2">
                      Set Default
                    </button>
                  </div>
                  <button href="#" className="btn px-4 btn-green mt-4">
                    Activate AWESOM-O
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default ServerManager;
