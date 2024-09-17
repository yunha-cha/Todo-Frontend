import axios from 'axios';
import './Join.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward } from "@fortawesome/free-solid-svg-icons";

const Join = () => {
    const nav = useNavigate();
    const [id,setId] = useState('');
    const [pw, setPw] = useState('');
    const [pw2, setPw2] = useState('');
    const [confirmPwState, setConfirmPwState] = useState(false);
    const [confirmPw, setConfirmPw] = useState(false);
  
    const join = async () => {
        if(id && pw && pw2){
            if(confirmPw && confirmPwState){
                const formData = new FormData();
                formData.append('userId', id);
                formData.append('userPw', pw);
                try{
                    const res = await axios.post('http://localhost:7777/join', formData);
                } catch(err){
                    alert(err.response.data);
                    
                }


            } else {
                alert('비밀번호가 일치하지 않습니다.');
            }
        } else {
            alert('모두 입력해주세요.');
        }
    }
    const checkPw = (e,num) => {
        if(num === 1){
            if(pw2 === e.target.value){
                setConfirmPw(true);
            } else {
                setConfirmPw(false);
            }
        } else {
            if(pw === e.target.value){
                setConfirmPw(true);
            } else {
                setConfirmPw(false);
            }
        }
    }

    
    useEffect(()=>{
        if(pw){
            setConfirmPwState(true);
        } else {
            setPw2('');
            setConfirmPw(false);
            setConfirmPwState(false);            
        }
    },[pw])
  
    return(
        <section className="login-container">
        <div className="login-input-container">
          <div className="login-input">
            <div className='faBackword' onClick={()=>nav('/')}>
                <FontAwesomeIcon icon={faBackward}/>
                <div className='back-button'>뒤로가기</div>
            </div>
            <div className="login-input-text" style={{marginTop:30}}>Join</div>
            <div>사용하실 아이디, 비밀번호를 입력해주세요.</div>
            <input className="login-id" placeholder="아이디" value={id} onChange={(e)=>setId(e.target.value)}/>
            <input className="login-pw" placeholder="비밀번호" type="password" value={pw} onChange={(e)=>{setPw(e.target.value); checkPw(e,1);}}/>
            {confirmPwState ? <input className='login-pw' placeholder='비밀번호 확인' type='password' value={pw2} onChange={(e)=>{setPw2(e.target.value);checkPw(e,2)}}/> : <></>}
            {confirmPw ? <div style={{color: 'green',marginTop:10}}>비밀번호가 일치합니다.</div> : <></>}

            
            <button onClick={join} className="join-button">가입하기</button>
          </div>
        </div>
      </section>
    )
}

export default Join;