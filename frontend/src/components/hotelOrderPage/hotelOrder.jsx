import React, { Component } from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';

class HotelOrderPage extends Component {
    state = {  } 
    render() { 
        return (
            <div className="container">
                <Header />
                <Main />
                <Footer />
            </div>
        );
    }
}
 
export default HotelOrderPage;