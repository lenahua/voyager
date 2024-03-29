import React from 'react';
import { FaWifi, FaBell, FaDumbbell, FaCar,
     FaSmokingBan, FaLuggageCart, FaSwimmingPool,
      FaArrowAltCircleLeft, FaArrowAltCircleRight, FaLongArrowAltRight } from "react-icons/fa";
import { RiSafeFill } from "react-icons/ri";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { Swiper, SwiperSlide } from 'swiper/react'
import { Slide } from "react-awesome-reveal";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

import  { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';


import "../../css/service.css";

const Service = ({place,viewPic}) => {
    // console.log(place)
    const service = [
        {
            icon: <FaWifi/>,
            title: "房內免費Wi-fi"
        },
        {
            icon: <FaBell/>,
            title: "24小時櫃檯服務"
        },
        {
            icon: <FaDumbbell/>,
            title: "健身房"
        },
        {
            icon: <FaCar/>,
            title: "免費停車場"
        },
        {
            icon: <FaSmokingBan/>,
            title: "房內禁菸"
        },
        {
            icon: <FaLuggageCart/>,
            title: "可寄放行李"
        },
        {
            icon: <FaSwimmingPool/>,
            title: "游泳池"
        },
        {
            icon: <RiSafeFill />,
            title: "保險箱"
        },
        {
            icon: <AiFillSafetyCertificate />,
            title: "房卡進出"
        }
    ]
    if(!place){
        return
    }

  return (
    <div id='faci'>
        
        <div className='serviceContainer'>
        
            
            <div className='serviceWrapper'>
                <Slide className='Facititle'>
                    <h1>設施與服務</h1>
                </Slide>
                
                {service.map((data, i)=>(
                    <div className='textNicon' key={i}>
                        {data.icon}
                        <p>{data.title}</p>
                    </div>
                ))}
            </div>
            <div className='nearbyWrapper'>
                <Slide>
                    <h2>{place.city}特色景點</h2>
                </Slide>
                
                <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    loop={true}
                    slidesPerView={'auto'}
                    allowTouchMove={true}
                    coverflowEffect={{
                            rotate: 0,
                            stretch: 0,
                            depth: 100,
                            modifier: 2.5
                        }}
                    direction={'horizontal'}
                    pagination={{el: '.swiperPagination', clickable: true}}
                    navigation={{
                        nextEl: '.swiperButtonNext',
                        prevEl: '.swiperButtonPrev',
                        clickable: true
                    }}
                    modules={[EffectCoverflow, Pagination, Navigation]}
                    className='swiperContainer'
                >
                    {viewPic.map((d, i) => (
                        <SwiperSlide className="horizontalSlide" key={i}>
                        <img src={`data:image/jpeg;base64,${d.img}`} alt={i} className='swiperImg'></img>
                        <h3 className='imgTitlle'>{d.title}</h3>
                        <a href='/#'><FaLongArrowAltRight className='imgLink'/></a>
                        </SwiperSlide>
                    ))}
                    
                    <div className='sliderControler'>
                            <div className='swiperButtonPrev sliderArrow'>
                                <FaArrowAltCircleLeft/>
                            </div>
                            <div className='swiperPagination'></div>
                            <div className='swiperButtonNext sliderArrow'>
                                <FaArrowAltCircleRight/>
                            </div>
                            <a href='/viewPage'><h5>查看更多</h5></a>
                    </div>
                    
                </Swiper>
                
            </div>
            
        </div>
        
    </div>
  )
}

export default Service
