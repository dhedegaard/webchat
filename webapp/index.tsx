import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./components/App";
import FetcherContainer from "./containers/FetcherContainer";
import store from "./store";

ReactDOM.render(
  <Provider store={store}>
    <React.Fragment>
      <App />
      <FetcherContainer  />
    </React.Fragment>
  </Provider>,
  document.getElementById("container"),
);
