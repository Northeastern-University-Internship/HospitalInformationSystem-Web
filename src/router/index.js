import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import Index from '@/components/Index'
import Registration from '@/components/Registration/Registration'
import Refund from '@/components/Registration/Refund'
import Withdraw from '@/components/Registration/Withdraw'
import ExpenseRecordQuery from '@/components/Registration/ExpenseRecordQuery'
import WithdrawCharges from '@/components/Registration/WithdrawCharges'

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
          path: 'registration',
          name: 'Registration',
          component: Registration,
          // meta: {
          //   requireAuth: true
          // }
        },
        {
          path: 'withdraw',
          name: 'Withdraw',
          component: Withdraw,
        },
        {
          path: 'charges',
          name: 'WithdrawCharges',
          component: WithdrawCharges,
        },
        {
          path: 'refund',
          name: 'Refund',
          component: Refund,
        },{
          path: 'expense',
          name: 'ExpenseRecordQuery',
          component: ExpenseRecordQuery,
        }
      ]
    }
  ]
})
