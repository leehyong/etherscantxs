import Vue from 'vue';
import App from './App.vue';
import 'ant-design-vue/dist/antd.css';
import { Table } from 'ant-design-vue';
Vue.use(Table);
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
