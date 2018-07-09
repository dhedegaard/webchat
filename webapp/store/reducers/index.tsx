import { IState } from "..";

export type IAction = {
  type: "NEW_MESSAGES_RECEIVED";
  messages: webchat.IMessage[];
  lastMessageId: number;
} | {
  type: "ON_ERROR";
  error: string;
};

const initialState: IState = {
  error: "",
  lastMessageId: -1,
  messages: [],
};

const rootReducer = (state: IState = initialState, action: IAction): IState => {
  switch (action.type) {
    case "NEW_MESSAGES_RECEIVED":
      return {
        ...state,
        lastMessageId: action.lastMessageId,
        messages: [ ...state.messages, ...action.messages ],
      };
    case "ON_ERROR":
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
};

export default rootReducer;
