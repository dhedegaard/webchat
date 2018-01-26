import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./components/App";

ReactDOM.render(
    /* Temporary fix for broken type declarations. */
    <App /> as any,
    document.getElementById("container"),
);
