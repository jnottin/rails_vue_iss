<template>
  <div>
    <h1>Pass Times</h1>
    <h3>Search a location and see when the ISS will be passing over it!</h3>
    <!-- <div v-if="center">{{center}}</div> -->
    <gmap-autocomplete @place_changed="setPlace"></gmap-autocomplete>
    <button @click="placeForPassTimes" class="findPassTimeButton">Find Pass Times</button>
    <hr>
    <div v-if="passTimes">
      <h2>{{currentPlaceSelected}}</h2>
      <div :key="index" v-for="(passTime, index) in passTimes.passes">
        <h3>Pass #{{index + 1}}</h3>
        <h4>Start Time For Pass: {{realTime(passTime.startUTC)}}</h4>
        <h4>End Time For Pass: {{realTime(passTime.endUTC)}}</h4>
      </div>
      <!-- <button @click="saveLocationPassTimes">Save Location And Pass Times</button> -->
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
      currentPlaceSelected: "",
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
      this.currentPlaceSelected = this.currentPlace.formatted_address;
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
