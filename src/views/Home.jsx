import React, { Component } from "react";
import { Navbar, Footer, Search, News, Cookie } from "../components";
import { withRouter } from "react-router-dom";
import MetaTags from "react-meta-tags";

// const Nav = withRouter(Navbar);

class Index extends Component {
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
                  <h2 className="font-weight-bold mb-0">Our Products</h2>
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
            xlinkHref="https://cdn.discordapp.com/attachments/558375135719981056/593867212587139074/NoPath.png"
            clipPath="url(#banner)"
            width="1920"
            height="1080"
            y="-325px"
          />
        </svg>
        <div className="container my-5" />
        <Footer />
      </div>
    );
  }
}

export default Index;
