import * as React from "react";
import * as ReactDOM from "react-dom";

export interface IErrorMessageProps { message: string; }
export interface IErrorMessageState {}

export default class ErrorMessage extends React.Component<IErrorMessageProps, IErrorMessageState> {
    render(): JSX.Element {
        return (
            <div className="alert alert-danger">
                <span>An error occured, retrying in 5 seconds:</span><br />
                {this.props.message}
            </div>
        );
    }
}
