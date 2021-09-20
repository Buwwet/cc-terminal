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
                boxesArray.push(
                    <mesh 
                    key={Date()}
                    scale={0.7}
                    position={value.homie}>
                        <boxGeometry args={[1,1,1]}/>
                        <meshStandardMaterial
                            color={'gray'}
                        />
                    </mesh>
                )
                return;
            }
            if (value == "minecraft:air" || value == "minecraft:water") {
                return;
            }

            //Check if block is near enough to be render.
            let blockPos = key.split(',');
            let turtlePos = [this.props.turtle.x, this.props.turtle.y, this.props.turtle.z];
            for (var i = 0; i < 3; i++) {
                var diference = blockPos[i] - turtlePos[i];
                diference = Math.abs(diference);
                if (diference > 20) { //If block is too far, do not render it.
                    return;
                }
            }
            //console.log(key.split(','));
            boxesArray.push(
                <Box 
                    key={key}
                    block={value}
                    position={key.split(',')}
                    handleHover={this.props.handleHover}
                    >
                </Box>
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