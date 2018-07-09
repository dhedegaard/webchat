import * as React from "react";

import ChatContainer from "../containers/ChatContainer";

interface IAppState {
  username: string;
  message: string;
}

export default class App extends React.Component<{}, IAppState> {
  input: React.RefObject<HTMLInputElement>;

  constructor(props: {}) {
    super(props);
    this.state = {
      message: "",
      username: "",
    };
    this.input = React.createRef<HTMLInputElement>();
    this.usernameChange = this.usernameChange.bind(this);
    this.messageChange = this.messageChange.bind(this);
    this.messageKeyPress = this.messageKeyPress.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  usernameChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      username: e.target.value,
    });
  }

  messageChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      message: e.target.value,
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

    const data = new FormData();
    data.append("message", this.state.message);
    data.append("username", this.state.username || "anon");
    fetch("/send", {
      body: data,
      method: "post",
    }).then((response) => {
      /* Success, clear the input field. */
      if (response.ok) {
        this.setState({
          message: "",
        }, () => {
          if (this.input.current) {
            this.input.current.focus();
          }
        });
        return;
      }
      /* Handle bad request. */
      if (response.status === 400) {
        return response.json();
      }
      /* Otherwise, throw whatever happened. */
      throw new Error(`Error from the server: ${response.status}: ${response.statusText}`);
    }).then((json) => {
      if (!json) {
        return;
      }
      throw new Error(`Message: ${json.message[0].message}`);
    }).catch((err) => {
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
            <input
              className="form-control"
              value={this.state.username}
              onChange={this.usernameChange}
              id="username"
              name="username"
              type="text"
              placeholder="anon"
            />
          </div>
          <div className="col-8 col-sm-10 input-group">
            <input
              ref={this.input}
              className="form-control"
              id="input"
              value={this.state.message}
              onChange={this.messageChange}
              onKeyPress={this.messageKeyPress}
              name="input"
              type="text"
              autoFocus={true}
            />
            <span className="input-group-btn">
              <button className="btn btn-success" type="button" onClick={this.sendMessage}>
                <span className="visible-lg">
                  <i className="glyphicon glyphicon-send" />
                  Send
                </span>
              </button>
            </span>
          </div>
        </div>
      </div>
    );
  }
}
