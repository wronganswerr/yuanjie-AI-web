import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/MainPageView.vue"),
  },
  {
    path: "/internet_traffic",
    name: "internet_traffic",
    component: () => import("../views/InternetTrafficView.vue"),
  },
  {
    path: "/sale",
    name: "sale",
    component: () => import("../views/SaleView.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
