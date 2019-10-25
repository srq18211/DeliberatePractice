import Vue from "vue";
import axios from "axios";
import requestHandle from "./interceptors/request.js"
import responseHandle from "./interceptors/response.js"

import {AXIOS_CONF} from "./conf.js"

const instance = axios.create(AXIOS_CONF);
instance.interceptors["request"].use(requestHandle);
instance.interceptors["response"].use(responseHandle,error => {

});

Vue.prototype.$axios = instance;
if (process.env.NODE_ENV === "development") {
    // require("./mock")
}
export default instance;
