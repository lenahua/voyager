import React, { Component } from 'react';
import 'bootstrap/dist/js/bootstrap';
import '../../css/homePage/Slide2.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Img1 from './img/taichung.jpg';
import Img2 from './img/taipei.jpg';
import Img3 from './img/tainan.jpg';
import Img4 from './img/kaohsiung.jpg';
import Aos from 'aos';
import 'aos/dist/aos.css';
import Bk1 from './img/booking1.jpeg';
import Bk2 from './img/booking2.jpeg';
import Bk3 from './img/booking3.jpeg';
import Bk4 from './img/booking4.jpeg';
class Slide2 extends Component {
    state = { 
        currentSlide: 0,
        slideInterval: null
    }
    // aos

    componentDidMount() {
        Aos.init({
            duration : 1000,
            easing: 'ease-out-quart',  
            delay: 300,
            // offset: 500
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
        const slides = document.querySelectorAll('.slide2');
        const totalSlides = slides.length;
        slides[currentSlide].classList.remove('active');
        const nextSlideIndex = (n + totalSlides) % totalSlides;
        slides[nextSlideIndex].classList.add('active');
        this.setState({ currentSlide: nextSlideIndex });
        // console.log(nextSlideIndex);
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
            <div className="row" data-aos="fade-right">
                <div className=" d-flex justify-content-center py-5" >
                    <h1>精選住宿</h1>
                </div>
                <div className="slider-container" >
                    <div className="slide2 active" id="slide6">
                        <img src={Bk2} alt="Slide 2" />
                        <div className="text-box">
                            <h1>台北</h1>
                            <h3>板橋凱撒大飯店</h3>
                            <p>板橋凱撒大飯店距離板橋火車站3分鐘步行路程，設有健身中心和享有獨特城市景觀的屋頂室外游泳池。客人可以光顧飯店內的餐廳和酒吧。</p>
                            <a href="#" className="btnSlide">查看更多台北飯店</a>
                        </div>
                    </div>
                    <div className="slide2" id="slide5">
                        <img src={Bk1} alt="Slide 1" />
                        <div className="text-box">
                            <h1>台中</h1>
                            <h3>台中裕元花園酒店</h3>
                            <p>台中裕元花園酒店位於台中市，這家奢華的 5 星級住宿設有室內外游泳池與私人花園，並提供舒緩身心的 SPA 課程。住宿距離台灣高鐵接駁巴士站僅 2 分鐘步行路程。全館提供免費 WiFi。</p>
                            <a href="#" className="btnSlide">查看更多台中飯店</a>
                        </div>
                    </div>
                    
                    <div className="slide2" id="slide7">
                        <img src={Bk3} alt="Slide 3" />
                        <div className="text-box">
                            <h1>台南</h1>
                            <h3>台南晶英酒店</h3>
                            <p>台南晶英酒店位於台南，提供 5 星級的住宿環境，並設有室外游泳池和健身中心。飯店距離台南孔廟 10 分鐘步行路程，距離赤崁樓 15 分鐘步行路程。全館均可使用免費 WiFi。</p>
                            <a href="#" className="btnSlide">查看更多台南飯店</a>
                        </div>
                    </div>
                    <div className="slide2" id="slide8">
                        <img src={Bk4} alt="Slide 3" />
                        <div className="text-box">
                            <h1>高雄</h1>
                            <h3>高雄洲際酒店</h3>
                            <p>高雄洲際酒店提供住宿、餐廳、健身中心和酒吧。這間住宿提供的設施與服務包括禮賓服務、旅遊諮詢台服務以及全館 WiFi（免費）。住宿有 24 小時接待櫃檯、客房服務和外幣兌換服務。</p>
                            <a href="#" className="btnSlide">更多景點</a>
                        </div>
                    </div>  
                    <FontAwesomeIcon icon={faArrowLeft} id="prevBtn"  className="arrow" onClick={this.prevSlide}/>
                    <FontAwesomeIcon icon={faArrowRight} id="nextBtn"  className="arrow" onClick={this.nextSlide}/>
                </div>    
            </div>
        );
    }
}
 
export default Slide2;