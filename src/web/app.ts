// All the other imports (basically react lol)
import React from "react";
import ReactDOM from "react-dom";

// All of our shit
import "./app.scss";
import "./i18n";
import Home from "./views/Home";

ReactDOM.render(React.createElement(Home), document.getElementById("root"));
