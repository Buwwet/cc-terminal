import React, { Component } from "react";
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'


export default class Arrow extends Component {
    render() {
        //console.log(this.props.turtle.x)
        var forwardOffsetX = (this.props.turtle.dir == 1) ? 1 : (this.props.turtle.dir == 3) ? -1 : 0;
        var forwardOffsetZ = (this.props.turtle.dir == 2) ? 1 : (this.props.turtle.dir == 0) ? -1 : 0;
        //console.log(this.props.turtle.dir)
        var setPosition = [forwardOffsetX, 0, forwardOffsetZ]
        return(
            <mesh
                
                position={setPosition}
                rotation={[0, 1.57 * this.props.turtle.dir + 1.57, 0]}
            >
                <boxGeometry args={[1,0.2,0.2]}/>
                <meshStandardMaterial
                    
                    color={"orange"}
                    
                    />
            </mesh>
        )
    }
}