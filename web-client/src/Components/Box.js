import ReactDOM from "react-dom";
import React, { Component } from "react"
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three';

export default class Box extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hovered: false
        }
    }
    
    hashCode(str) { // java String#hashCode
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
           hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    } 
    
    intToRGB(i){
        var c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();
    
        return "00000".substring(0, 6 - c.length) + c;
    }

    render() {
    return (
        <mesh
            scale={1}
            position={this.props.position}
            //Implement hover
        onPointerOver={(e) => {
                this.setState((state) => {return {hovered: true}});
                this.props.handleHover(this.props.block);
            }}
        onPointerOut={(e) => {
            this.setState((state) => {return {hovered: false}})
            this.props.handleHover("");
        }}
        >
        <boxGeometry args={[1,1,1]}/>
        <meshStandardMaterial 
            color={this.state.hovered ? 'orange' : "#" + this.intToRGB(this.hashCode(this.props.block))}
            wireframe={true}
            />
        </mesh>
        
    )
}
}
