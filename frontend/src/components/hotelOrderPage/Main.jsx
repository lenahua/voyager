import React, { Component } from 'react';
import axios from 'axios';
class Main extends Component {
    state = { 
        userInfo : [],
        creditCard : [{},{},{},{},{}],
        order : [],
        selectIndex : 0,
        date : [[],[],[],[]],
        hotel : [{}],
        roomType : [{}]
    } 
    render() { 
        return (
            <div className="row">
                <div className="col-md-3 mt-5 border border-secondary border-3 rounded-2 " >
                    <div className="sticky-top" style={{top:"0px"}}> 
                        <div className="d-flex flex-column bd-highlight m-1 mt-3">
                        <div className="p-2  bd-highlight">
                            <h4>您的訂房資訊</h4>
                            <div className="d-flex mt-2">
                                <div className="me-auto "><p className='fw-bold'>{this.state.hotel[0].name}</p></div> {/*ps-2*/}
                                {/* <div>61則評語</div>
                                <div className="bg-info ms-4 p-2 rounded-2">4.5</div> */}
                            </div>
                            <p className="mt-2">{this.state.hotel[0].address}</p>
                        </div>
                        <div className="border-top border-3 mt-2 border-secondary"></div>
                        <div className="p-2  bd-highlight mt-2">
                            <h3>入住時間</h3>
                            <p className="ps-2">2024年2月19日 (一)</p>
                            <p className="ps-2">15:00—21:00</p>
                        </div>
                        <div className="border-top border-3 mt-2 border-secondary"></div>
                        <div className="p-2  bd-highlight mt-2">
                        <h3>退房時間</h3>
                            <p className="ps-2">2024年2月21日 (三)</p>
                            <p className="ps-2">11:00前</p>
                        </div>
                        <div className="border-top border-3 mt-2 border-secondary"></div>
                        <div className="p-2  bd-highlight mt-2">
                            <h3>已選擇：</h3>
                            <h5>{this.state.roomType[0].room_type}</h5>
                            <h4 className="text-primary">共入住兩晚</h4>
                            <button className="btn btn-primary btn-sm my-3" type="button" onClick={()=>{window.location='/';}}>更改選擇</button>
                            <h4 className="text-primary">總金額：{this.state.roomType[0].price}</h4>
                        </div>
                    </div>
                </div>
                
                </div>
                <div className="col-md-8 mt-5 offset-md-1 " style={{paddingLeft: "0px",paddingRight: "0px"}}>
                    <div className="border border-3 border-secondary rounded-2">
                        <div className="m-4">
                        <h4>輸入個人資料</h4>
                        <form>
                            <div className="my-3 row">
                                <div className='col-6'>
                                    <label htmlFor="userName" className="form-label">用戶名 *</label>
                                    {
                                        this.state.userInfo.map( (item,index) => 
                                            <input type="text" className="form-control" id="userName" onChange={this.changeAccount} value={item.account}  key={index}/>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="row">
                                <div className='col-6'>
                                    <label htmlFor="Email" className="form-label">電子信箱 *</label>
                                    {
                                        this.state.userInfo.map( (item,index) =>
                                            <input type="email" className="form-control" id="Email" placeholder='注意，別打錯了！' value={item.email} onChange={this.changeEmail} key={index}/>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className='col-6'>
                                    <p>國家/地區 *</p>
                                    <select className="form-select form-select-md">
                                    <option value="0">台灣</option>
                                    <option value="1">日本</option>
                                    <option value="2">韓國</option>
                                    <option value="3">美國</option>
                                    <option value="4">瑞士</option>
                                    <option value="5">加拿大</option>
                                    <option value="6">澳洲</option>
                                    <option value="7">丹麥</option>
                                    <option value="8">印度</option>
                                    <option value="9">菲律賓</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className='col-6'>
                                    <label htmlFor="Tel" className="form-label">電話 *</label>
                                    {
                                        this.state.userInfo.map( (item ,index) =>
                                            <input type="text" className="form-control" id="Tel" placeholder='以便住宿與您聯繫' onChange={this.changeTel} value={item.telephone} key={index}/>
                                        )
                                    }
                                </div>
                            </div>
                        </form>
                        </div>
                    </div>
                    <div className="border border-3 border-secondary rounded-2 mt-5">
                        <div className="m-4">
                        <h4>請填寫信用卡資訊以保留訂房資格</h4>
                        <form>
                            <div className="my-3 row">
                                <div className="col-6">
                                    <label htmlFor="CardHolder" className="form-label">持卡人姓名 *</label>
                                    {
                                        this.state.userInfo.map((item,index) => 
                                            <input type="text" className="form-control" id="CardHolder" value={item.name} onChange={this.changeName} key={index}/>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className='col-6'>
                                    <p>卡別 *</p>
                                    <select className="form-select form-select-md" value={this.state.creditCard[this.state.selectIndex].cardType} onChange={this.changeCardType}>
                                        <option value="Visa">Visa</option>
                                        <option value="JCB">JCB</option>
                                        <option value="MasterCard">Master</option>
                                        <option value="American Express">American Express</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className='col-6'>
                                    <label htmlFor="Credit" className="form-label">信用卡卡號 *</label>
                                    <input type="text" className="form-control" id="Credit" placeholder='' value={this.state.creditCard[this.state.selectIndex].cardNumber} onChange={this.changeCredit} />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className='col-6'>
                                    <label htmlFor="Tel" className="form-label">電話 *</label>
                                    {
                                        this.state.userInfo.map( (item ,index) =>
                                            <input type="text" className="form-control" id="Tel" placeholder='以便住宿與您聯繫' onChange={this.changeTel} value={item.telephone} key={index}/>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-6">
                                    <p>有效期限 月份 *</p>
                                    <select className="form-select form-select-md" value={this.state.date[this.state.selectIndex][1]} onChange={this.changeMonth}>
                                        <option value="01">01</option>   
                                        <option value="02">02</option>   
                                        <option value="03">03</option>   
                                        <option value="04">04</option>   
                                        <option value="05">05</option>   
                                        <option value="06">06</option>   
                                        <option value="07">07</option>   
                                        <option value="08">08</option>   
                                        <option value="09">09</option>   
                                        <option value="10">10</option>   
                                        <option value="11">11</option>   
                                        <option value="12">12</option>   
                                    </select>
                                </div>
                                <div className="col-3 ">
                                    <p>年份 *</p>
                                    <select className="form-select form-select-md" value={this.state.date[this.state.selectIndex][0]} onChange={this.changeYear}>
                                        <option value="2024">2024</option>   
                                        <option value="2025">2025</option>   
                                        <option value="2026">2026</option>   
                                        <option value="2027">2027</option>   
                                        <option value="2028">2028</option>   
                                        <option value="2029">2029</option>   
                                        <option value="2030">2030</option>   
                                    </select>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-4">
                                    <label htmlFor="CVC" className="form-label">安全碼 *</label>
                                    <input type="text" className="form-control" id="CVC" />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-8">
                                    <label htmlFor="Credit" className="form-label">選擇其他信用卡/金融卡 </label>
                                    <select className="form-select form-select-md" onChange={this.changeSelectedCard}>
                                        {
                                            this.state.creditCard.map((card, index) => (
                                                <option value={card.cardNumber} key={index}>{card.cardNumber}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                        </form>
                        <div className="row">
                            <button className="btn btn-lg btn-outline-primary col-auto ms-auto me-3" onClick={this.doClick}>完成訂房</button>
                        </div>   
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    componentDidMount = async () => { 
        var result = await axios('http://localhost:8000/checkout/user/3'); 
        var newState = {...this.state}; 
        newState.userInfo = result.data;
        // console.log(result.data);
        this.setState(newState);

        var CreditResult = await axios(`http://localhost:8000/checkout/creditCard/${newState.userInfo[0].Uid}`);
        var newCreState = {...this.state};
        newCreState.creditCard = CreditResult.data;
        // console.log(CreditResult.data[0]);
        CreditResult.data.map((item, index)=>{
            var yearAMonth = item.valid.split('-',2);
            newCreState.date[index] = yearAMonth;
        })
        // console.log(newCreState.date);
        this.setState(newCreState);

        var hotelResult = await axios('http://localhost:8000/checkout/hotel/1');
        var newHotelState = {...this.state};
        // console.log(hotelResult.data);
        newHotelState.hotel = hotelResult.data;
        this.setState(newHotelState);
        // console.log('new : ',newHotelState.hotel[0].name);
        
        var roomResult = await axios(`http://localhost:8000/checkout/hotel/${newHotelState.hotel[0].hotel_id}/1`);
        // console.log(roomResult.data[0]);
        var newRoomState = {...this.state};
        newRoomState.roomType=roomResult.data;
        console.log(newRoomState.roomType);
        this.setState(newRoomState);
        


    }
    doClick = async () => {
        var dataToServer = {
            Uid:this.state.userInfo[0].Uid,
            hotelId:this.state.hotel[0].hotel_id,
            startDate:'2024-03-15',
            endDate:'2024-03-17'
        }
        console.log(dataToServer);
        await axios.post('http://localhost:8000/checkout/hotel/order', dataToServer);
        alert("已完成訂單");
        // window.location = "/";
        
    }
    changeSelectedCard = (e) => {
        var selectedIndex = e.target.selectedIndex;
        var selectedCard = this.state.creditCard[selectedIndex]; 
        var newState = { ...this.state };
        newState.creditCard[selectedIndex] = { ...selectedCard }; // 更新第一張信用卡的詳細資料為選定的信用卡
        newState.selectIndex = parseInt(selectedIndex,10);
        this.setState(newState);
        console.log(newState.selectIndex);
    }
    changeMonth = (e) => {
        var newMonth = e.target.value;
        var newState = {...this.state};
        newState.date[newState.selectIndex][1] = newMonth;
        this.setState(newState);
        console.log(newState.date);
    }
    changeYear = (e) => {
        var newYear = e.target.value;
        var newState = {...this.state};
        newState.date[newState.selectIndex][0] = newYear;
        this.setState(newState);
        console.log(newState.date);
    }
    changeCardType = (e) => {
        var newCardType = e.target.value;
        var newState = {...this.state};
        newState.creditCard[this.state.selectIndex].cardType = newCardType;
        this.setState(newState);
    }
    changeCredit = (e) => {
        var newCre = e.target.value;
        var newState = {...this.state};
        newState.creditCard[this.state.selectIndex].cardNumber = newCre;
        this.setState(newState);
    }
    changeAccount = (e) => {
        var newAcoount = e.target.value;
        var newState = {...this.state};
        newState.userInfo[0].account = newAcoount;
        this.setState(newState);
    } 
    changeName = (e) => {
        var newName = e.target.value;
        var newState = {...this.state};
        newState.userInfo[0].name = newName;
        this.setState(newState);
    }
    changeEmail = (e) => {
        var newEmail = e.target.value;
        var newState = {...this.state};
        newState.userInfo[0].email = newEmail;
        this.setState(newState);
    }
    changeTel = (e) => {
        var newTel = e.target.value;
        var newState = {...this.state};
        newState.userInfo[0].telephone = newTel;
        this.setState(newState);
    }

}
 
export default Main;