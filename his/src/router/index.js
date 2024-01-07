import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import Index from '@/components/Index'
import Register from '@/components/Register'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/sign_up',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/index',
      name: 'Index',
      component: Index,
      children: [
        {
          path: 'register',
          name: 'Register',
          component: Register,
          // meta: {
          //   requireAuth: true
          // }
        }
      ]
    }
  ]
})
