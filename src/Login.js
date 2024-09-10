import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {

    const navigate = useNavigate();

    const [loginId, setLoginId] = useState("");
    const [loginPw, setLoginPw] = useState("");

    const login = async() => {

        const formData = new FormData();
        formData.append('username', loginId);
        formData.append('password', loginPw);

        try{
            const response = await axios.post('http://localhost:7777/login', formData);
            console.log(response);

            localStorage.setItem('token', response.headers.get("Authorization"));
            navigate('/todo');
        }catch(err){
            alert("로그인에 실패하였습니다. \n다시 시도해주시기 바랍니다.", err);
        }
    }


    return(
        <>
        <div className="Login">
            <div style={{marginTop: "150px"}}>
                ID <br />
                <input type='text' value={loginId} onChange={(e) => setLoginId(e.target.value)}/> <br /><br />
                PW <br />
                <input type='password' value={loginPw} onChange={(e) => setLoginPw(e.target.value)} /> <br /><br />
                <button onClick={() => login()}>로그인</button><br />
                <button onClick={() => navigate('/join')}>회원가입</button>
            </div>
        </div>
        </>
    );

}

export default Login;