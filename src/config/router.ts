
import {createWebHistory, createRouter} from "vue-router";


const routes = [
    {
        path: '/',
        title: '主页',
        component: () => import("../pages/Index.vue"),
    },
    {
        path: '/friend',
        title: '好友',
        component: () => import("../pages/Friends.vue"),
    },
    {
        path: '/messages',
        title: '信息',
        component: () => import("../pages/Message.vue"),

    },
    {
        path: '/user',
        title: '用户',
        component: () => import("../pages/User.vue")
    },
    {
        path: '/search',
        title: '查找',
        component: () => import("../pages/SearchPage.vue")
    },
    {
        path: '/users/edit',
        title: '用户修改',
        component: () => import("../pages/UserEditPage.vue")
    },
    {
        path: '/user/login',
        name: 'LoginPage',
        title: '登录',
        component: () => import("../pages/LoginPage.vue")
    },
    {
        path: '/users/editAvatarUrl',
        title: '修改头像',
        component: () => import("../pages/UserEditAvatarUrlPage.vue")
    },
    {
        path: '/users/friendSonPages',
        title: '主页',
        component: () => import("../pages/FriendSonPages.vue")
    },
    {
        path: '/posts',
        title: '发布文章',
        component: () => import("../pages/AddPostsPage.vue")
    },
    {
        path: '/users/register',
        title: '注册',
        component: () => import("../pages/RegisterPage.vue")
    },
    {
        path: '/users/searchOthers',
        title: '他人主页',
        component: () => import("../pages/SearchOthers.vue")
    },
    {
        path: '/chat/privateChat',
        title: '私聊',
        component: () => import("../pages/PrivateChatPage.vue")
    },
    {
        path: '/posts/postsDetails',
        title: '文章详情',
        component: () => import("../pages/PostsDetailsPage.vue")
    },
    {
        path: '/comment',
        component: () => import("../pages/CommentPage.vue")
    },
    {
        path: '/posts/dynamicPage',
        title: '好友动态',
        component: () => import("../pages/DynamicPage.vue")
    },
];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
