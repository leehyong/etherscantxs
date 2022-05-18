<template>
  <div id="app">
    <account-tx />
  </div>
</template>

<script>
import AccountTx from './components/tx';

export default {
  name: 'App',
  components: {
    AccountTx,
  },
  data() {
    return {
      blocklet: window?.blocklet,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
