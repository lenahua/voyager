import Cloud from './cloud';
import Logo from './yoyagerLogo';
import Button from './button';
import React, { Component } from 'react';

class WelcomePage extends Component {
    state = {  } 
    render() { 
        return (
            <>
                <Cloud />
                <Logo />
                <Button />
            </>
        );
    }
}
 
export default WelcomePage;