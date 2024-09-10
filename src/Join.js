import axios from "axios";
import { useState } from "react";
import "./Join.css"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const Join = () => {

    const navigate = useNavigate();
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");

    const join = async() => {

        const formData = new FormData();
        formData.append('userId', id);
        formData.append('userPw', pw);
        
        try{
            const res = await axios.post('http://localhost:7777/join', formData);
            console.log(res);

        }catch(err){
            alert("가입에 실패하였습니다. \n다시 시도해주시기 바랍니다.", err);
        }

    }


    return  <div className="Join">

                <div style={{alignItems: "left"}}>
                    <FontAwesomeIcon icon={faChevronLeft} className="faChevronLeft" fade 
                        onClick={() => navigate('/')}
                    />
                </div>
            
                <div className="JoinForm">
                    <div>
                    ID <br />
                    <input type="text" value={id} onChange={(e) => setId(e.target.value)} /> <br /><br />
                    PW <br />
                    <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} /> <br /><br />
                        <button onClick={join} >가입하기</button>
                    </div>
                </div>
            </div>
}

export default Join;