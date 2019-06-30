import React, { Component } from "react";
import ReactDOM from "react-dom";
import "bootstrap/scss/bootstrap.scss";
import "../src/static/css/fa_all.scss";
import "./style.scss";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import ScrollToTop from "./components/ScrollToTop.jsx";

import Home from "./views/Home.jsx";
import ServerManager from "./views/ServerManager.jsx";
import Marketplace from "./views/Marketplace.jsx";

const history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    <ScrollToTop>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/servermanager" component={ServerManager} />
        <Route exact path="/marketplace" component={Marketplace} />
      </Switch>
    </ScrollToTop>
  </Router>,
  document.getElementById("root")
);
