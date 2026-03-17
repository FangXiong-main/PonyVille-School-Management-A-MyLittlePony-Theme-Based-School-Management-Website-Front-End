import { createRouter, createWebHistory } from 'vue-router'

import LayoutView  from '@/views/layout/index.vue';
import IndexView from '@/views/index/index.vue';
import ClazzView from '@/views/clazz/index.vue';
import StudentView from '@/views/stu/index.vue';
import EmpView from '@/views/emp/index.vue';
import LoginView from '@/views/login/index.vue';
import DeptView from '@/views/dept/index.vue';
import EmpReport from '@/views/report/emp/index.vue';
import StuReport from '@/views/report/stu/index.vue';
import LogView from '@/views/log/index.vue';
import JobView from '@/views/job/index.vue';
import SubView from '@/views/subject/index.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    //嵌套路由,用于动态展示菜单
    {
      path:'/',
      name:'',
      redirect:'/index',
      component:LayoutView,
      children:[
        {
          path:'index',
          name:'index',
          component:IndexView
        },
        {
          path:'clazz',
          name:'clazz',
          component:ClazzView
        },
        {
          path:'stu',
          name:'stu',
          component:StudentView
        },
        {
          path:'emp',
          name:'emp',
          component:EmpView
        },
        {
          path:'dept',
          name:'dept',
          component:DeptView
        },
        {
          path:'empReport',
          name:'empReport',
          component:EmpReport
        },
        {
          path:'stuReport',
          name:'stuReport',
          component:StuReport
        },
        {
          path:'log',
          name:'log',
          component:LogView
        },
        {
          path:'jobs',
          name:'jobs',
          component:JobView
        },
        {
          path:'subjects',
          name:'subjects',
          component:SubView
        }
      ]
    },
    {
      path:'/login',
      name:'login',
      component:LoginView
    }
  ]
})

export default router