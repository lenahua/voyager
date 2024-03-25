import React, { Component } from 'react';
import Header from './Header';
import Slide from './Slide';
import Slide2 from './Slide2';


class Home extends Component {
    state = {  } 
    render() { 
        return (
            <div className="container">
                <Header/>
                <br />
                <br />
                <br />
                <Slide />
                <Slide2 />
                <br />
                <br />
                <br />
            </div>
        );
    }
}
 
export default Home;
