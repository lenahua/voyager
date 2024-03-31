import React, { Component, } from 'react';
import { Dropdown, Navbar, Nav, NavDropdown, Container, Row, Col, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "../css/search_icon.css";
import "../css/search_index.css";
import "../css/form-search.css";
import { XCircleFill } from 'react-bootstrap-icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

  class App extends Component {
    constructor(props) {
      super(props) ;
       this.state = { 
        hotels: [],
        rooms:[],
        selectedCities: [], // 篩選城市
        selectedRoomTypes: [], //篩選房型
        selectedPriceRanges: [], //篩選價格區間
        selectedPeople: [], //篩選入住人數
        selectFacility:[], //篩選設施
        showDropdown: false, // 控制下拉選單的顯示狀態
        showCityDropdown: false,
        city: "搜尋目的地",
        date: "入住日期",
        people: "人數",
        dates: [new Date(), new Date()],
        hotels: [],
        searchQuery: '',

      };
      this.wrapperRef = React.createRef(); //用於點擊外部關閉下拉選單
    }
    // 點擊下拉按鈕切換選單顯示狀態
    toggleDropdown = () => {
      this.setState(prevState => ({ showDropdown: !prevState.showDropdown }));
    };
      // 點擊外部時關閉下拉選單
    handleClickOutside = (event) => {
      if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
        this.setState({ showDropdown: false });
      }
    };
    handleOptionClick = () => {
      this.setState({ showDropdown: false });
    };

    componentDidMount() {
      document.addEventListener('mousedown', this.handleClickOutside);
    }
  
    componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleClickOutside);
    }



     componentDidMount() {
      localStorage.setItem("previouspath", window.location.pathname)
      Promise.all([
         fetch('http://localhost:8000/hotelList/hotels'),
      ])
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(([hotelsData, roomsData]) => {
          this.setState({
            hotels: hotelsData,
            rooms: roomsData,
        });
      })
            .catch(error => console.error('error fetch data',error))
     }

     handleSearchResults = (newHotels) => {
      this.setState({ hotels: newHotels });
    };


     
    toggleCitySelection = (city) => {   //城市
      const { selectedCities } = this.state;
      if (selectedCities.includes(city)) {
          this.setState({ 
              selectedCities: selectedCities.filter(c => c !== city) 
          });
      } else {
          this.setState({ 
              selectedCities: [...selectedCities, city] 
          });
      }
  }


    toggleRoomTypeSelection = (roomType) => { //房型
      const { selectedRoomTypes } = this.state;
    
      if (selectedRoomTypes.includes(roomType)) {
        this.setState({
          selectedRoomTypes: selectedRoomTypes.filter(type => type !== roomType)
        });
      } else {
        this.setState({
          selectedRoomTypes: [...selectedRoomTypes, roomType]
        });
      }
    };
     
    togglePriceRangeSelection = (range) => {  // 價格
      const { selectedPriceRanges } = this.state;
      if (selectedPriceRanges.includes(range)) {
        this.setState({
          selectedPriceRanges: selectedPriceRanges.filter(r => r !== range)
        });
      } else {
        this.setState({
          selectedPriceRanges: [...selectedPriceRanges, range]
        });
      }
    }

    togglePeopleSelection = (peopleRange) => { //篩選人數
      const { selectedPeople } = this.state;
      if (selectedPeople.includes(peopleRange)) {
        this.setState({
          selectedPeople: selectedPeople.filter(pr => pr !== peopleRange)
        });
      } else {
        this.setState({
          selectedPeople: [...selectedPeople, peopleRange]
        });
      }
    }

    tooggleFacilitySelection = (facility) => {  //篩選設施
      const { selectFacility } = this.state;
      if (selectFacility.includes(facility)) {
        this.setState({
          selectFacility:selectFacility.filter(fc => fc !== facility)
        });
      }else {
        this.setState({
          selectFacility: [...selectFacility, facility]
        })
      }
    }
     
    sortByPrice = (direction) => {
      const { hotels } = this.state;
      const sortedHotels = hotels.slice().sort((a, b) => {
        // 假設 price 是一個數字，如果是字符串形式的價格，需要先轉換為數字
        const priceA = Number(a.price.replace(/,/g, ''));
        const priceB = Number(b.price.replace(/,/g, ''));
        return direction === '升序' ? priceA - priceB : priceB - priceA;
      });
    
      this.setState({ hotels: sortedHotels });
    };
    
    handleOptionClick = (action) => {
      // 關閉下拉選單
      this.setState({ showDropdown: false }, () => {
        // 根據傳入的 action 進行不同的處理
        switch (action) {
          case 'sortByPriceAsc':
            this.sortByPrice('升序');
            break;
          case 'sortByPriceDesc':
            this.sortByPrice('降序');
            break;
          // 可以添加更多case來處理其他情況
          default:
            break;
        }
      });
    };

    toggleCityDropdown = () => {
      this.setState(prevState => ({
        showCityDropdown: !prevState.showCityDropdown
      }));
    };


  //  搜尋欄位
  componentDidMount_search() {
    axios.get('http://localhost:8000/hotelList/search')
      .then(response => {
        this.setState({ hotels: response.data });
        console.log(this.setState)
      })
      .catch(error => console.error('Error fetching hotels:', error));
  }

  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  handleHotelNameChange = (e) => {
    this.setState({ hotelName: e.target.value });
  };

  handleDateChange = (dates) => {
    // 將所選日期範圍更新到組件狀態中
    this.setState({ dates });
  };

  handleSearch = (e) => {
  const { searchQuery, hotelName, dates } = this.state;
  axios.post('http://localhost:8000/hotelList/search', {
    city: searchQuery,  //新增對應的旅館名稱值
    hotelName: hotelName, // 新增對應的旅館名稱值
    // startDate: dates[0],
    // endDate: dates[1]
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
      const { hotels, rooms, selectedCities, selectedRoomTypes, selectedPriceRanges, selectedPeople, selectFacility, showCityDropdown} = this.state;
      const { city, date, people, dates, searchQuery, hotelName} = this.state;
      const parsePrice = (priceStr) => {
        // 移除字符串中的千位分隔符（,）轉換為數字
        return Number(priceStr.replace(/,/g, ''));
      };
      const filteredHotels = hotels.filter(hotel => {
          // 把hotel轉為數字下去比對
          const hotelPrice = Number(hotel.price.replace(/,/g, ''));
          // 把roompeople轉換為數字
          const roomPeople = Number(hotel.room_people);
          return (
            //城市篩選
            (selectedCities.length === 0 || selectedCities.some(city => hotel.adress.includes(city))) &&
            //房型篩選
            (selectedRoomTypes.length === 0 || selectedRoomTypes.some(type => hotel.room_type.includes(type))) &&
            //價格區間篩選
            (selectedPriceRanges.length === 0 || selectedPriceRanges.some(range => {
              const [minPrice, maxPrice] = range.replace(/[$,]/g, '').split('~').map(Number);
              return hotelPrice >= minPrice && hotelPrice <= maxPrice;
            })) &&
            // 入住人數篩選
            (selectedPeople.length === 0 || selectedPeople.some(peopleRange => {
              const [minPeople, maxPeople] = peopleRange.split('~').map(Number);
              return roomPeople >= minPeople && roomPeople <= maxPeople;
            })) &&  
            //設備篩選
            (selectFacility.length === 0 || selectFacility.some(facility => hotel.facility.includes(facility))) 
          );
        });
        const allHotels = [...hotels, ...filteredHotels] 

   

        
       
      
        return (
            <div >
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
                <FormControl
                type="text"
                placeholder="搜尋旅館名稱" // 
                className="search-color search-input" 
                aria-label="旅館名稱" 
                value={hotelName} 
                onChange={this.handleHotelNameChange}
/>
                {/* <Button className="button-color search-button" variant="outline-secondary" onClick={() => this.setState({ city: '' })}><XCircleFill /></Button> */}
              </div>
              <div className="button-container position-relative">
                <DatePicker
                  type=""
                  className="search-color"
                  selectsRange={true}
                  startDate={dates[0]}
                  endDate={dates[1]}
                  onChange={this.handleDateChange}
                  minDate={new Date()}
                  onClick={this.toggleClass}
                />
              </div>
              <Button variant="btn btn-primary button-radius button-search" onClick={this.handleSearch}>搜尋</Button>
            </div>
          </InputGroup>
              </Form>
              {/* <div className='introduce-title'>
                <span>首頁</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-right" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671"/>
                  </svg>
                <span>台灣</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-right" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671"/>
                  </svg>
                <span>台北地區</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-right" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671"/>
                  </svg>
                <span>搜尋結果</span>
              </div> */}
            <div className='container overflow-hidden'>
              
          <div className='row'>
              <div className="p-3 search-result ps-5 mb-0">
            <h4 className='ps-2 d-flex justify-content-between search-result'>
              <span className="text-primary city-result">
              <ul className='list-unstyled d-flex text-dark'> 
                <li className="pe-2">篩選條件:</li> 
                {selectedCities.map(city => (
                  <li className="pe-2 fs-6 selected-result" key={city}>{city} </li>
                ))}
                {selectedRoomTypes.map(roomType => (
                  <li className="pe-2 fs-6 selected-result" key={roomType}>{roomType} </li>
                ))}
                {selectedPriceRanges.map(priceRange => (
                  <li className="pe-2 fs-6 selected-result" key={priceRange}>{priceRange} </li>
                ))}
                {selectedPeople.map(peopleRange => (
                  <li className="pe-2 fs-6 selected-result" key={peopleRange}>{peopleRange} 人</li>
                ))}
                { selectFacility.map(facility => (
                  <li className="pe-2 fs-6 selected-result" key={facility}>{facility} 人</li>
                ))}
              </ul>
              <p className='text-primary'>共 {filteredHotels.length} 筆</p>

              </span>

       
                  
             <div ref={this.wrapperRef} className="custom-dropdown" show={this.state.showDropdown} onToggle={this.toggleDropdown} >
                <button onClick={this.toggleDropdown} className="dropdown-toggle hot">
                  熱門度

                </button>
                {this.state.showDropdown && (
                  <div className="dropdown-menu hot-option">
                    <a href="#" className="dropdown-item" onClick={() => this.handleOptionClick('sortByPriceAsc')}>價格排序低到高</a>
                    <a href="#" className="dropdown-item" onClick={() => this.handleOptionClick('sortByPriceDesc')}>價格排序高到低</a>
                  </div>
                )}
                </div>

             </h4>
            <div className="d-flex arrangement">
              <h5 className="">排列 :</h5>
              <span>
                <span className="gap ps-2">|</span>
                <a href="＃" className="gap-1">
                  <i className="bi bi-hand-thumbs-up-fill ps-2"></i>
                  熱門度
                </a>
              </span>
              <span>
                <span className="gap ps-2">|</span>
                <button className="gap-1 text-black link-like-button">
                <i className="bi bi-fire ps-2"></i>
                  熱門程度
                </button>
              </span>
              <span>
                <span className="gap ps-2">|</span>
                <button className="gap-1 text-black link-like-button" onClick={() => this.handleOptionClick('sortByPriceAsc')}>
                <i className="bi bi-currency-dollar ps-2 "></i>
                  價格:高到低
                </button>
              </span>
              <span>
                <span className="gap ps-2">|</span>
                <button className="gap-1 text-black link-like-button" onClick={() => this.handleOptionClick('sortByPriceDesc')}>
                <i className="bi bi-currency-dollar ps-2"></i>
                  價格:低到高
                </button>
              </span>
            </div>
               </div>
            <div className='col-md-3 search-position w-25 fixed-sidebar'>
            <ul className="list-group shadow search-left">
              <li className="list-group-item border-0 indate text-start fs-3 ps-4" aria-current="true">城市</li>
              
              <section className='text-start position-relative row'>
              <div className='col-6 ps-4'>             
                    <button className='btn seleted-button position-relative' onClick={() => this.toggleCitySelection('台中市')}>
                        <input 
                            type="checkbox" 
                            value="台中市" 
                            checked={selectedCities.includes('台中市')}
                            onChange={() => {}} 
                        /> 台中市
                    </button>
                    <span className="badge badge-position text-black rounded-pill"></span>
                
        
                    <button className='btn' onClick={() => this.toggleCitySelection('台北市')}>
                        <input 
                            type="checkbox" 
                            value="台北市" 
                            checked={selectedCities.includes('台北市')}
                            onChange={() => {}} 
                        /> 台北市
                      </button>

               
                    <button className='btn' onClick={() => this.toggleCitySelection('新北市')}>
                        <input 
                            type="checkbox" 
                            value="新北市" 
                            checked={selectedCities.includes('新北市')}
                            onChange={() => {}} 
                        /> 新北市
                    </button>
        
                

                
                    <button className='btn' onClick={() => this.toggleCitySelection('高雄市')}>
                        <input 
                            type="checkbox" 
                            value="高雄市" 
                            checked={selectedCities.includes('高雄市')}
                            onChange={() => {}} 
                        /> 高雄市
                    </button>
                </div>

                <div className='col-4'></div>
                </section>
                <br />

              <li className="list-group-item border-0 indate text-start fs-3 ps-4 " aria-current="true">房型</li>
              <section className='text-start position-relative row'>
              
              <div className='col-8 ps-4'>
                <button className='btn' onClick={() => this.toggleRoomTypeSelection('雙人房')}>
                        <input 
                            type="checkbox" 
                            value="雙人房" 
                            checked={selectedRoomTypes.includes('雙人房')}
                            onChange={() => {}} 
                        /> 雙人房
                    </button>
            
             
                    <button className='btn' onClick={() => this.toggleRoomTypeSelection('標準雙人')}>
                        <input 
                            type="checkbox" 
                            value="標準雙人" 
                            checked={selectedRoomTypes.includes('標準雙人')}
                            onChange={() => {}} 
                        /> 標準雙人房
                    </button>
               
                    <button className='btn' onClick={() => this.toggleRoomTypeSelection('三人房')}>
                        <input 
                            type="checkbox" 
                            value="三人房" 
                            checked={selectedRoomTypes.includes('三人房')}
                            onChange={() => {}} 
                        /> 三人房
                    </button>


                    <button className='btn' onClick={() => this.toggleRoomTypeSelection('四人房')}>
                        <input 
                            type="checkbox" 
                            value="四人房" 
                            checked={selectedRoomTypes.includes('四人房')}
                            onChange={() => {}} 
                        /> 四人房
                    </button>
                </div>
                <div className='c0l-4'></div>

              </section>                

              <li className="list-group-item border-0 indate text-start fs-3 ps-4 " aria-current="true">價格區間</li>
              <section className='text-start position-relative row'>

              <div className='col-8 ps-4'>
              <button as="label" className="btn dropdown-item-checkbox" onClick={() => this.togglePriceRangeSelection('0~3,000')}>
                    <input 
                      type="checkbox" 
                      value="0~3,000" 
                      checked={selectedPriceRanges.includes('0~3,000')}
                      onChange={() => {}} 
                    /> 0~3,000
                  </button>
        

             
                  <button as="label" className="btn dropdown-item-checkbox" onClick={() => this.togglePriceRangeSelection('3,000~5,000')}>
                    <input 
                      type="checkbox" 
                      value="3,000~5,000" 
                      checked={selectedPriceRanges.includes('3,000~5,000')}
                      onChange={() => {}} 
                    /> 3,000~5,000
                  </button>
               
                  <button as="label" className="btn dropdown-item-checkbox" onClick={() => this.togglePriceRangeSelection('5,000~8,000')}>
                    <input 
                      type="checkbox" 
                      value="5,000~8,000" 
                      checked={selectedPriceRanges.includes('5,000~8,000')}
                      onChange={() => {}} 
                    /> 5,000~8,000
                  </button>
                  </div>
                  <div className='col-6'></div>
              </section>

              <li className="list-group-item border-0 indate text-start fs-3 ps-4 " aria-current="true">人數</li>
              <section className='text-start position-relative row'>
                <div className='col-8 ps-4'>
              <button as="label" className="btn dropdown-item-checkbox" onClick={() => this.togglePeopleSelection('1~2')}>
                        <input 
                          type="checkbox" 
                          value="1~2" 
                          checked={this.state.selectedPeople.includes('1~2')}
                          onChange={() => {}} // onChange是必须的，但实际的事件处理是在onClick中完成的
                        /> 入住人數 1~2
                      </button>                     
                          
                      <button as="label" className="btn dropdown-item-checkbox" onClick={() => this.togglePeopleSelection('3~4')}>
                        <input 
                          type="checkbox" 
                          value="3~4" 
                          checked={this.state.selectedPeople.includes('3~4')}
                          onChange={() => {}}
                        /> 入住人數 3~4
                      </button>
                                        
                      <button as="label" className="btn dropdown-item-checkbox" onClick={() => this.togglePeopleSelection('5~6')}>
                        <input 
                          type="checkbox" 
                          value="5~6" 
                          checked={this.state.selectedPeople.includes('5~6')}
                          onChange={() => {}}
                        /> 入住人數 5~6
                      </button>
                      </div> 
                      <div className='col-4'></div>
              </section>
                
              <li className="list-group-item border-0 indate text-start fs-3 ps-4 " aria-current="true">飯店設施</li>
              <section className='text-start position-relative row'>
                    <div className='col-8 ps-4'>
              <button as="label" className="btn" onClick={() => this.tooggleFacilitySelection('陽台')}>
                        <input 
                        type="checkbox" 
                        value="陽台" 
                        checked={this.state.selectFacility.includes('陽台')}
                        onChange={() => {}}
                        /> 露天陽台
                      </button>

                    <button as="label" className="btn  " onClick={() => this.tooggleFacilitySelection('禁菸客房')}>
                        <input 
                        type="checkbox" 
                        value="禁菸客房" 
                        checked={this.state.selectFacility.includes('禁菸客房')}
                        onChange={() => {}}
                        /> 禁菸客房
                      </button>

                      <button as="label" className="btn " onClick={() => this.tooggleFacilitySelection('免費無線網路')}>
                        <input 
                        type="checkbox" 
                        value="免費無線網路" 
                        checked={this.state.selectFacility.includes('免費無線網路')}
                        onChange={() => {}}
                        /> 免費無線網路
                      </button>

                      <button as="label" className="btn dropdown-item-checkbox" onClick={() => this.tooggleFacilitySelection('私人停車場')}>
                        <input 
                        type="checkbox" 
                        value="私人停車場" 
                        checked={this.state.selectFacility.includes('私人停車場')}
                        onChange={() => {}}
                        /> 私人停車場
                      </button>

                      <button as="label" className="btn dropdown-item-checkbox" onClick={() => this.tooggleFacilitySelection('健身中心')}>
                        <input 
                        type="checkbox" 
                        value="健身中心" 
                        checked={this.state.selectFacility.includes('健身中心')}
                        onChange={() => {}}
                        /> 健身中心
                      </button>

                      <button as="label" className="btn dropdown-item-checkbox" onClick={() => this.tooggleFacilitySelection('24 小時接待櫃檯')}>
                        <input 
                        type="checkbox" 
                        value="24 小時接待櫃檯" 
                        checked={this.state.selectFacility.includes('24 小時接待櫃檯')}
                        onChange={() => {}}
                        /> 24 小時接待櫃檯
                      </button>

                      <button as="label" className="btn dropdown-item-checkbox" onClick={() => this.tooggleFacilitySelection('餐廳')}>
                        <input 
                        type="checkbox" 
                        value="餐廳" 
                        checked={this.state.selectFacility.includes('餐廳')}
                        onChange={() => {}}
                        /> 餐廳
                      </button>
                      </div>
                      <div className='col-2'></div>


              </section>
             
                  
              

                  <Dropdown as="li" className="list-group-item border-0 d-flex">
                  <div className='icon.title p-3 position-relative'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sliders" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1z"/>
                  </svg>
                  <div as="a" className="btn btn-hover btn-width" id="dropdownMenuLink">
                    更多篩選條件
                  </div>    
                  </div>
                  </Dropdown>

            </ul>
                          
             </div>

            <main className='col-md-9 position-relative order-position'>              
            <section className='navbar-plan mb-3'>
          {filteredHotels.map((hotel, index) => (
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
                      <div className="btn-title">
                    <Link to={'/hotelinfo/id:?'} className="text-white text-decoration-none">
                      查看房間資訊
                      </Link>
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

            <nav aria-label="Page navigation example position-relative">
                <ul className="pagination justify-content-center page-icon">
                  <li className="page-item disabled">
                    <button className="page-link link-like-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
                    </svg></button>
                  </li>
                  <li className="page-item"><button className="page-link link-like-button" href="#">1</button></li>
                  <li className="page-item"><button className="page-link link-like-button" href="#">2</button></li>
                  <li className="page-item"><button className="page-link link-like-button" href="#">3</button></li>
                  <li className="page-item">
                    <button className="page-link link-like-button" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-right" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671"/>
                      </svg></button>
                  </li>
                </ul>
              </nav>
             </main>
              </div>
            </div>
            
        </div>
        );
    }
}
 
export default App ;

