import ReactDOM from "react-dom";
import React, { Component } from "react"
import { w3cwebsocket as W3CWebSocket } from "websocket";

//Components
import CommandForm from "./Components/CommandForm"
import Logs from "./Components/Logs";

const client = new W3CWebSocket("ws://127.0.0.1:8080")

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            bus: []
        }
    }

    handleChange = (e) => {
        this.setState({
            text: e.target.value,
            bus: this.state.bus
        })
    }    

    handleSubmit = (e) => {   
        //Needs to be unJSON'd for it to be sent.
        var textSubmit = JSON.parse(this.state.text);
        client.send(JSON.stringify(textSubmit));
        
        this.pushToBus(JSON.stringify(textSubmit));

        e.preventDefault();
    }

    componentDidMount() {
        client.onopen = () => {
            console.log("WebSocket Client Connected");
            const role = JSON.stringify({
                type: "assign",
                msg: "client"
            })
            client.send(role);
            this.pushToBus(role);
            //Lets the server know that we can command machines.
        }
        client.onmessage = (message) => {
            //const dataFromServer = JSON.parse(message.data);
            
            if (message.data.type == "log") {
                console.log(dataFromServer.msg);
            }
            console.log(message.data);
            //this.pushToBus(JSON.stringify(dataFromServer));
            //console.log(dataFromServer);
        }
    }

    pushToBus(pushable) {
        var busPushed = [...this.state.bus]
        busPushed.push(pushable)
        this.setState({
            text: this.state.text,
            bus: busPushed
        })
    }

    render() {
        return (
            <div>
                <CommandForm
                    handleSubmit={this.handleSubmit}
                    handleChange={this.handleChange}
                    state={this.state}
                />
                <Logs state={this.state}/>
            </div>
        )
    }
}

ReactDOM.render(
    <App></App>,
    document.getElementById("root")
);