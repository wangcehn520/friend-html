// 在 node.js 用GET请求获取远程图片


import axios from "axios";


const myAxios=axios.create({
    baseURL:"http://localhost:8101/api",
    withCredentials:true,
})
// 添加请求拦截器
myAxios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    console.log("ok")
    // if (getToken()){
    //     console.log(getToken())
    //     config.headers['token'] = getToken();
    // // }else {
    // //     if (config.url != '/user/login' && config.url !='/index' ){
    // //         console.log("222")
    // //         window.location.href = '/user/login'
    // //         return false;
    // //     }
    // }
    return config;

}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
myAxios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    console.log("success")

    // 对响应数据做点什么
    // if (response.data.code === 0 && response.data.token !== undefined){
    //     setToken(response.data.token)
    // }
    return response.data;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default myAxios;