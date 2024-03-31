import React, {useState} from 'react'
import { FaHome, FaCheck, FaCity, FaWater, FaRegSnowflake, FaBath, FaWifi } from "react-icons/fa";
import { PiTelevision } from "react-icons/pi";
import { IoIosBed,IoMdPeople,IoIosCloseCircleOutline } from "react-icons/io";
import { Link } from 'react-router-dom';

import '../../css/roompic.css'

const Roompic = ({id, isOpen, onClose, selectRoomPic, selectRoomData, selectRoom, totalPrice}) => {
    const [sliderData, setSliderData] = useState(selectRoomPic[0])
    const biggerHandler = (index)=>{
        // console.log(index);
        const slider = selectRoomPic[index]
        setSliderData(slider)
    }
    // console.log("This is:"+selectRoomData)
    
  return (
            // <div>
            //     {Array.isArray(selectRoomPic) && selectRoomPic.map((item, i) => (
            //         <img key={i} src={item.room_type_pic} />
            //     ))}
            // </div>

    <div className='modaljjj'>
        <div className='roomInfo'>
            <IoIosCloseCircleOutline className='close' onClick={onClose}/>
            <div className='roomInfoTop'>
                <div>
                
                    <img src={sliderData.room_type_pic} alt='' className='roomBigimg'/>
                    <div className='smallImg'>
                        {selectRoomPic.map((item, i)=>(
                            <div className='roomImg'>
                            <img src={item.room_type_pic} key={i} 
                            alt={i} onClick={()=>biggerHandler(i)} 
                            className={sliderData.room_index === i ? "clicked" : ""}/>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='picDetail'>
                    <h1>{selectRoomData[0].room_type}</h1>
                    <div className='intro'>
                        <div className='iconWithtext'><FaHome/><p>20 m²</p></div>
                        <div className='iconWithtext'><FaCity/><p>市景</p></div>
                        <div className='iconWithtext'><FaWater/><p>河景</p></div>
                        <div className='iconWithtext'><FaRegSnowflake/><p>空調</p></div>
                        <div className='iconWithtext'><FaBath/><p>私人衛浴</p></div>
                        <div className='iconWithtext'><PiTelevision/><p>平面電視</p></div>
                        <div className='iconWithtext'><FaWifi/><p>免費 WiFi</p></div>
                    </div>
                    <div className='shortDesc'>
                        <p>{selectRoomData[0].room_desc}</p>
                    </div>
                    <h5 className='nameBar'> 私人衛浴提供：</h5>
                    <div className='bathRoom'>
                        <div className='bath'><FaCheck className='check'/><p>免費盥洗用品</p></div>
                        <div className='bath'><FaCheck className='check'/><p>吹風機</p></div>
                        <div className='bath'><FaCheck className='check'/><p>淋浴間</p></div>
                        <div className='bath'><FaCheck className='check'/><p>衛生紙</p></div>
                        <div className='bath'><FaCheck className='check'/><p>廁所</p></div>
                    </div>
                    <h5 className='nameBar'>設施／服務：​</h5>
                    <div className='service'>
                        <div className='serviceDetailLeft'>
                            <div className='serviceDetail'><FaCheck className='check'/><p>書桌</p></div>
                            <div className='serviceDetail'><FaCheck className='check'/><p>一氧化碳偵測器</p></div>
                            <div className='serviceDetail'><FaCheck className='check'/><p>保險箱</p></div>
                            <div className='serviceDetail'><FaCheck className='check'/><p>高樓層（有電梯）</p></div>
                            <div className='serviceDetail'><FaCheck className='check'/><p>毛巾</p></div>
                            <div className='serviceDetail'><FaCheck className='check'/><p>建築物中的獨立公寓</p></div>
                            <div className='serviceDetail'><FaCheck className='check'/><p>額外收費的毛巾／床單</p></div>
                            <div className='serviceDetail'><FaCheck className='check'/><p>床邊插座</p></div>
                        </div>
                        <div className='serviceDetailRight'>
                            <div className='serviceDetail'><FaCheck className='check'/><p>電視</p></div>
                            <div className='serviceDetail'><FaCheck className='check'/><p>冰箱</p></div>
                            <div className='serviceDetail'><FaCheck className='check'/><p>電熱水壺</p></div>
                            <div className='serviceDetail'><FaCheck className='check'/><p>各間客房獨立空調</p></div>
                            <div className='serviceDetail'><FaCheck className='check'/><p>衣櫃或衣櫥</p></div>
                        </div>

                    </div>
                </div>
            </div>
            <div className='roomInfoBottom'>
                <div className='bottomText'>
                    <div className='bottomTitle'>
                        <IoMdPeople className='bedroomIcon'/>
                        <h2>{selectRoomData[0].room_type}</h2>
                    </div>
                    <h3>TWD {selectRoomData[0].price} (一晚)</h3>
                </div>
                <div className='bottomMiddle'>
                {selectRoomData[0].bed_type}<IoIosBed/>
                </div>
                <Link to={`/hotelOrder/${id}/${selectRoom}/${totalPrice}`}>
                <button className='bookingButton' >立即預訂</button>
                </Link>
            </div>
        </div>
    </div>

  )
}

export default Roompic
