<template>
  <div id="app">
   <h1>APP DOT VUE </H1>
    <google-map />
  </div>
</template>

<script>
  import GoogleMap from "./components/GoogleMap";

  export default {
    name: "App",
    components: {
      GoogleMap
    }
  };
</script>

<style>
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>