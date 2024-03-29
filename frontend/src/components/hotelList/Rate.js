import React from 'react'
import { FaStar, FaBroom, FaTools, FaSearchLocation } from "react-icons/fa";
import { MdRoomService } from "react-icons/md";
import { Slide } from "react-awesome-reveal";

import '../../css/rate.css'




const Rate = ({rate}) => {
    

    return (
        
        <div className='rateContainer' id='comment'>
           
            <div className='rateWrapper'>
                <Slide className='rateWrapperTitle'>
                    <h1 >住客經驗談</h1>
                </Slide>
                <div className='rateBlock'>
                    <h3>整體評分</h3>
                    <p>{rate.avgAll}</p>
                    <FaStar className='icon'/>
                </div>
                <div className='rateBlock'>
                    <h3>整體清潔度</h3>
                    <p>{rate.avgClean}</p>
                    <FaBroom className='icon'/>     
                </div>
                <div className='rateBlock'>
                    <h3>飯店服務</h3>
                    <p>{rate.avgService}</p>
                    <MdRoomService className='icon'/>
                </div>
                <div className='rateBlock'>
                    <h3>設施與設備</h3>
                    <p>{rate.avgFacility}</p>
                    <FaTools className='icon'/>
                </div>
                <div className='rateBlock'>
                    <h3>地理位置</h3>
                    <p>{rate.avgPosition}</p>
                    <FaSearchLocation className='icon'/>
                </div>
            </div>

            
        </div>
        
    )
}

export default Rate
