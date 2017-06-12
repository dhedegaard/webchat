import React from "react";

import ChatContainer from "./ChatContainer";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            username: '',
            message: ''
        }
    }

    usernameChange(e) {
        this.setState({
            username: e.target.value
        });
    }

    messageChange(e) {
        this.setState({
            message: e.target.value
        });
    }

    messageKeyPress(e) {
        if (e.key === 'Enter') {
            this.sendMessage();
        }
    }

    sendMessage() {
        /* Check for empty message. */
        if (!this.state.message) {
            return;
        }

        let data = new FormData();
        data.append('message', this.state.message);
        data.append('username', this.state.username || 'anon');
        fetch('/send', {
            method: 'post',
            body: data
        }).then(response => {
            /* Success, clear the input field. */
            if (response.ok) {
                this.setState({
                    message: ''
                });
                return;
            }
            /* Handle bad request. */
            if (response.status === 400) {
                return response.json();
            }
            /* Otherwise, throw whatever happened. */
            throw new Error(`Error from the server: ${response.status}: ${response.statusText}`)
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
                    <div className="bold col-xs-4 col-sm-2" htmlFor="username">Username:</div>
                    <div className="bold col-xs-8 col-sm-10" htmlFor="input">Message:</div>
                </div>
                <div className="row">
                    <div className="col-xs-4 col-sm-2">
                        <input className="form-control" value={this.state.username} onChange={this.usernameChange.bind(this)} id="username" name="username" type="text" placeholder="anon" />
                    </div>
                    <div className="col-xs-8 col-sm-10 input-group">
                        <input ref="input" className="form-control" id="input" value={this.state.message} onChange={this.messageChange.bind(this)} onKeyPress={this.messageKeyPress.bind(this)} name="input" type="text" autoFocus={true} />
                        <span className="input-group-btn">
                            <button className="btn btn-default" type="button" onClick={this.sendMessage.bind(this)}>
                                <i className="glyphicon glyphicon-send hidden-lg"></i><span className="visible-lg"><i className="glyphicon glyphicon-send"></i> Send</span>
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}