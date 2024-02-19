import axios from "axios";

// const http = axios.create({
//     baseURL: 'http://localhost:3000/api/',
//     timeout: 6000,
// })
const http = axios.create({
    baseURL: 'https://identityvapi.onrender.com/api/',
    timeout: 6000,
})

http.interceptors.request.use((config)=>{
    const user = localStorage.getItem('user')
    if(user){
        const userData = JSON.parse(user)
        config.headers['authorization'] = `Bearer ${userData.accessToken}`;
    }
    return config
},(err)=>{
    return Promise.reject(err);
})
export default http