import { createStore } from "redux";

import rootReducer from "./reducers";

export interface IState {
  error: string;
  lastMessageId: number;
  messages: webchat.IMessage[];
}

const store = createStore(rootReducer);

export default store;
