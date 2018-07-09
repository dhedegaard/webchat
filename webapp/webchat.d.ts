export interface IMessage {
  id: number;
  message: string;
  username: string;
  timestamp: string;
}

export interface IGetNewResponse {
  lastid: number;
  messages: IMessage[];
}

export as namespace webchat;
