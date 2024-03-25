import React, { useEffect, useState } from 'react'
import { CiUser, CiLock } from "react-icons/ci";
import axios from 'axios';
import "../css/login.css"
import { Link, useHistory } from 'react-router-dom';

const Login = ({loginStatus}) => {
  // 取得輸入的使用者資料，判斷輸入的資料是否吻合資料庫的資料，吻合跳轉至首頁
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');

  axios.defaults.withCredentials = true

  const history = useHistory();

  const handleSubmit=(event)=>{
    event.preventDefault();
    // console.log("okkk")
    axios.post('http://localhost:8000/login',{
      account: account,
      password: password
      })
      .then(res=>{
        if(res.data.Status === "Success"){
          alert("登入成功");
          history.push('/');
          window.location.reload('/')
        }else{
            alert(res.data.Error)
        }       
      })
      .catch(err=>console.log(err))
    
  }

  
  

  return (
    <div className='Logincontainer'>
      <div className='header'>
        <div className='text'>登入</div>
        <div className='underline'></div>
      </div>
      <form className='inputs' onSubmit={handleSubmit}>
        <div className='input'>
          <CiUser className='icon'/>
          <input type='text' placeholder='使用者帳號'
                  value={account} onChange={(e)=> setAccount(e.target.value)}/>
        </div>
        <div className='input'>
          <CiLock className='icon'/>
          <input type='password' placeholder='請輸入密碼'
                  value={password} onChange={(e)=> setPassword(e.target.value)}/>
        </div>
        <div className='direction'>還沒有帳號?
        <Link to={'/register'}><span>現在註冊</span></Link></div>

      
        <div className='submit-container'>
          <button className='submit'>登入</button>
        </div>
      </form>
      <div>{loginStatus}</div>
    </div>
  )
}

export default Login
