import ReactDOM from "react-dom";
import React, { Component } from "react"
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three';

function Box(props) {
    
    //ref gives us access to the THREE.Mesh object
    const ref = useRef()

     // Set up state for the hovered and active state
        const [hovered, setHover] = useState(false)
        const [active, setActive] = useState(false)

        return (
            <mesh
                ref={ref}
                scale={1}
                position={props.position}
                //Implement hover
                onPointerOver={(e) => setHover(true)}
                onPointerOut={(e) => setHover(false)}
            >
            <boxGeometry args={[1,1,1]}/>
            <meshStandardMaterial 
                color={hovered ? 'orange' : 'green'}
                wireframe={true}
                />
            </mesh>
        )
    
}

export default {Box}