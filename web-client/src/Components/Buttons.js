import React, { Component } from "react";
import Button from "./Button";

import { BsArrowBarLeft, BsArrowBarRight, BsArrowBarUp, BsArrowBarDown, BsArrowClockwise, BsArrowCounterclockwise, BsFillCircleFill} from 'react-icons/bs'
import { GiWarPick } from 'react-icons/gi'
export default class Buttons extends Component {
    render() {
        return (
            <>
                <div key={"buttons move"} style={{"display":"block"}}>
                    <Button command={"turnLeft()"} className="button tall" icon={[<BsArrowCounterclockwise size={30} color={"#466083"}/>]} onClick={this.props.onClick} />
                    <Button command={"up()"} className="button fat up" icon={[<BsArrowBarUp size={30} color={"#466083"}/>]} onClick={this.props.onClick}/>
                    <Button command={"forward()"} className="button fat middle" icon={[<BsFillCircleFill size={30} color={"#466083"}/>]} onClick={this.props.onClick}/>
                    <Button command={"down()"} className="button fat down" icon={[<BsArrowBarDown size={30} color={"#466083"}/>]} onClick={this.props.onClick}/>
                    <Button command={"turnRight()"} className="button tall right" icon={[<BsArrowClockwise size={30} color={"#466083"}/>]} onClick={this.props.onClick}/>
                </div>
                <div key={"buttons mine"} className={"column"}>
                    <Button command={"digUp()"} className="button" icon={[<BsArrowBarUp size={30} color={"#466083"}/>]} onClick={this.props.onClick}/>
                    <Button command={"dig()"} className="button" icon={[<GiWarPick size={30} color={"#466083"}/>]} onClick={this.props.onClick}/>
                    <Button command={"digDown()"} className="button" icon={[<BsArrowBarDown size={30} color={"#466083"}/>]} onClick={this.props.onClick}/>
                </div>
            </>
        )
    }
}