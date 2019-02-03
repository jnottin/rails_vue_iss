<template>
  <div id="app">
    <h1>App Page</h1>
    <Header></Header>
    <GoogleMap/>
    <PassTimes></PassTimes>
    <router-view/>
  </div>
</template>

<script>
import Header from "@/components/Header";
import GoogleMap from "@/components/GoogleMap";
import PassTimes from "@/components/PassTimes";

export default {
  name: "App",
  components: {
    Header,
    GoogleMap,
    PassTimes
  },
  data() {
    return {};
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
