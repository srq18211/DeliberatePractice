import Vue from 'vue'
export default (response)=>{
    const {code }=response.data;
    if(code===-1){
        const {message }=response.data;
        Vue.prototype.$message(message);
    }
    return response
}