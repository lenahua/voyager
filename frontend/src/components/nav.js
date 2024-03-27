import { FaBars }from "react-icons/fa"
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { useRef, useState } from "react"; 
//創建一個navRef

import {Link, useLocation} from 'react-router-dom';
import axios from 'axios';
import Logo from '../img/Logo.svg'


import "../css/nav.css";

function DropDown ({auth, message, account, handleDrop}){
    // console.log(auth)
    const handleLogout = (handleDrop)=>{
        console.log(auth)
        axios.get('http://localhost:8000/logout')
        .then(res=>{
          window.location.reload('/')
        // navigate("/")
        // res.render('/')
        console.log(res)
        })
        .catch(err=>{
        console.log(err)
        })
    }
    return (
        <div className="dropdownContainer">
            
            {
                auth ?
                <ul>
                    <Link to="/member" style={{ textDecoration: 'none' }} onClick={handleDrop}><li>會員中心</li></Link>
                    <li className="logoutbtn" onClick={()=>handleLogout(handleDrop)}>登出</li>
                </ul>
                :
                <ul>
                    <Link to="/login" style={{ textDecoration: 'none' }} onClick={handleDrop}><li>登入</li></Link>
                    <Link to="/register" style={{ textDecoration: 'none' }} onClick={handleDrop}><li>註冊</li></Link>
                </ul>
            }
            
            {/* <div className="memberContainer">
                <Link to="/member">會員中心</Link>
                <CiLogout className="memberIcon"/><button onClick={handleLogout}>登出</button>
            </div> */}
        </div>

    )
}


function Nav({auth, message, account}){
    const navRef = useRef();
    const location = useLocation();
    //在點擊按鈕時顯示或隱藏nav
    const showNavbar = ()=>{
        navRef.current.classList.toggle("responsive_nav")
        //找到nav的屬性，增加或移除class--responsive_nav(在navRef上)
    }
    const [openDrop, setOpenDrop] = useState(false);
    const handleDrop = ()=>{
        setOpenDrop(false)
    }
    // 判斷是否為歡迎頁面，如果是則不顯示 Nav
    if (location.pathname === '/welcome') {
        return null;
    }
    return(
        <>
            <header>
                <a href="/"><img src={Logo} className="logoNav" alt=""/></a>
                <nav ref={navRef}>
                    <Link to="/viewPage">景點</Link>
                    <Link to="/hotelList">住宿</Link>
                    <button className="nav-btn nav-close-btn" onClick={showNavbar}>
                        <IoIosCloseCircleOutline />
                    </button>
                    
                </nav>
                <div className="nav-small">
                    <div className="user" >
                        <IoPersonCircleOutline  onClick={()=>setOpenDrop((prev)=>!prev)}/>
                        {
                            auth ? <span onClick={()=>setOpenDrop((prev)=>!prev)}>Hello {account}!</span> : <div></div>
                        }
                        
                    </div>
                    
                    <button className="nav-btn" onClick={showNavbar} >
                        <FaBars/>
                    </button>
                </div>  
            </header>
            {openDrop && <DropDown auth={auth} message={message} account={account} handleDrop={handleDrop}/>}
                
        
            
        </>
    );
}
export default Nav;

