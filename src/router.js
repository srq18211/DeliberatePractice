import Vue from "vue";
import Router from "vue-router";
import Cookie from "js-cookie"

Vue.use(Router);
const routes = [
    {
        path: "/",
        name: "index",
        component: resolve => require(['@/views/Home/index.vue'], resolve),
    },
    {
        path: "/exercise",
        name: "exercise",
        meta: {user: true},
        component: resolve => require(['@/views/User/Exercise/index.vue'], resolve),
    }, {
        path: "/mgmt",
        name: "mgmt",
        meta: {user: true},
        component: resolve => require(['@/views/User/Mgmt/index.vue'], resolve),
    }
];
routes.forEach(item => item.props = true);
const router = new Router({
    mode: "history",
    routes
});

router.beforeEach((to, from, next) => {
    const user = to.meta["user"];
    const online = Cookie.get("login") === "online";
    if (!user) {//非用户界面
        next();
        return
    }
    if(online){//用户界面，且在线
        next();
        return
    }
    Vue.prototype.$alert("请登录后重试")
});
export default router;
