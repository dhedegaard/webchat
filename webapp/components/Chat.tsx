import * as React from "react";
import Message from "./Message";

export interface IChatProps {
  messages: webchat.IMessage[];
  error: string;
}

export default class Chat extends React.Component<IChatProps, {}> {
  chat!: HTMLDivElement;

  componentDidUpdate() {
    this.chat.scrollTop = this.chat.scrollHeight;
  }

  render() {
    const props = this.props;
    return (
      <div
        ref={(elem) => { this.chat = elem!; }}
        id="chat"
        className="form-control"
      >
        {props.messages.map((message) => (
          <Message
            key={message.id}
            id={message.id}
            message={message.message}
            timestamp={message.timestamp}
            username={message.username}
          />
        ))}
        {props.error && props.error.length > 0 && (
          <div className="alert alert-danger">
            <b>Sorry!</b> Something went wrong, consider reloading:<br />
            {props.error}
          </div>
        )}
      </div>
    );
  }
}
