import React, { useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { FaBed, FaPaperclip } from "react-icons/fa";
import { Link } from 'react-router-dom';
import "../../css/roomm.css"

const Room = ({room, onClick, handleSelect}) => {
  


  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };
  
  
  
  
  return (
      <div className='outside' >
        
        <Carousel responsive={responsive} className='cardjing' >
        
            {room.map((roomdetail, i)=>(
              <div className='roomCard' key={i} >
                <div className='innerCard' >
                  <img src={roomdetail.room_pic} alt='' className='roomImages' onClick={()=>onClick(roomdetail.room_id)}></img>
                  <div className='roomCardTitle' >
                    <h2 className='roomName' onClick={()=>onClick(roomdetail.room_id)} >{roomdetail.room_type}</h2>
                    <p>每晚價錢${roomdetail.price}</p>
                  </div>
                  <div className='roomCardDesc' >
                    <FaBed/>
                    <p>{roomdetail.bed_type}</p>
                  </div>
                  
                  
                  <div className='roomCardRestroom'>
                    <div className='restRoom'>
                      <FaPaperclip/>
                      <p >剩餘房間數</p>
                    </div>
             
                    <select onChange={(ev)=>handleSelect(ev, roomdetail.price)}>
                      {[...Array(roomdetail.quantity)].map((_, optionIndex)=>(
                          <option key={optionIndex +1} value={optionIndex +1}>{optionIndex +1}</option> 
                      ))}
                    </select>
                
                  </div>

                    
                    <Link to={`/hotelOrder/${roomdetail.hotel_id}/${roomdetail.room_id}`}>
                      <button className='price' >立即預訂 ${roomdetail.price}</button>
                    </Link>
                </div>
              </div>
            ))}

        </Carousel>
        
      </div>

    
  )
}

export default Room
