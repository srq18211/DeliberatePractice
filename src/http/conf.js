const env = process.env.NODE_ENV;
const AXIOS_CONF = {
    baseURL: env === "development"
        ? "/localapi"
        : "http://xinzejy.cn:3000",
    // baseURL: "/localapi",
    timeout: 5000,
    // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
    transformResponse: [function (data) {
        data=data.replace(/&lt;/g,"<")
        data=data.replace(/&gt;/g,">")
        return JSON.parse(data);
    }],
    //   headers: { "X-Custom-Header": "foobar" }
}
export {
    AXIOS_CONF
}