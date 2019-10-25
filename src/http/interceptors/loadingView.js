import Vue from "vue"
import instance from "../index.js"
import {REQUEST_URLS} from "../requestTypes"
var loading;
instance.interceptors["request"].use(req => {
    console.log(req)
    if(!REQUEST_URLS[req.url]){
        throw new Error("请配置请求的loading属性"+req.url)
    }
    if(REQUEST_URLS[req.url].loading){
        loading = Vue.prototype.$loading({
            text: "loading..."
        });
    }

    return req
},function (error) {
    console.log(error)
    return Promise.reject(error)
})
instance.interceptors["response"].use(function(res){
    console.log(res)
    // const {url,baseURL}=res.config;
    // let reqstUrl = url.replace(baseURL+'/',"");
    if(loading){
        loading.close();
    }

    loading = null
    return res
},function (error) {
    return Promise.reject(error)
});