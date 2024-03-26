import React from 'react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import '../../css/review.css'




const guests = [
    {
        name: "李小龍",
        img: "https://images.pexels.com/photos/1716835/pexels-photo-1716835.jpeg?auto=compress&cs=tinysrgb&w=1200",
        stars: 3,
        disc: "住宿環境優雅，房間整潔舒適，服務人員態度親切，提供了美味的早餐。位置方便，附近有各種餐廳和景點，是一次愉快的住宿體驗。",
        date: "2023年6月19日"
    },
    {
        name: "陳小美",
        img: "https://images.pexels.com/photos/1716835/pexels-photo-1716835.jpeg?auto=compress&cs=tinysrgb&w=1200",
        stars: 4,
        disc: "住宿環境優雅，房間整潔舒適，服務人員態度親切，提供了美味的早餐。位置方便，附近有各種餐廳和景點，是一次愉快的住宿體驗。",
        date: "2023年7月19日"
    },
    {
        name: "Amber Chang",
        img: "https://images.pexels.com/photos/1716835/pexels-photo-1716835.jpeg?auto=compress&cs=tinysrgb&w=1200",
        stars: 4,
        disc: "住宿環境優雅，房間整潔舒適，服務人員態度親切，提供了美味的早餐。位置方便，附近有各種餐廳和景點，是一次愉快的住宿體驗。",
        date: "2022年9月28日"
    },
    {
        name: "張先生",
        img: "https://images.pexels.com/photos/1716835/pexels-photo-1716835.jpeg?auto=compress&cs=tinysrgb&w=1200",
        stars: 5,
        disc: "住宿環境優雅，房間整潔舒適，服務人員態度親切，提供了美味的早餐。位置方便，附近有各種餐廳和景點，是一次愉快的住宿體驗。",
        date: "2023年12月31日"
    },
]
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
  
  return (
    <div >
      <Carousel responsive={responsive} className='reviewWrapper'>
                {review.map((data, index) => (
                    <div key={index} className='guestCard'>
                        <div className='guestCardTitle'>
                        <div className='guestCardTitleName'>
                            {/* <img src={data.img} alt='' className='guestImg' /> */}
                            <span>{data.name}</span>
                        </div>
                        <span>{formateDate(data.endDate)}</span>
                        </div>
                        <div className='guestCardSecond'>
                        <h4>{data.title}</h4>
                        <span>{data.stars}</span>
                        </div>
                        <div className='guestCardisc'>{data.content}</div>
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
