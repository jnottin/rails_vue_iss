<template>
  <div>
    <h1>Pass Times</h1>
    <div v-if="center">{{center}}</div>
    <gmap-autocomplete @place_changed="setPlace"></gmap-autocomplete>
    <button @click="placeForPassTimes">Search Area By Location</button>

    <div v-if="passTimes">
      <div :key="index" v-for="(passTime, index) in passTimes.passes">
        <h1>Pass #{{index}}</h1>
        <h2>Start Time For Pass: {{realTime(passTime.startUTC)}}</h2>
        <h2>End Time For Pass: {{realTime(passTime.endUTC)}}</h2>
      </div>
      <button @click="saveLocationPassTimes">Save Location And Pass Times</button>
    </div>
  </div>
</template>

<script>
import { eventBus } from "../main";
import axios from "axios";
import cors from "cors";

export default {
  name: "PassTimes",
  data() {
    return {
      center: "",
      mapZoom: "",
      currentPlace: "",
      passTimes: ""
    };
  },
  created() {
    eventBus.$on("send-center", center => {
      this.center = center;
    });
  },
  methods: {
    saveLocationPassTimes() {
      console.log(this.currentPlace);
      axios
        .post("http://localhost:3000/addTimePass", {
          name: this.currentPlace.formatted_address,
          lat: this.currentPlace.coordinates.lat,
          lng: this.currentPlace.coordinates.lng,
          passes: this.passTimes.passes
        })
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.log(err);
        });
    },
    setPlace(place) {
      this.currentPlace = place;
    },
    placeForPassTimes(place) {
      console.log(this.currentPlace.formatted_address);
      this.currentPlace.coordinates = {
        lat: this.currentPlace.geometry.location.lat(),
        lng: this.currentPlace.geometry.location.lng()
      };
      var url =
        "https://www.n2yo.com/rest/v1/satellite/radiopasses/25544/" +
        this.currentPlace.coordinates.lat +
        "/" +
        this.currentPlace.coordinates.lng +
        "/0/2/40/&apiKey=SWYY5P-THKE7U-HY6XQG-3Y65";

      axios.get(url).then(response => {
        this.passTimes = response.data;
        console.log(this.passTimes);
      });

      // this.currentPlace = null;
    },
    realTime: function(timestamp) {
      var date = new Date(timestamp * 1000);
      // var formattedDate = date.splice(date.indexOf("T"), 0, " ");
      // var formattedDate = date.splice(10, 0, " ");

      var formattedDate1 = {
        date: "",
        time: ""
      };
      return date;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
