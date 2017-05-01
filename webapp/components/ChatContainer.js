import React from "react";
import $ from "jquery";

import Message from "./ChatContainer/Message";


export default class ChatContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            message: [],
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
                this.setState({
                    lastid: data.lastid,
                    message: this.state.message.concat(data.messages)
                });
            }
            setTimeout(this.fetchMessages.bind(this), 100);
        });
    }

    render() {
        let messages = []
        this.state.message.forEach(message => {
            messages.push(
                <Message key={message.id}
                         username={message.username}
                         timestamp={message.timestamp}
                         message={message.message} />
            );
        })

        this.div = (
            <div ref="chat" id="chat" className="form-control">
                {messages}
            </div>
        );
        return this.div;
    }
}