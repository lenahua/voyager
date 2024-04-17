import React, { useState, useEffect } from 'react';
import { FaLocationArrow, FaArrowAltCircleRight, FaArrowAltCircleLeft }from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { Fade, Slide } from "react-awesome-reveal";
import { FaLocationDot } from "react-icons/fa6";

import { GoogleMap, useJsApiLoader,  Marker} from '@react-google-maps/api';
import hotelIcon from '../../img/hotelIcon.png'


import "../../css/hotel.css"

const containerStyle = {
  width: '30%',
  height: '250px'
};

const Hotel = ({place, photos, rate}) => {
  // map init
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "APIKEY"
  })
  const markerRef = React.useRef(null);

  const [slideNumber, setSlideNumber] = useState(0)

  const [open, setOpen] = useState(false)

  if(!place){
    return null;
  }
  console.log(place.lng)
  const handleOpen = (i)=>{
    setSlideNumber(i);
    setOpen(true)
  }
  const handleMove = (direction)=>{
    let newSlideNumber;

    if(direction === 'l'){
      newSlideNumber = (slideNumber === 0) ? 5 : slideNumber-1
    }else{
      newSlideNumber = (slideNumber===5) ? 0 : slideNumber+1
    }
    setSlideNumber(newSlideNumber);
  }
  const mapOptions = {
    zoom: 14,
    center: {lat: place.lati, lng: place.lng},
    mapTypeId: 'roadmap', 
    language: 'zh-CN', 
    disableDefaultUI: true
  };

  // const handleMarkerClick = () => {
  //   const marker = markerRef.current;
  //   console.log('Clicked marker:', marker);
  //   console.log('Marker position:', marker.getPosition().toJSON());
  // };
 

  return (
    <div>
      <Fade className='hotelContainer'>
        {open && 
        <div className='slider'>
          <IoIosCloseCircle className='close' onClick={()=> setOpen(false)}/>
          <FaArrowAltCircleLeft className='arrow' onClick={()=> handleMove("l")}/>
          <div className='sliderWrapper'>
            <img src={photos[slideNumber].photo_url} className='sliderImg' alt=''></img>
          </div>
          <FaArrowAltCircleRight className='arrow' onClick={()=> handleMove("r")}/>  
        </div>}
        <div className='hotelWrapper'>
          <div className='hotelImages'>
            { 
              photos.map((photo, i) => (
                <div className='hotelImgWrapper' key={i}>
                  <img src={photo.photo_url} alt='' className='hotelImg' onClick={()=>handleOpen(i)}></img>
                </div>
            ))
            }
          </div>
          <div className='rating'>{rate.avgAll}</div>
          <h1 className='hotelTitle'>{place.name}</h1>
          <div className='hotelAddress'>
            <FaLocationArrow/>
            <span>{place.address}</span>
          </div>
          <div className='hotelLinkNav'>
              <ul className='navName'>
                <li><a href="#desc" id='desc'>簡介</a></li>
                <li><a href="#room">房型</a></li>
                <li><a href='#faci'>設施</a></li>
                <li><a href='#comment'>評論</a></li>
                <li><a href='#policy'>政策</a></li>
              </ul>
          </div>
          <div className='hotelDetails' >
            <div className='hotelDetailsTexts'>
              <p className='hotelDesc' id='desc'>
                  {place.descri}
              </p>
            </div>
            {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  options={mapOptions}
                  onLoad={(map) => console.log('Map loaded!', map)}
                >
                <Marker 
                        position={mapOptions.center}
                        // onClick={handleMarkerClick}
                        options={{
                          icon: hotelIcon
                        }}
                        />
                </GoogleMap>
            ) : <></>}
          </div>
          <Slide>
            <h1 id='room' className='room'>房型</h1>
          </Slide>
        </div>
      </Fade>
    </div>

  )
  




  

}

export default Hotel
