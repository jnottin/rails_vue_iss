import Vue from 'vue'
import Router from 'vue-router'
// import App from '../App'
import HelloWorld from '@/components/HelloWorld'
import TestComponent from '@/components/TestComponent'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: HelloWorld
    }
  ]
})
