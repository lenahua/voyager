import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from "react-router";
class HotelOrderPage extends Component {
    constructor(props){
        super(props);
        this.state = { 
            userInfo : [{account: '請輸入用戶名', email: '請輸入電子信箱', name: '請輸入姓名', telephone: '請輸入電話', Uid:0}],
            creditCard : [{cardType: 'Visa', cardNumber: '0000-0000-0000-0000', name: '請輸入姓名', valid: '2024-12-30T16:00:00.000Z', cvc: '123'}, {}, {}, {}, {}],
            order : [],
            selectIndex : 0,
            date : [['2024', '12'],['2024', '12'],[],[]],
            hotel : [{name: '樂微行旅 The Way Inn.', address: '台中市南區民意街66號'}],
            roomType : [{room_type: '日式雙人房－禁菸', price: '4,284'}],
            newPrice : 0
        } 
    }

    render() { 
        return (
            <div className="container pb-4">
                <div className="row">
                    <div className="col-md-3 mt-5 border border-secondary border-3 rounded-2 " >
                        <div className="sticky-top" style={{top:"0px"}}> 
                            <div className="d-flex flex-column bd-highlight m-1 mt-3">
                            <div className="p-2  bd-highlight">
                                <h4>您的訂房資訊</h4>
                                <div className="d-flex mt-2">
                                    <div className="me-auto "><h5 className='fw-bold'>{this.state.hotel[0].name}</h5></div> {/*ps-2*/}
                                    {/* <div>61則評語</div>
                                    <div className="bg-info ms-4 p-2 rounded-2">4.5</div> */}
                                </div>
                                <p className="mt-2">{this.state.hotel[0].address}</p>
                            </div>
                            <div className="border-top border-3 mt-2 border-secondary"></div>
                            <div className="p-2  bd-highlight mt-2">
                                <h3>入住時間</h3>
                                <h5 className="ps-2">2024-4-15 </h5>
                                <p className="ps-2">15:00—21:00</p>
                            </div>
                            <div className="border-top border-3 mt-2 border-secondary"></div>
                            <div className="p-2  bd-highlight mt-2">
                            <h3>退房時間</h3>
                                <h5 className="ps-2">2024-4-16 </h5>
                                <p className="ps-2">11:00前</p>
                            </div>
                            <div className="border-top border-3 mt-2 border-secondary"></div>
                            <div className="p-2  bd-highlight mt-2">
                                <h3>已選擇：</h3>
                                <h5>{this.state.roomType[0].room_type}</h5>
                                <h4 className="text-primary">共兩房</h4>
                                <button className="btn btn-primary btn-sm my-3" type="button" onClick={()=>{window.location="/hotelInfo/1";}}>更改選擇</button>
                                <h4 className="text-primary">總金額：TWD {this.state.newPrice}</h4>
                            </div>
                        </div>
                    </div>
                    
                    </div>
                    <div className="col-md-8 mt-5 offset-md-1 " style={{paddingLeft: "0px",paddingRight: "0px"}}>
                        {
                            !this.props.auth && 
                            <div className="border border-3 border-secondary rounded-2 mb-3">
                                <div className="m-3 fw-bold text-primary"><h5>登入即可自動套用個人資料預訂。</h5></div>
                            </div>
                        }
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

                            </form>
                            <div className="row">
                                <button className="btn btn-lg btn-outline-primary col-auto ms-auto me-3" onClick={this.doClick}>完成訂房</button>
                            </div>   
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    componentDidUpdate = async (prevProps,prevState) => {
        if(this.props.userId !== prevProps.userId){
            // this.setState({uid : this.props.userId});
            console.log('after componentDidUpdate',this.props.userId);
            // console.log('after componentDidUpdate',this.props.auth);
            console.log("after auth is ",this.props.auth);
            var result = await axios(`http://localhost:8000/checkout/user/${this.props.userId}`); 
            var newState = {...this.state}; 
            newState.userInfo = result.data;
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
        }
        
        // console.log("uid2 is ",this.props.userId);
        
    }
    componentDidMount = async () => { 
        localStorage.setItem("previouspath", window.location.pathname);
        console.log("before componentDidUpdate",this.props.userId);
        const { match } = this.props;
        console.log("before auth is ",this.props.auth);
        
        
        var hotelResult = await axios(`http://localhost:8000/checkout/hotel/${match.params.hotelId}`);
        var newHotelState = {...this.state};
        newHotelState.hotel = hotelResult.data;
        this.setState(newHotelState);
        
        var roomResult = await axios(`http://localhost:8000/checkout/hotel/${match.params.hotelId}/${match.params.roomId}`);
        var newRoomState = {...this.state};
        newRoomState.roomType=roomResult.data;
        this.setState(newRoomState);
        // if(this.props.auth == false){
        //     alert("請先登入會員");
        // }
        console.log("price",match.params.price);
        this.setState({newPrice : match.params.price});
    }
    doClick = async () => {
        var dataToServer = {
            Uid:this.props.userId,
            hotelId:this.state.hotel[0].hotel_id,
            startDate:'2024-04-15',
            endDate:'2024-04-16',
            price: this.state.newPrice
            // price: this.state.newPrice
        }
        console.log(dataToServer);
        await axios.post('http://localhost:8000/checkout/hotel/order', dataToServer);
        alert("已完成訂單 點擊確定探索更多景點");
        window.location = "/viewPage/台中市";
        
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
 
export default withRouter(HotelOrderPage);