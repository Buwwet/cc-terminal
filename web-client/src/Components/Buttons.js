import React, { Component } from "react";
import Button from "./Button";

import { BsArrowBarLeft, BsArrowBarRight, BsArrowBarUp, BsArrowBarDown, BsArrowClockwise, BsArrowCounterclockwise } from 'react-icons/bs'

export default class Buttons extends Component {
    render() {
        return (
            <>
                <div>
                    <Button className="button tall" icon={[<BsArrowCounterclockwise size={30}/>]}/>
                    <Button className="button fat up" icon={[<BsArrowBarUp size={30}/>]}/>
                    <Button className="button fat middle" icon={[<BsArrowBarLeft size={30}/>]}/>
                    <Button className="button fat down" icon={[<BsArrowBarDown size={30}/>]}/>
                    <Button className="button tall right" icon={[<BsArrowClockwise size={30}/>]}/>
                </div>
            </>
        )
    }
}