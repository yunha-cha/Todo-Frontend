import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:7777',
});

api.interceptors.request.use(
    (config) => {
        config.headers.Authorization = localStorage.getItem('token');
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

api.interceptors.response.use(
    (res) => {
        return res;
    },
    (err) =>{

        if(err.status === 403){
            alert('로그인이 만료되었습니다.');
            localStorage.removeItem('token');
            // window.location.href = 'http://localhost:3000/';
        } else {
            alert(err.response.data);
            console.log("에러: ",  err.response.data)
        }
        return Promise.reject(err);
    }
)

export default api;