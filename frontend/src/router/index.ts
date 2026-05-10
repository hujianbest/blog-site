import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue'),
  },
  {
    path: '/articles',
    name: 'articles',
    component: () => import('../views/ArticleList.vue'),
  },
  {
    path: '/articles/:id',
    name: 'article-detail',
    component: () => import('../views/ArticleDetail.vue'),
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import('../views/CategoryArchive.vue'),
  },
  {
    path: '/categories/:id',
    name: 'category-detail',
    component: () => import('../views/CategoryDetail.vue'),
  },
  {
    path: '/tags/:name',
    name: 'tag-detail',
    component: () => import('../views/TagDetail.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
