import axios from 'axios';

axios.defaults.timeout = 15000;  //超时响应
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'; // 配置请求头（推荐）
    //res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'; // 配置请求头
//axios.defaults.baseURL = $core.use('http'); //确认协议和地址
axios.defaults.withCredentials = false;   // axios 默认不发送cookie，需要全局设置true发送cookie

let base = '';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getAnalysor = params => { return axios.get(`${base}/initial`, { params: params }); };