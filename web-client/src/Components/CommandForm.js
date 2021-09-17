import ReactDOM from "react-dom";
import React, { Component } from "react"

import './button.css'
export default class CommandForm extends Component {

    render() {
        return (
            <form onSubmit={this.props.handleSubmit} className="z">
            <label>
                Send message to the server.
            </label>
            <input 
                id='send-command'
                type="text"
                value={this.props.state.text}
                onChange={this.props.handleChange}
            >
            </input>
            <button>
                Send
            </button>
            </form>
        );
    }
}