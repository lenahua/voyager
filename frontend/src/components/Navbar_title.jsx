import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Container, Row, Col, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { XCircleFill } from 'react-bootstrap-icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "../css/search_icon.css";
import "../css/search_index.css";
import "../css/form-search.css";



function Navbartitle( {} ) {
  const [city, setCity] = useState("搜尋目的地");
  const [date, setDate] = useState("入住日期");
  const [people, setPeople] = useState("人數");
  const [dates, setDates] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dates;

  useEffect(() => { //抓取後端資料庫
    fetch('http://localhost:4000/api/hotels')
      .then(response => response.json())
      .then(data => setHotels(data))
      .catch(error => console.error('Error fetching hotels:', error));
  }, []); 

  const [hotels, setHotels] = useState([]); // 儲存後端獲取酒店列表
  

  const [searchQuery, setSearchQuery] = useState(''); //用戶輸入搜索關鍵字


  const handleSearchChange = (e) => { //處理用戶輸入改變資料
    setSearchQuery(e.target.value);
    console.log()
  };

  const handleSearch = () => {
    // 使用 fetch API 发送请求到后端API，带上搜索关键字
    fetch(`http://localhost:4000/api/hotels?search=${searchQuery}`)
      .then(response => response.json())
      .then(data => {
        setHotels(data); // 使用响应数据更新旅馆列表状态
      })
      .catch(error => console.error('Error fetching hotels:', error));
  };


  const onChange = (update) => {
    setDates(update);
  };

  // 假設的 toggleClass 函數
  const toggleClass = () => {
    //
  };



  return (

       <Form  className="d-flex align-items-center search-form" inline>
          <InputGroup className='search-control'>
          <div className='d-flex search-all'>
            <div className="button-container">
            <FormControl
              type="text"
              placeholder="搜尋目的地"
              className="search-color search-input"
              aria-label="城市"
              value={ searchQuery }
              onChange={ handleSearchChange }
              />
            <Button className="button-color search-button" variant="outline-secondary" onClick={() => setCity('')}><XCircleFill /></Button>
            </div>  
            <div className="button-container position-relative">
            <DatePicker
              type=""
              className="search-color"
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={onChange}
              minDate={new Date()}
              onClick={toggleClass}
            />

            </div> 
            <div className="button-container">
            <FormControl
              type="text"
              placeholder="人數"
              className="search-color search-input_1 search-end"
              aria-label="人數"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
            />
            {/* <Button className="button-color search-button" variant="outline-secondary" onClick={() => setCity('')}><XCircleFill /></Button> */}

            </div> <Button variant="btn btn-primary button-radius button-search" onClick={handleSearch}>搜尋</Button>
            </div>
            </InputGroup>
</Form>
      
    
  );
}

export default Navbartitle;