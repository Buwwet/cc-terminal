import React, { Component } from "react";

import './button.css'

export default class Button extends Component {
    render() {
        return (
            <>
                <button
                    className={this.props.className}
                    style={this.props.style}
                >
                    {this.props.icon.map((value, index) => {
                        return (
                            <div key={[Date(), index]}>
                                {value}
                            </div>
                        )
                    })}
                </button> 
            </>
        )
    }
}