import React, { useState } from 'react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { FaUserCircle } from "react-icons/fa";

import '../../css/review.css'


const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1, // 可以滑動的項目數
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
};

const Review = ({review}) => {

  const [expandCard, setEcpandCard]= useState(null);
  // 設定卡片的展開狀態
  const toggleExpand = (index)=>{
    setEcpandCard(expandCard === index ? null : index)
  }
  
  return (
    <div >
      <Carousel responsive={responsive} className='reviewWrapper'>
                {review.map((data, index) => (
                    <div key={index} className='guestCard'>
                        <div className='guestCardTitle'>
                        <div className='guestCardTitleName'>
                            <FaUserCircle />
                            <span>{data.name}</span>
                        </div>
                        <span>{formateDate(data.ratetime)}</span>
                        </div>
                        <div className='guestCardSecond'>
                        <h4 className='dataTitle'>{data.title}</h4>
                        <span>{data.stars}</span>
                        </div>
                        {/* 如果點擊看更多 或是 內容是空的 直接顯示原始內容 */}
                        {expandCard === index || !data.content ? (
                                data.content
                            ) : (
                              // 如果沒有被點擊，就擷取50個字，超過的顯示...，設置一個按鈕查看完整內容
                              // 按鈕設點擊事件，點擊要傳index給function，並判斷>>非點擊顯示查看完整訊息
                                <>
                                    {data.content.substring(0, 50)}
                                    {data.content.length > 50 && '... '}
                                    <button onClick={() => toggleExpand(index)} className='wholeBtn'>
                                        {expandCard === index ? '收起!!!!!' : '查看完整訊息'}
                                    </button>
                                </>
                            )}
                    </div>
                ))}
        </Carousel>
    </div>
  )
}

const formateDate = (endDate)=>{
  const date = new Date(endDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() +1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default Review
