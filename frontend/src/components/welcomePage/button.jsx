import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class Button extends Component {
    state = {  } 
    render() { 
        return (
            <button type="button" className="btn btn-dark" onClick={this.doClick}
                style={{
                    position:"fixed",
                    top:"365px",
                    left:"1040px",
                    zIndex:10
                }}
            >
                進入首頁
            </button>
        );
    }
    doClick = () => {
        window.location = "/";
    }
}
 
export default Button;