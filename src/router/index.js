import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import VeeValidate from 'vee-validate';

Vue.use(Router);
Vue.use(VeeValidate);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    }
  ]
})
