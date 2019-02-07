<template>
  <div id="app">
    <Header></Header>
    <div class="mapNpassTimesGrid">
      <GoogleMap class="map"></GoogleMap>
      <PassTimes class="passTimes"></PassTimes>
    </div>
    <!-- <router-view/> -->
  </div>
</template>

<script>
import Header from "@/components/Header";
import GoogleMap from "@/components/GoogleMap";
import PassTimes from "@/components/PassTimes";
import "./main.css";

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
  margin: 0;
  padding: 0;

  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #455260;
}
</style>
