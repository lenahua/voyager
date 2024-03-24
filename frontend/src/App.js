import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
 
import ViewPage from './components/viewPage/viewPage';
import Home from './components/home';
import HotelInfo from './components/hotelInfo';
import HotelList from './components/hotelList';
import HotelOrder from './components/hotelOrder';
import Member from './components/member';
import Welcome from './components/welcome';
 
class App extends Component {
 
  render() {
    return (      
       <BrowserRouter>
        <div>
            <Switch>
                <Route path="/welcome" component={Welcome} />
                <Route path="/" component={Home} exact/>
                <Route path="/home" component={Home} />
                <Route path="/viewPage" component={ViewPage}/>
                <Route path="/hotelList" component={HotelList} />
                <Route path="/hotelInfo" component={HotelInfo} />
                <Route path="/hotelOrder" component={HotelOrder} />
                <Route path="/member" component={Member} />
           </Switch>
        </div> 
      </BrowserRouter>
    );
  }
}
 
export default App;