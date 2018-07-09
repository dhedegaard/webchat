import * as React from "react";
import { connect } from "react-redux";

import Chat from "../components/Chat";
import { IState } from "../store";
import { IAction } from "../store/reducers";

const mapStateToProps = (state: IState) => ({
  messages: state.messages,
});

const ChatContainer = connect(
  mapStateToProps,
)(Chat);
export default ChatContainer;
