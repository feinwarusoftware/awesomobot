import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

class Cookie extends Component {
  constructor(props) {
    super(props);
    this.cookie = React.createRef();
  }

  componentDidMount() {
    let status = cookies.get("cookie-status");

    if (status === null) {
      this.cookie.current.style.display = "block";
    } else if (status === "accepted") {
      this.cookie.current.style.display = "none";
    }
  }

  acceptCookie = () => {
    this.cookie.current.style.display = "none";
    cookies.set("cookie-status", "accepted");
  };

  render() {
    return (
      <React.Fragment>
        <div id="cookie" ref={this.cookie}>
          <div className="container">
            <button
              onClick={() => {
                this.acceptCookie();
              }}
              className="px-4 btn btn-sm btn-feinwaru float-right"
            >
              Got it!
            </button>
            <p className="mb-0">
              This website uses cookies to ensure you get the best experience on our website.
            </p>
            <a href="https://cookiesandyou.com/">Learn More</a>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Cookie;
