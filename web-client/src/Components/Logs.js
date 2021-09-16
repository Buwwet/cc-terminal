import ReactDOM from "react-dom";
import React, { Component } from "react"

export default class Logs extends Component {

    render() {

        var renderedOutput = this.props.state.bus.map((value, i) => {
            return (
                <div key={i}>
                    {value}
                </div>
            )
        })
        return (
            <div>
                {renderedOutput}
            </div>
        )
    }
}