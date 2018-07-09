import { IAction } from "../reducers";

const newMessagesReceived = (messages: webchat.IMessage[], lastMessageId: number): IAction => ({
  lastMessageId,
  messages,
  type: "NEW_MESSAGES_RECEIVED",
});

const onError = (error: any): IAction => ({
  error: error.toString(),
  type: "ON_ERROR",
});

export { newMessagesReceived, onError };
