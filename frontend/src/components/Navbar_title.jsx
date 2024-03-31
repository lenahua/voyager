import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown, Container, Row, Col, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { XCircleFill } from 'react-bootstrap-icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "../css/search_icon.css";
import "../css/search_index.css";
import "../css/form-search.css";
import axios from 'axios';

class Navbartitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "搜尋目的地",
      date: "入住日期",
      people: "人數",
      dates: [new Date(), new Date()],
      hotels: [],
      searchQuery: ''
    };
  }

  componentDidMount() {
    axios.get('http://localhost:8000/hotelList/search')
      .then(response => {
        this.setState({ hotels: response.data });
      })
      .catch(error => console.error('Error fetching hotels:', error));
  }

  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  handleSearch = (e) => {
    axios.post('http://localhost:8000/hotelList/search', {
      city: this.state.searchQuery
      
    })
      .then(response => {
        this.setState({ hotels: response.data });
      })
      .catch(error => console.error('Error fetching hotels:', error));
  };

  onChange = (update) => {
    this.setState({ dates: update });
  };

  render() {
    const { city, date, people, dates, hotels, searchQuery } = this.state;

    return (
      <div>
        <Form className="d-flex align-items-center search-form" inline>
          <InputGroup className='search-control'>
            <div className='d-flex search-all'>
              <div className="button-container">
                <FormControl
                  type="text"
                  placeholder="搜尋目的地"
                  className="search-color search-input"
                  aria-label="城市"
                  value={searchQuery}
                  onChange={this.handleSearchChange}
                />
                <Button className="button-color search-button" variant="outline-secondary" onClick={() => this.setState({ city: '' })}><XCircleFill /></Button>
              </div>
              <div className="button-container position-relative">
                <DatePicker
                  type=""
                  className="search-color"
                  selectsRange={true}
                  startDate={dates[0]}
                  endDate={dates[1]}
                  onChange={this.onChange}
                  minDate={new Date()}
                  onClick={this.toggleClass}
                />
              </div>
              <div className="button-container">
                <FormControl
                  type="text"
                  placeholder="人數"
                  className="search-color search-input_1 search-end"
                  aria-label="人數"
                  value={people}
                  onChange={(e) => this.setState({ people: e.target.value })}
                />
              </div>
              <Button variant="btn btn-primary button-radius button-search" onClick={this.handleSearch}>搜尋</Button>
            </div>
          </InputGroup>
        </Form>
        <section className='navbar-plan mb-3'>
          {hotels.map((hotel, index) => (
            <div key={index} className="card d-flex mt-3 card-page card-background p-0">
              <div className='row'>
                <div className="col-md-4">
                  <img src={hotel.photo_url} className="card-img-top w-100 shadow" alt="hotel" />
                </div>
                <div className='col-md-8 position-relative'>
                  <div className="card-body p-1 m-0">
                    <h3 className="card-title p-0 font-title">{hotel.hotel_name}</h3>
                    <div className='justify-content-between mb-4'>
                      <button className='p-2 text-decoration-none link-like-button'>{hotel.adress}</button>
                      <button className='text-decoration-none link-like-button'>{hotel.facility}</button>
                      <button className='text-decoration-none link-like-button'></button>
                    </div>
                    <div className='left-line'>
                      <span className='p-2'>{hotel.room_type}</span>
                      <span className='p-2'>24晚</span>
                      <br></br>
                      <span className='p-2'>剩餘房間</span>
                      <span className="land-mark">
                        <i className="bi bi-calendar ps-3"></i><button className="text-link link-hover link-like-button" >預約日期</button>
                      </span>
                      <div className='p-2'>${hotel.price}</div>
                    </div>
                    <div className="btn btn-primary room-info">
                      <div className="btn-title text-dark">
                        查看房間資訊
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-right" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    );
  }
}

export default Navbartitle;