import axios from 'axios';
import './Login.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [id,setId] = useState('');
  const [pw, setPw] = useState('');
  const [rememberId, setRememberId] = useState(false);

  const login = async (e) => {
    if(e.key === 'Enter' || e.type === 'click'){

        const formData = new FormData();
        formData.append('username', id);
        formData.append('password', pw);

        try{
            const response = await axios.post('http://localhost:7777/login', formData);
            localStorage.setItem('token', response.headers.get("Authorization"));
            alert(id, "님 환영합니다!");
            navigate('/todo');
        }catch(err){
            alert("로그인에 실패하였습니다. \n다시 시도해주시기 바랍니다.", err);
        }

    }
  }

  useEffect(() => {
    if(localStorage.getItem('token')){
        navigate('/todo');
    }
    const savedId = localStorage.getItem('id');
    if (savedId) {
      setId(savedId);
      setRememberId(true);
    }
  }, []);

  useEffect(() => {
    if (rememberId) {
      localStorage.setItem('id', id);
    } else {
      localStorage.removeItem('id');
    }
  }, [rememberId, id]);


  return (
      <section className="login-container">
        <div className="login-input-container">
          <div className="login-input">
            <div className="login-input-text">Login</div>
            <input className="login-id" placeholder="아이디" value={id} onChange={(e)=>setId(e.target.value)}/>
            <input className="login-pw" placeholder="비밀번호" type="password" value={pw} onChange={(e)=>setPw(e.target.value)} onKeyDown={(e)=>login(e)}/>
            <div className='remeber-container'>
              <input type="checkbox" checked={rememberId} onChange={()=>setRememberId(!rememberId)}/>
              <div>아이디 저장하기</div>
            </div>
            <button onClick={(e)=>login(e)} className="login-button">로그인</button>
            <button onClick={()=>navigate('/join')} className="join-button">회원 가입</button>
          </div>
        </div>
      </section>
  );
}

export default Login;