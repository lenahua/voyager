import React from 'react';
import NavbarTitle from './Navbar_title'; 
import SearchOrder from './search_order';

class HotelList extends React.Component {
  render() {
    return (
      <div>
        <NavbarTitle />
        <SearchOrder />
      </div>
    );
  }
}

export default HotelList;