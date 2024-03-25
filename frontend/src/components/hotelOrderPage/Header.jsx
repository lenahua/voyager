import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css'

class Header extends Component {
  state = {  } 
  render() { 
    return (
      <div className="row">
        <div className="col border border-3" style={{height:"100px" }}><h1>Header</h1></div>
      </div>
    )
  }
}
 
export default Header;
