"use strict";

// Hot loader needs to be imported before react!
import { hot } from "react-hot-loader/root";

// All the other imports (basically react lol)
import React from "react";
import ReactDOM from "react-dom";

// All of our shit
import "./app.scss";
import "./i18n";
import Dashboard from "./views/Dashboard/Dashboard";

// Because you have to do this to make it work, its gay, ik, but oh well
const App = hot(() => <Dashboard />);

// TODO: import the actual app and replace the div with it
ReactDOM.render(
  <App />,
  document.getElementById("root")
);
