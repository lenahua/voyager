import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
// import Header1 from './img/header3.jpg';
import Header1 from './img/header3.jpg';
import '../../css/homePage/Header.css';

class Header extends Component {
  state = {  } 
  render() { 
    return (
      <div className="row mt-2">
        <div className="col text-center bb">
        <blockquote class="blockquote">
        </blockquote>
          <img style={{width:"1050px"}} src={Header1} className="img-fluid rounded-5"/>
        </div>
      </div>
    )
  }
}
 
export default Header;
