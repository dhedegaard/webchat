import * as React from "react";

interface IMessageProps {
  username: string;
  message: string;
  timestamp: string;
}

export default class Message extends React.Component<IMessageProps, {}> {
  formattedTimestamp(): string {
    let timestampIsoString = new Date(this.props.timestamp).toISOString();
    return timestampIsoString.slice(0, 10) + " " + timestampIsoString.slice(11, 19);
  }

  render() {
    return (
      <div>
        <span className="time">[{this.formattedTimestamp.bind(this)()}] </span>&nbsp;
        <span className="username">{this.props.username}:</span>&nbsp;
        <span className="message">{this.props.message}</span>
      </div>
    );
  }
}