import * as React from "react";

import ChatContainer from "./ChatContainer";

interface IAppState {
    username: string;
    message: string;
}

export default class App extends React.Component<{}, IAppState> {
    state = {
        username: "",
        message: "",
    };

    usernameChange(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            username: e.target.value
        });
    }

    messageChange(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            message: e.target.value
        });
    }

    messageKeyPress(e: React.KeyboardEvent<HTMLInputElement>): void {
        if (e.key === "Enter") {
            this.sendMessage();
        }
    }

    sendMessage(): void {
        /* Check for empty message. */
        if (!this.state.message) {
            return;
        }

        let data = new FormData();
        data.append("message", this.state.message);
        data.append("username", this.state.username || "anon");
        fetch("/send", {
            method: "post",
            body: data
        }).then(response => {
            /* Success, clear the input field. */
            if (response.ok) {
                this.setState({
                    message: ""
                });
                let input = document.getElementById('input') as HTMLElement;
                if (input) {
                    input.focus();
                }
                return;
            }
            /* Handle bad request. */
            if (response.status === 400) {
                return response.json();
            }
            /* Otherwise, throw whatever happened. */
            throw new Error(`Error from the server: ${response.status}: ${response.statusText}`);
        }).then(json => {
            if (!json) {
                return;
            }
            throw new Error(`Message: ${json.message[0].message}`);
        }).catch(err => {
            alert(err);
        });
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <ChatContainer />
                    </div>
                </div>
                <div className="row">
                    <div className="bold col-4 col-sm-2"><label htmlFor="username">Username:</label></div>
                    <div className="bold col-8 col-sm-10"><label htmlFor="input">Message:</label></div>
                </div>
                <div className="row">
                    <div className="col-4 col-sm-2">
                        <input className="form-control" value={this.state.username}
                            onChange={this.usernameChange.bind(this)} id="username"
                            name="username" type="text" placeholder="anon" />
                    </div>
                    <div className="col-8 col-sm-10 input-group">
                        <input ref="input" className="form-control" id="input"
                            value={this.state.message}
                            onChange={this.messageChange.bind(this)}
                            onKeyPress={this.messageKeyPress.bind(this)}
                            name="input" type="text" autoFocus={true} />
                        <span className="input-group-btn">
                            <button className="btn btn-success" type="button" onClick={this.sendMessage.bind(this)}>
                                <span className="visible-lg"><i className="glyphicon glyphicon-send"></i> Send</span>
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}