import React, { Component } from "react";
import { Navbar, Footer, Search, News, Cookie } from "../components";
import { withRouter } from "react-router-dom";
import MetaTags from "react-meta-tags";

// const Nav = withRouter(Navbar);

class Marketplace extends Component {
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
              <div className="titlebar sub">
                <div className="col-12 pl-sm-0">
                  <h2 className="font-weight-bold mb-0">Featured</h2>
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
          } 817.791`}
          filter="brightness(.5)"
        >
          <defs>
            <clipPath id="banner">
              <path
                d="M-.991,325.33s370.306,177.065,930.258,91.18S1921.735,503.7,1921.735,503.7l-.166-816.778L-.991-314.089Z"
                transform="translate(0 290)"
              />
            </clipPath>
          </defs>
          <image
            xlinkHref="https://cdn.discordapp.com/attachments/456771924639612940/466128291171008522/banner.png"
            clipPath="url(#banner)"
            width="1920"
            height="1200"
            y="-250"
          />
        </svg>

        <div className="container carousel mb-5">
          <div className="row">
            <div className="col-4">
              <div className="card featured">
                <div
                  style={{
                    backgroundImage:
                      "url(https://cdn.discordapp.com/attachments/379432139856412682/487594328634425345/unknown.png)"
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row mt-5 pt-4">
            <div className="titlebar">
              <div className="col-12 pl-sm-0">
                <h2 className="font-weight-bold mb-0">Script Packs</h2>
              </div>
            </div>
          </div>
          <div className="row mt-4 justify-content-end">
            <div className="col-4">
              <div className="card packs">
                <div
                  style={{
                    backgroundImage:
                      "url(https://cdn.discordapp.com/attachments/430447280932388865/531209992389394462/1c9bf37b90ca23f93d59eaf8115848303bc18702v2_00.png)"
                  }}
                />
              </div>
            </div>
            <div className="col-4">
              <div className="card packs">
                <div
                  style={{
                    backgroundImage:
                      "url(https://cdn.discordapp.com/attachments/394504208222650369/509099660711821312/card.png)"
                  }}
                />
              </div>
            </div>
            <div className="col-4">
              <div className="card packs">
                <div
                  style={{
                    backgroundImage:
                      "url(https://cdn.discordapp.com/attachments/209040403918356481/509092391467352065/t29.png)"
                  }}
                />
              </div>
            </div>
            <div className="col-4 mt-3 text-right">
              <h5>View More...</h5>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Marketplace;
