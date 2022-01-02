<template>
  <h1>Stock Tracker</h1>
  <stock-consumer />
</template>

<script>
import StockConsumer from "./components/StockConsumer.vue";
export default {
  name: "App",
  components: {
    StockConsumer,
  },
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #167be0;
  margin-top: 60px;
}
</style>
