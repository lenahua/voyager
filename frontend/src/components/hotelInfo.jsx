import React, { useEffect, useState } from 'react';


import Hotel from '../components/hotelList/Hotel';
import Room from '../components/hotelList/Room';
import Service from '../components/hotelList/Service';
import Rate from '../components/hotelList/Rate';
import Review from '../components/hotelList/Review';
import Rule from '../components/hotelList/Rule';

import {useParams} from "react-router-dom"
import axios from 'axios';

import Roompic from '../css/roompic.css';




function HotelInfo(){
    const {id} = useParams();
    const [place, setPlace] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [room, setRoom] = useState([]);
    const [roomPics, setRoomPic] = useState([]);
    useEffect(()=>{
        if(!id){
            return;
        }
        axios.get(`http://localhost:8000/hotelInfo/${id}`)
            .then(response=>{
                console.log(response.data)
                setPlace(response.data.hotel)
                setPhotos(response.data.photos)
                setRoom(response.data.room)
                setRoomPic(response.data.roomPic)
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
    
    // 設定booking接到id參數
    const [bookingId, setBookingId] = useState(null)
    const handleBooking = (roomID) =>{
        setBookingId(roomID)
        console.log(roomID)
    }

    return(
        <>
            <Hotel place={place} photos={photos}/>

            <Room room={room} onClick={handleModalClick} handleBooking={handleBooking}/>
            {isModalVisible === true  ? <Roompic onClose={handleModalClose} 
                                            selectRoomPic={selectRoomPic} 
                                            selectRoomData={selectRoomData}
                                            handleBooking={handleBooking}
                                            selectRoom={selectRoom}/> : ""}
            <Service />
            <Rate/>
            <Review/>
            <Rule/>
        </>
    )
}

export default HotelInfo;
