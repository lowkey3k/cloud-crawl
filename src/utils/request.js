import axios from 'axios';
import { Message } from 'element-ui';

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    baseURL: 'http://localhost:8080/cloud_rbac',
    timeout: 5000,
    withCredentials: true
});

service
    .interceptors
    .request
    .use(
        config => {
            //发送请求之前处理
            return config;
        },
        error => {
            console.log(error);
            //对请求错误做些什么
            return Promise.reject();
        }
    );

service
    .interceptors
    .response
    .use(
        response => {
            const result=response.data;
            if (result.code==='-1') {
                Message.error(result.message);
                Promise.reject();
            }
            //对请求成功做些什么
            if (response.status === 200) {
                return response.data;
            } else {
                Promise.reject();
            }
        },
        //对请求响应失败做些什么
        error => {
            if (error.response==null){
                Message.error("服务异常！");
            } else {
                Message.error(error.response.data.message);
            }
            return Promise.reject();
        }
    );

export default service;
