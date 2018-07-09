import * as React from "react";

export interface IFetcherProps {
  onError: (error: any) => void;
  newMessagesReceived: (messages: webchat.IMessage[], lastMessageId: number) => void;
  lastMessageId: number;
}

export default class Fetcher extends React.Component<IFetcherProps, {}> {
  constructor(props: IFetcherProps) {
    super(props);
    this.fetchMessages = this.fetchMessages.bind(this);
  }

  componentDidMount() {
    this.fetchMessages();
  }

  async fetchMessages() {
    const formData = new FormData();
    formData.append("id", this.props.lastMessageId.toString());
    try {
      const resp = await fetch("/get_new", {
        body: formData,
        method: "post",
      });
      const json = await resp.json() as webchat.IGetNewResponse;
      this.props.newMessagesReceived(json.messages, json.lastid);
    } catch (e) {
      this.props.onError(e.message);
    } finally {
      setTimeout(this.fetchMessages, 100);
    }
  }

  render() {
    return null;
  }
}
