import React from 'react'
import { FaStar, FaBroom, FaTools, FaSearchLocation } from "react-icons/fa";
import { MdRoomService } from "react-icons/md";
import { Slide } from "react-awesome-reveal";

import '../../css/rate.css'




const Rate = () => {
    // const guest = "";
    // guest = guests.map((data)=>(
    //     <GuestCard name={data.name} img={data.img}
    //             stars={data.stars} disc={data.disc}
    //             date={data.date} />
    // ))

    // function GuestCard  (props) {
    //     return(
    //         <div className='guestContainer'>

    //         </div>
    //     )
    // }

    return (
        
        <div className='rateContainer' id='comment'>
           
            <div className='rateWrapper'>
                <Slide className='rateWrapperTitle'>
                    <h1 >住客經驗談</h1>
                </Slide>
                <div className='rateBlock'>
                    <h3>整體評分</h3>
                    <p>4.3</p>
                    <FaStar className='icon'/>
                </div>
                <div className='rateBlock'>
                    <h3>整體清潔度</h3>
                    <p>4.6</p>
                    <FaBroom className='icon'/>     
                </div>
                <div className='rateBlock'>
                    <h3>飯店服務</h3>
                    <p>4.8</p>
                    <MdRoomService className='icon'/>
                </div>
                <div className='rateBlock'>
                    <h3>設施與設備</h3>
                    <p>4.5</p>
                    <FaTools className='icon'/>
                </div>
                <div className='rateBlock'>
                    <h3>地理位置</h3>
                    <p>4.6</p>
                    <FaSearchLocation className='icon'/>
                </div>
            </div>

            
        </div>
        
    )
}

export default Rate
