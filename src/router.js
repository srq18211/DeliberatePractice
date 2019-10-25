import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
const routes = [
    {
        path: "/knowledge",
        name: "knowledge",
        component: resolve => require(['@/views/Knowledge'], resolve),
    }, {
        path: "/knowledge/exercise/:id",
        name: "exercise",
        component: resolve => require(['@/views/Knowledge/exercise'], resolve),
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