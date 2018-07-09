import { createStore } from "redux";

import { newMessagesReceived } from "./actions";
import rootReducer from "./reducers";

export interface IState {
  error: string;
  lastMessageId: number;
  messages: webchat.IMessage[];
}

const store = createStore(rootReducer);

// Load initial data from the window object immediately, if it exists.
const initialData = (window as any).initialData as webchat.IGetNewResponse;
if (initialData) {
  store.dispatch(newMessagesReceived(initialData.messages, initialData.lastid));
}

export default store;
