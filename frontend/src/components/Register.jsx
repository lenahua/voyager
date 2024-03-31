import React, { useState } from 'react'
import { CiUser, CiMail, CiLock } from "react-icons/ci";
import "../css/login.css"
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import train from '../img/train.png'

const Register = () => {

  const [account, setAccount] = useState('');
  const [email, setEmail]= useState('');
  const [password, setPassword] = useState('')

  const history = useHistory();

  function handleRegister(event){
    event.preventDefault();
    axios.post("http://localhost:8000/register",
    {account: account,
    password: password,
    email: email})
    .then(res=>{
        console.log(res.data);
        // 判斷是否跟後端設定的狀態一樣
        if(res.data.Status === "Success"){
            alert("註冊成功");
            history.push('/login');
        }else{
            alert("註冊失敗，請重新填寫表單。")
        }
        
    })
    .catch(err=>{
        console.log(err)
    })
  }
  return (
    <>
    <div className='Logincontainer regiBg'>
      <div className='header'>
        <div className='text'>註冊</div>
        <div className='underline'></div>
      </div>
      <form className='inputs' onSubmit={handleRegister}>
        
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
        <div className='input'>
          <CiMail className='icon'/>
          <input type='email' placeholder='請輸入電子信箱'
                  value={email} onChange={(e)=> setEmail(e.target.value)}/>
        </div>
        <div className='direction'>已經有帳號了？
        <Link to={'/login'}><span>現在登入</span></Link></div>

        
        <div className='submit-container'>
            <button className='submit'>註冊</button>
        </div>
      </form>
    </div>
    <img src={train} alt='' className='trainLogoRe'/>
    </>
  )
}

export default Register
