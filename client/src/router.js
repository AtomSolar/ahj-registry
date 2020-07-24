import Vue from "vue";
import Router from "vue-router";
import Home from "./views/HomePage.vue";
import About from "./views/AboutPage.vue";
import AHJSearchPage from "./views/AHJSearchPage.vue";
import AHJHistoryPage from "./views/AHJHistoryPage.vue";
import EditPage from "./views/EditPage.vue"
import Login from "./views/Login";
import SignUp from "./views/SignUp";

Vue.use(Router);

export default new Router({
  routes: [
    // {
    //   path: "/",
    //   name: "home",
    //   component: Home
    // },
    { path: "/", redirect: "/ahj-search" },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/register",
      name: "register",
      component: SignUp
    },
    { path: "/activate/([0-9A-Za-z_\-]+/[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})", redirect: "/login" },
    // {
    //   path: "/about",
    //   name: "about",
    //   component: About
    // },
    {
      path: "/ahj-search",
      name: "ahj-search",
      component: AHJSearchPage
    },
    {
      path: "/history",
      name: "history",
      component: AHJHistoryPage
    },
    {
      path: "/edit",
      name: "edit",
      component: EditPage
    }
  ]
});
