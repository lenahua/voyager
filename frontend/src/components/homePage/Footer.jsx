import React from 'react'
import { AiFillTwitterCircle } from "react-icons/ai";
import { FaGooglePlus, FaFacebook  } from "react-icons/fa";
import '../../css/footer.css'
// import Logo from '../../img/Logo.svg'

const Footer = () => {
  return (
    <div className='footerContain'>
        <div className='footerTop'>
            <div className='footerSection'>
                <h3>Voyager</h3>
                <p>您的旅行好夥伴</p>
            </div>
            <div className='footerSection'>
                <h3>目的地</h3>
                <p>探索城市</p>
                <p>線上訂房</p>
            </div>
            <div className='footerSection'>
                <h3>加入我們</h3>
                <p>會員註冊</p>
                <p>會員登入</p>
            </div>
            <div className='footerSection'>
                <h3>關於我們</h3>
                <p>常見問題</p>
                <p>隱私權政策</p>
            </div>
        </div>
        <div className='footerLine'></div>
        <div className='footerBottom'>
            <div className='footerLogo'>
              <FaFacebook />
              <AiFillTwitterCircle  className='twitterLogo'/>
              <FaGooglePlus />
            </div>
            <p>本網站內容由 © 2024 voyager 工程師 版權所有</p>
        </div>
    </div>
  )
}

export default Footer
