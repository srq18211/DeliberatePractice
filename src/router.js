import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
const routes = [
    {
        path:"/",
        name:"index",
        component: resolve => require(['@/views/User/Home/index.vue'], resolve),
    },
    {
        path: "/exercise",
        name: "exercise",
        component: resolve => require(['@/views/User/Exercise/index.vue'], resolve),
    },{
        path: "/mgmt",
        name: "mgmt",
        component: resolve => require(['@/views/User/Mgmt/index.vue'], resolve),
    }
];
routes.forEach(item => item.props = true);
const router = new Router({
    mode: "history",
    routes
});

router.beforeEach((to, from, next) => {
    next();
});
export default router;
