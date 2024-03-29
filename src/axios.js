import axios from "axios";
import router from "@/router";
import Element from "element-ui"
import { Message } from "element-ui";

axios.defaults.baseURL = "http://localhost:8080"

const request = axios.create({
    timeout: 5000,
    // headers: {
    //     'Content-Type': "application/json; charset=utf-8"
    // }
})

request.interceptors.request.use(config => {
    config.headers['Authorization'] = localStorage.getItem("token");
    return config;
})

request.interceptors.response.use(response => {
        let res = response.data;
        console.log("response = ", response);
        console.log("response.data.code = ", response.data.code);
        switch (res.code) {
            case 200:
                Element.Message.success({showClose: true, message : response.data.msg});
                return response
            case 303:
                Element.Message.error({showClose: true, message: res.msg + ", error type: 303 Login failed"});
                return Promise.reject(res.msg);
            case 400:
                Element.Message.error({showClose: true, message: res.msg + ", error type: 400 Request parameter error"});
                return Promise.reject(res.msg);
            case 401:
                Element.Message.error({showClose: true, message: res.msg + ", error type: 401 Not logged in"});
                return Promise.reject(res.msg);
            case 403:
                Element.Message.error({showClose: true, message: res.msg + ", error type: 403 No permission"});
                return Promise.reject(res.msg);
            case 410:
                Element.Message.error({showClose: true, message: res.msg + ", error type: 410 has been deleted"});
                return Promise.reject(res.msg);
            case 423:
                Element.Message.error({showClose: true, message: res.msg + ", error type: 423 has been locked"});
                return Promise.reject(res.msg);
            case 500:
                Element.Message.error({showClose: true, message: res.msg + ", error type: 500 Server error"});
                return Promise.reject(res.msg);
            case 4001:
                Element.Message.error({showClose: true, message: res.msg + ", error type: 4001 exception"});
                return Promise.reject(res.msg);
        }
        // if (response.data.code === 200) {
        //     Element.Message.success({showClose: true, message : response.data.msg});
        //     return response
        // } else {
        //     Element.Message.error(!res.msg ? '系统异常' : res.msg);
        //     return Promise.reject(response.data.msg);
        // }
    }, error => {
        console.log("error = ", error);
        if (error.response.data) {
            error.message = error.response.data.msg;
        }
        if (error.response.status === 401) {
            router.push('/login');
        }
        Element.Message.error(error.message, {duration:3000})
        return Promise.reject(error);
    }
)

export default request
