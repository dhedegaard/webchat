import * as React from "react";
import * as ReactDOM from "react-dom";

import Message from "./ChatContainer/Message";
import ErrorMessage from "./ChatContainer/ErrorMessage";

interface IChatContainerProps {}
interface IChatContainerState {
    lastid: number;
    messages: JSX.Element[];
}

interface ResponseMessage {
    id: number;
    message: string;
    timestamp: string;
    username: string;
}

export default class ChatContainer extends React.Component<IChatContainerProps, IChatContainerState> {
    failcount: number = 0;
    state: IChatContainerState = {
        messages: [],
        lastid: -1,
    };

    componentDidMount(): void {
        this.fetchMessages.bind(this)();
    }

    componentDidUpdate(): void {
        let elem = this.refs.chat as HTMLElement;
        elem.scrollTop = elem.scrollHeight;
    }

    fetchMessages(): void {
        let formData: FormData = new FormData();
        formData.append("id", this.state.lastid.toString());
        fetch("/get_new", {
            method: "post",
            body: formData
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(`Error in response: ${response.status} ${response.statusText}`);
        }).then(data => {
            let messages = this.state.messages;
            data.messages.forEach((message: ResponseMessage) => {
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

    render(): JSX.Element {
        return (
            <div ref="chat" id="chat" className="form-control">
                {this.state.messages}
            </div>
        );
    }
}