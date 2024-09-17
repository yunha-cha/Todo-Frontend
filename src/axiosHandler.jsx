import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:7777',
});

api.interceptors.request.use(
    (config) =>{
        config.headers.Authorization = localStorage.getItem('token');
        return config;
    },
);

api.interceptors.response.use(
    (res) => {
        // console.log(res);
        return res;
    },
    (err) =>{
        if(err.status === 403){
            alert('로그인이 만료되었습니다.');
            window.location.href = 'http://localhost:3000/';
        } else {
            alert(err.response.data);
        }
        return Promise.reject(err);
    }
)

export default api;