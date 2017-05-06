import React from "react";
import $ from "jquery";

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
        $.post('/send', {
            message: this.state.message,
            username: this.state.username || 'anon'
        }, () => {
            // In case of success, clear the message.
            this.setState({
                message: ''
            });
        }).fail(jqxhr => {
            if (jqxhr.status === 400) {
                // Bad request usually means bad input, or missing message.
                let jsonResp = JSON.parse(jqxhr.responseText);
                if (jsonResp !== undefined && jsonResp.message !== undefined) {
                    alert(`Message: ${jsonResp.message[0].message}`);
                } else {
                    alert(`Unknown error ${jqxhr.responseText}`);
                }
            } else {
                // If anything else happened, show it to the user
                alert(`Error from the server: ${jqxhr.status}: ${jqxhr.statusText}`);
            }
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