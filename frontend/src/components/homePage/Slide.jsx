import React, { Component } from 'react';
import 'bootstrap/dist/js/bootstrap';
import '../../css/homePage/Slide.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Img1 from './img/taichung.jpg';
import Img2 from './img/taipei.jpg';
import Img3 from './img/tainan.jpg';
import Img4 from './img/kaohsiung.jpg';
import Aos from 'aos';
import 'aos/dist/aos.css';
class Slide extends Component {
    state = { 
        currentSlide: 0,
        slideInterval: null
    }
    // aos

    componentDidMount() {
        Aos.init({
            duration : 1000,
            easing: 'ease-out-quart',  
            delay: 150,
            offset: 100 //卷軸滾到多少px才觸發
        });
    }

    // componentDidMount() {
    //     this.startSlideShow();
    // }

    // componentWillUnmount() {
    //     this.stopSlideShow();
    // }

    showSlide = (n) => {
        const { currentSlide } = this.state;
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;
        slides[currentSlide].classList.remove('active');
        const nextSlideIndex = (n + totalSlides) % totalSlides;
        slides[nextSlideIndex].classList.add('active');
        this.setState({ currentSlide: nextSlideIndex });
    }

    nextSlide = () => {
        const { currentSlide } = this.state;
        this.showSlide(currentSlide + 1);
        // console.log(this.state.currentSlide);
    }

    prevSlide = () => {
        const { currentSlide } = this.state;
        this.showSlide(currentSlide - 1);
    }

    // startSlideShow = () => {
    //     const { slideInterval } = this.state;
    //     if (!slideInterval) {
    //         this.setState({ slideInterval: setInterval(this.nextSlide, 5000) });
    //     }
    // }

    // stopSlideShow = () => {
    //     const { slideInterval } = this.state;
    //     clearInterval(slideInterval);
    //     this.setState({ slideInterval: null });
    // }
    
    render() { 
        return (
            <div className="row " data-aos="fade-left">
                <div className=" d-flex justify-content-center py-5" >
                    <h1>探索台灣</h1>
                </div>
                <div className="slider-container" >
                    <div className="slide active" id="slide1">
                        <div className="text-box">
                            <h1>台中</h1>
                            <p>台中位於臺灣西半部的樞紐位置，四季氣候宜人。林立的百貨公司、各有特色的商圈、各色陳列的精品名店、濃濃歐式風味的精明商圈，以及美術園道的椰林餐廳，都讓台中市有如巴黎香榭大道的優雅浪漫，滿足所有追求時尚的品味饗宴。</p>
                            <a href="#" className="btnSlide">更多台中景點</a>
                        </div>
                        <img src={Img1} alt="Slide 1" className="Imgxian"/>
                    </div>
                    <div className="slide" id="slide2">
                        <div className="text-box">
                            <h1>台北</h1>
                            <p>台北市是台灣的首都，充滿現代與傳統魅力。從繁華的信義區到寧靜的國立故宮博物院，各式美食、文化景點和購物天堂等等，讓人流連忘返。著名景點包括象山、國立故宮博物院、台北101大樓和士林夜市等。台北以其多元的美食聞名，從道地的台灣小吃到高級餐廳應有盡有。</p>
                            <a href="#" className="btnSlide">更多台北景點</a>
                        </div>
                        <img src={Img2} alt="Slide 2" className="Imgxian"/>
                    </div>
                    <div className="slide" id="slide3">
                        <div className="text-box">
                            <h1>台南</h1>
                            <p>台南是台灣南部的文化古城，擁有悠久的歷史和豐富的文化底蘊。古老的建築、廟宇和街道充滿了古色古香的風情。代表性景點包括安平古堡、赤嵌樓和孔廟等。此外，台南也以其獨特的美食聞名，如台南小吃、鹽水擂茶等，讓遊客享受口腹之樂。</p>
                            <a href="#" className="btnSlide">更多台南景點</a>
                        </div>
                        <img src={Img3} alt="Slide 3" className="Imgxian"/>
                    </div>
                    <div className="slide" id="slide4">
                        <div className="text-box">
                            <h1>高雄</h1>
                            <p>高雄擁有現代化的城市風貌和多樣化的文化特色。以高雄港為中心，擁有眾多購物中心、美食街和文化景點，如愛河、西子灣和旗津等。此外，高雄也以其豐富的美食文化聞名，如蓮池潭美食街和六合夜市，各式海鮮和小吃令人垂涎欲滴。</p>
                            <a href="#" className="btnSlide">更多高雄景點</a>
                        </div>
                        <img src={Img4} alt="Slide 3" className="Imgxian"/>
                    </div>  
                    <FontAwesomeIcon icon={faArrowLeft} id="prevBtn"  className="arrowXian" onClick={this.prevSlide}/>
                    <FontAwesomeIcon icon={faArrowRight} id="nextBtn"  className="arrowXian" onClick={this.nextSlide}/>
                </div>    
            </div>
        );
    }
}
 
export default Slide;