import ReactDOM from "react-dom";
import React, { Component } from "react"
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Canvas, useFrame, useThree } from '@react-three/fiber'

import './index.css'

//import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { PerspectiveCamera, PositionalAudio, OrbitControls } from '@react-three/drei'
import * as THREE from 'three';

//Components
import CommandForm from "./Components/CommandForm"
import Logs from "./Components/Logs";
import Boxes from "./Components/Boxes";
import { Camera } from "three";

import { useRef, useState } from 'react'
const client = new W3CWebSocket("ws://127.0.0.1:8080")

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            bus: [],
            world: {"0,0,0":"test"},
            turtle: {x: 0, y: 0, z: 0, label: "null"}
        }
    }

    handleChange = (e) => {
        this.setState({
            text: e.target.value,
            bus: this.state.bus,
            world: this.state.world,
            turtle: this.state.turtle
        })
    }    

    handleSubmit = (e) => {   
        //Needs to be unJSON'd for it to be sent.
        var textSubmit = JSON.parse(this.state.text);
        client.send(JSON.stringify(textSubmit));
        
        this.pushToBus(JSON.stringify(textSubmit));

        e.preventDefault();
    }

    sceneSetup() {
        
    }

    componentDidMount() {
        this.sceneSetup()
        

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
            const dataFromServer = JSON.parse(message.data, );
            //Logs things like turtle.getJSON()
            if (dataFromServer.type == "log") {
                //console.log(dataFromServer.msg);
            }
            if (dataFromServer.type == "world") {
                this.setState({
                    text: this.state.text,
                    bus: this.state.bus,
                    world: dataFromServer.msg,
                    turtle: this.state.turtle,
                })
            }
            if (dataFromServer.type == "turtle") {
                this.setState({
                    text: this.state.text,
                    bus: this.state.bus,
                    world: this.state.world,
                    turtle: dataFromServer.msg,
                })
            }
            //this.pushToBus(JSON.stringify(dataFromServer));
            //console.log(dataFromServer);
        }
    }

    pushToBus(pushable) {
        var busPushed = [...this.state.bus]
        busPushed.push(pushable)
        this.setState({
            text: this.state.text,
            bus: busPushed,
            world: this.state.world,
            turtle: this.state.turtle
        })
    }

    

    render() {
        //console.log(this.mount)
        return (
            //<div ref={ref => (this.mount = ref)}/>
            <>
            <div>
                <CommandForm
                    handleSubmit={this.handleSubmit}
                    handleChange={this.handleChange}
                    state={this.state}
                />
            </div>
            <div style={{ position: "relative", width: 1000, height: 700}}>
            <Canvas ref={ref => (this.mount = ref)}>
                <Controls/>
                <ambientLight/>
                <PerspectiveCamera makeDefault position={[0,10,0]}/>
                <group position={[-this.state.turtle.x,this.state.turtle.y,-this.state.turtle.z]}>
                    <Boxes
                        world={this.state.world}
                    />
                </group>
                    
            </Canvas>
            </div>
            </>
            
        )
    }
}

function Controls() {
    //Doing this lets the camera update
    const ref = useRef();
    //const { invalidate, camera, gl} = useThree()
    return <OrbitControls makeDefault ref={ref}/>
}

ReactDOM.render(
    <App></App>,
    document.getElementById("root")
);