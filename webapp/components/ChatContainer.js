import React from "react";

import Message from "./ChatContainer/Message";
import ErrorMessage from "./ChatContainer/ErrorMessage";


export default class ChatContainer extends React.Component {
    constructor() {
        super();
        this.failcount = 0;
        this.state = {
            messages: [],
            lastid: -1
        };
    }

    componentDidMount() {
        this.fetchMessages.bind(this)();
    }

    componentDidUpdate() {
        let elem = this.refs.chat;
        elem.scrollTop = elem.scrollHeight;
    }

    fetchMessages() {
        let formData = new FormData();
        formData.append('id', this.state.lastid);
        fetch('/get_new', {
            method: 'post',
            body: formData
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(`Error in response: ${response.status} ${response.statusText}`);
        }).then(data => {
            let messages = this.state.messages;
            data.messages.forEach(message => {
                messages.push(
                    <Message
                        key={message.id}
                        username={message.username}
                        timestamp={message.timestamp}
                        message={message.message} />
                );
            });
            this.setState({
                lastid: data.lastid,
                messages: messages
            });
            setTimeout(this.fetchMessages.bind(this), 100);
        }).catch(err => {
            this.setState({
                messages: this.state.messages.concat([
                    <ErrorMessage
                        key={1000000000 + ++this.failcount}
                        message={err.message} />
                ])
            });
            setTimeout(this.fetchMessages.bind(this), 5000);
        });
    }

    render() {
        this.div = (
            <div ref="chat" id="chat" className="form-control">
                {this.state.messages}
            </div>
        );
        return this.div;
    }
}