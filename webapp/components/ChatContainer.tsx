import * as React from "react";

import ErrorMessage from "./ChatContainer/ErrorMessage";
import Message from "./ChatContainer/Message";

interface IChatContainerState {
  lastid: number;
  messages: JSX.Element[];
}

interface IResponseMessage {
  id: number;
  message: string;
  timestamp: string;
  username: string;
}

export default class ChatContainer extends React.Component<{}, IChatContainerState> {
  chat!: HTMLDivElement;
  failcount = 0;
  state: IChatContainerState = {
    lastid: -1,
    messages: [],
  };

  componentDidMount(): void {
    this.fetchMessages.bind(this)();
  }

  componentDidUpdate(): void {
    const elem = this.chat;
    elem.scrollTop = elem.scrollHeight;
  }

  fetchMessages(): void {
    const formData = new FormData();
    formData.append("id", this.state.lastid.toString());
    fetch("/get_new", {
      body: formData,
      method: "post",
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`Error in response: ${response.status} ${response.statusText}`);
    }).then((data) => {
      const messages = this.state.messages;
      data.messages.forEach((message: IResponseMessage) => {
        messages.push(
          <Message
            key={message.id}
            username={message.username}
            timestamp={message.timestamp}
            message={message.message}
          />,
        );
      });
      this.setState({
        lastid: data.lastid,
        messages,
      });
      setTimeout(this.fetchMessages.bind(this), 100);
    }).catch((err) => {
      this.setState({
        messages: [...this.state.messages, (
          <ErrorMessage
            key={1000000000 + ++this.failcount}
            message={err.message}
          />
        )],
      });
      setTimeout(this.fetchMessages.bind(this), 5000);
    });
  }

  render() {
    return (
      <div ref={(elem) => { this.chat = elem!; }} id="chat" className="form-control">
        {this.state.messages}
      </div>
    );
  }
}
