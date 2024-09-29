import { useNavigate } from "react-router-dom";
import '../join/Join.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import api from "../../axiosHandler";

const FindPassword = () => {

    const nav = useNavigate();
    const [id,setId] = useState('');
    const [email, setEmail] = useState('');
    const [confirm, setConfirm] = useState(false);

    const [securityNumber, setSecurityNumber] = useState('');

    const findAccount = () => {

        const res = api.get(`/pw/secNumber?id=${id}&email=${email}`);
        console.log(res?.data);

        // 아이디와 이메일 모두 입력시 
        // if(id && email){
        //     setConfirm(true);
        // } else {
        //     alert("아이디와 이메일을 모두 입력해주세요.");
        // }

        // 인증번호 발송

        
    }

    const confirmSecurityNumber = () => {
        nav('/find-account/password-change');
    }


    return <div className="FindPassword">
         <section className="login-container">
        <div className="login-input-container">
          <div className="login-input">
            <div className='faBackword' onClick={()=>nav(-1)}>
                <FontAwesomeIcon icon={faBackward}/>
                <div className='back-button'>뒤로가기</div>
            </div>
            <div className="login-input-text" style={{marginTop:30}}>비밀번호 찾기</div>
            <div>아이디, 이메일을 입력해주세요.</div>
            <input className="login-id" placeholder="아이디" value={id} onChange={(e)=>setId(e.target.value)}/>
            <input className="login-id" placeholder="이메일" type="email" value={email} onChange={(e)=>{setEmail(e.target.value);}}/>
            {
                confirm ?
                <>
                    <input value={securityNumber} onChange={(e) => setSecurityNumber(e.target.value)} className="login-id" placeholder="인증번호를 입력해주세요." />
                    <button onClick={confirmSecurityNumber} className="login-button">인증번호 확인</button>
                </> :
                <>
                    <button onClick={findAccount} className="login-button">인증번호 전송</button>
                </>
            }
          </div>
        </div>
      </section>


    </div>



}

export default FindPassword;