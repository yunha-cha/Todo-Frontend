import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();

    const [id, setId] = useState("");
    const [pw, setPw] = useState("");

    const [loginId, setLoginId] = useState("");
    const [loginPw, setLoginPw] = useState("");


    const join = async() => {

        const formData = new FormData();
        formData.append('userId', id);
        formData.append('userPw', pw);


        const response = await axios.post('http://localhost:7777/join', formData);

        console.log(response);
    }


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
            alert("로그인 안됨", err);
        }

    }


    return(
        <>
        <div className="Join">

            Id: <input type="text" value={id} onChange={(e) => setId(e.target.value)} /> <br />
            Pw: <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} /> <br />
            <button onClick={join} >가입</button>
        </div>

        <div>

        Id: <input type='text' value={loginId} onChange={(e) => setLoginId(e.target.value)}/> <br />
        Password: <input type='password' value={loginPw} onChange={(e) => setLoginPw(e.target.value)} />
        <button onClick={login}>로그인</button>

        </div>
        </>

    );


}

export default Login;