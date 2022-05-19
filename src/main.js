import Vue from 'vue';
import App from './App.vue';
import 'ant-design-vue/dist/antd.css';
import { Table, Input, Button, Row, Col } from 'ant-design-vue';
Vue.use(Table);
Vue.use(Input);
Vue.use(Button);
Vue.use(Row);
Vue.use(Col);
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
