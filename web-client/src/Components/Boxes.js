import ReactDOM from "react-dom";
import React, { Component } from "react"
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Canvas, useFrame } from '@react-three/fiber'
import Box from "./Box";

//For each item in the world, return a <Box> component
export default class Boxes extends Component {
    render() {
        
        let worldArray = new Map(Object.entries(this.props.world));
        let boxesArray = [];
        worldArray.forEach((value, key) => {
            if (key.includes("turtle")) {
                return;
            }
            if (value == "minecraft:air") {
                return;
            }
            //console.log(key.split(','));
            boxesArray.push(
                <Box.Box 
                    key={key}
                    position={key.split(',')}
                    >
                </Box.Box>
            )
            //console.log(boxesArray);
        });


        return (    
            <>
                {boxesArray}
            </>
        )
    }
}