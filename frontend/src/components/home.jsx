import React, { Component } from 'react';
import Header from './homePage/Header';
import Slide from './homePage/Slide';
import Slide2 from './homePage/Slide2';


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
