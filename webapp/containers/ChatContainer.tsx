import { connect } from "react-redux";

import Chat, { IChatProps } from "../components/Chat";
import { IState } from "../store";

const mapStateToProps = (state: IState): Partial<IChatProps> => ({
  error: state.error,
  messages: state.messages,
});

const ChatContainer = connect(
  mapStateToProps,
)(Chat);
export default ChatContainer;
