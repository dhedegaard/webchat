import * as React from "react";
import Message from "./Message";

interface IProps {
  messages: webchat.IMessage[];
}

export default class Chat extends React.Component<IProps, {}> {
  chat!: HTMLDivElement;

  componentDidUpdate() {
    this.chat.scrollTop = this.chat.scrollHeight;
  }

  render() {
    return (
      <div
        ref={(elem) => { this.chat = elem!; }}
        id="chat"
        className="form-control"
      >
        {this.props.messages.map((message) => (
          <Message
            key={message.id}
            id={message.id}
            message={message.message}
            timestamp={message.timestamp}
            username={message.username}
          />
        ))}
      </div>
    );
  }
}
