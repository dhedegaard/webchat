import * as React from "react";

interface IErrorMessageProps {
  message: string;
}

export default class ErrorMessage extends React.Component<IErrorMessageProps, {}> {
  render() {
    return (
      <div className="alert alert-danger">
        <span>An error occured, retrying in 5 seconds:</span><br />
        {this.props.message}
      </div>
    );
  }
}
