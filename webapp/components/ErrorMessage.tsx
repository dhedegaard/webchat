import * as React from "react";

interface IProps {
  message: string;
}

const ErrorMessage = (props: IProps) => {
  return (
    <div className="alert alert-danger">
      <span>An error occured, retrying in 5 seconds:</span><br />
      {props.message}
    </div>
  );
};
export default ErrorMessage;
