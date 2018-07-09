import * as React from "react";
import { IMessage } from "../webchat";

const formatTimestamp = (timestamp: string): string => {
  const timestampIsoString = new Date(timestamp).toISOString();
  return timestampIsoString.slice(0, 10) + " " + timestampIsoString.slice(11, 19);
};

const Message = (props: IMessage) => {
  const formattedTimestamp = formatTimestamp(props.timestamp);
  return (
    <div>
      <span className="time">[{formattedTimestamp}] </span>{" "}
      <span className="username">{props.username}:</span>{" "}
      <span className="message">{props.message}</span>
    </div>
  );
};
export default Message;
