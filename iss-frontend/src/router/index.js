import Vue from 'vue'
import Router from 'vue-router'
// import App from '../App.vue'
import HelloWorld from '@/components/HelloWorld'
// import GoogleMap from '@/components/GoogleMap'

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
