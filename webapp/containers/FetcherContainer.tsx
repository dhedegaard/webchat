import { connect } from "react-redux";

import Fetcher, { IFetcherProps } from "../components/Fetcher";
import { IState } from "../store";
import { newMessagesReceived, onError } from "../store/actions";
import { IAction } from "../store/reducers";

const mapStateToProps = (state: IState): Partial<IFetcherProps> => ({
  lastMessageId: state.lastMessageId,
});

const mapDispatcherToProps = (dispatcher: (action: IAction) => void): Partial<IFetcherProps> => ({
  newMessagesReceived: (messages: webchat.IMessage[], lastMessageId: number) =>
    dispatcher(newMessagesReceived(messages, lastMessageId)),
  onError: (error: any) =>
    dispatcher(onError(error)),
});

const FetcherContainer = connect(
  mapStateToProps,
  mapDispatcherToProps,
)(Fetcher);
export default FetcherContainer;
