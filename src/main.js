import Vue from 'vue';
import App from './App.vue';
import 'ant-design-vue/dist/antd.css';
import { Table, Input, Button } from 'ant-design-vue';
Vue.use(Table);
Vue.use(Input);
Vue.use(Button);
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
