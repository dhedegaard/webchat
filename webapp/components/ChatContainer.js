import React from "react";
import $ from "jquery";

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
        let $elem = $(elem);
        $elem.scrollTop(elem.scrollHeight);
    }

    fetchMessages() {
        $.post('/get_new', {
            id: this.state.lastid
        }, data => {
            if (data !== 'OK') {
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
            }
            setTimeout(this.fetchMessages.bind(this), 100);
        }).fail(jqxhr => {
            this.setState({
                messages: this.state.messages.concat([
                    <ErrorMessage
                        key={1000000000 + ++this.failcount}
                        statusCode={jqxhr.status}
                        statusText={jqxhr.statusText} />
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