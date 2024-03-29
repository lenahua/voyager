import React, { useEffect, useState } from 'react';


import Hotel from '../components/hotelList/Hotel';
import Room from '../components/hotelList/Room';
import Service from '../components/hotelList/Service';
import Rate from '../components/hotelList/Rate';
import Review from '../components/hotelList/Review';
import Rule from '../components/hotelList/Rule';


import {useParams, useLocation} from "react-router-dom"
import axios from 'axios';

import Roompic from '../components/hotelList/Roompic';



function HotelInfo(){
    const {id} = useParams();
    const [place, setPlace] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [room, setRoom] = useState([]);
    const [roomPics, setRoomPic] = useState([]);
    const [review, setReview] = useState([]);
    const [viewPic, setViewPic] = useState([]);
    const [rate, setRate] = useState([])
    const location = useLocation();
    useEffect(()=>{
        if(!id){
            return;
        }
    localStorage.setItem("previouspath", window.location.pathname)   
    // console.log("path"+location.pathname)
        axios.get(`http://localhost:8000/hotelInfo/${id}`)
            .then(response=>{
                console.log(response.data)
                setPlace(response.data.hotel)
                setPhotos(response.data.photos)
                setRoom(response.data.room)
                setRoomPic(response.data.roomPic)
                setReview(response.data.reviews)
                setViewPic(response.data.viewpics)
                setRate(response.data.avgRates)
                console.log(response.data.avgRates)
            })
            .catch(error=>{
                console.error('error fetching data: ', error)
            })
    }, [id])

    //  房型modal
    // 需給參數，參數為room_id，把參數丟到state中，調用元件時使用filter
    const [isModalVisible, setModalVisible] = useState(false)
    const [selectRoom, setSelectRoom] = useState(null);
    const handleModalClick = (roomId)=>{
        setSelectRoom(roomId)
        setModalVisible(true)
        
        console.log("click roomid: "+roomId)
    }
    const handleModalClose =()=>{
        setModalVisible(false)
        setSelectRoom(null)
    }


    const selectRoomPic = roomPics.filter(roomPic=> roomPic.room_id === selectRoom )
    const selectRoomData = room.filter(roomData=>roomData.room_id === selectRoom)
    // console.log(selectRoomData)
    // console.log(selectRoomPic)
    // console.log("selectRoomPic:", selectRoomPic)

    const [totalPrice, setTotalPrice] = useState();
    const handleSelect = (event, price) =>{
        const selectQty = parseInt(event.target.value);
        // 把資料庫中的價錢移除逗號，並轉換成數值型態
        const priceNum = price.replace(/,/g, '');
        const totalPrice = selectQty * parseFloat(priceNum);
        
        setTotalPrice(totalPrice);
        console.log(totalPrice)
    }
   

    return(
        <>
            <Hotel place={place} photos={photos} rate={rate}/>

            <Room room={room} onClick={handleModalClick} 
                            handleSelect={handleSelect}/>
            {isModalVisible === true  ? <Roompic id={id}
                                            onClose={handleModalClose} 
                                            selectRoomPic={selectRoomPic} 
                                            selectRoomData={selectRoomData}
                                            selectRoom={selectRoom}/> : ""}
            <Service place={place} viewPic={viewPic}/>
            <Rate rate={rate}/>
            <Review review={review}/>
            <Rule/>
        </>
    )
}

export default HotelInfo;
