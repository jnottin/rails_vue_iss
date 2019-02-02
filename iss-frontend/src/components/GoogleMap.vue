<template>
  <div>
    <div>
      <button @click="getISSCurrentLocation">See ISS Now</button>
      <!-- <button @click="geolocate">See Where You Are Now</button> -->
      <h2>Search and add a pin</h2>
      <label>
        <gmap-autocomplete @place_changed="setPlace"></gmap-autocomplete>
        <button @click="addMarker">Add</button>
      </label>
      <br>
      <h2>Where was the iss x hours ago?</h2>
      <form @submit.prevent="IssAtSpecificTime">
        <date-picker
          v-model="selectedIssDate"
          lang="en"
          type="datetime"
          format="[on] MM-DD-YYYY [at] HH:mm"
        ></date-picker>
        <input type="submit" value="Submit">
      </form>
    </div>
    <br>
    <gmap-map :center="center" :zoom="3" style="width:100%;  height: 400px;">
      <gmap-marker :key="index" v-for="(m, index) in markers" :position="m.position"></gmap-marker>
      <!-- <gmap-custom-marker :key="index" v-for="(m, index) in markers" :position="m.position">
        <img src="https://i.imgur.com/mgCEm44.jpg" style="width: 40px; height: 40px;">
      </gmap-custom-marker>-->
      <gmap-custom-marker :marker="issCurrentMarker" @click.native="someFunction">
        <img src="https://i.imgur.com/QyRaUXD.png" style="width: 40px; height: 40px;">
      </gmap-custom-marker>
    </gmap-map>
  </div>
</template>

<script>
import { eventBus } from "../main";
import axios from "axios";
import GmapCustomMarker from "vue2-gmap-custom-marker";
import DatePicker from "vue2-datepicker";

export default {
  name: "GoogleMap",
  components: {
    "gmap-custom-marker": GmapCustomMarker,
    DatePicker
  },
  data() {
    return {
      // default to montreal to keep it simple
      // change this to whatever makes sense
      center: { lat: 45.508, lng: -73.587 },
      markers: [],
      issCurrentMarker: { lat: "", lng: "" },
      places: [],
      currentPlace: null,
      issInfo: "",
      selectedIssDate: ""
    };
  },

  mounted() {
    this.getISSCurrentLocation();
  },

  methods: {
    // compareTwoDates(d1, d2) {},
    getISSCurrentLocation() {
      var dateNow = Date.now();
      axios
        .get(
          " https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps=" +
            dateNow +
            "&units=miles"
        )
        .then(response => {
          var formattedTime = this.realTime(response.data.timestamp);
          response.data.formattedTime = formattedTime;
          this.issInfo = response.data;
          this.center = {
            lat: parseFloat(response.data[0]["latitude"]),
            lng: parseFloat(response.data[0]["longitude"])
          };
          this.issCurrentMarker = {
            lat: parseFloat(response.data[0]["latitude"]),
            lng: parseFloat(response.data[0]["longitude"])
          };
          eventBus.$emit("send-center", this.center);
        });
    },
    findISSByTimeStamp(timestamp) {
      axios
        .get(
          " https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps=" +
            timestamp +
            "&units=miles"
        )
        .then(response => {
          var pastIssData = response.data;
          console.log(pastIssData);
          this.center = {
            lat: parseFloat(response.data[0]["latitude"]),
            lng: parseFloat(response.data[0]["longitude"])
          };
          this.markIssLocation();
        });
    },
    IssAtSpecificTime() {
      console.log(this.selectedIssDate);
      var selectedIssDateTimestamp = Math.round(
        this.selectedIssDate.getTime() / 1000
      );
      console.log(selectedIssDateTimestamp);
      this.findISSByTimeStamp(selectedIssDateTimestamp);

      this.selectedIssDate = null;
    },
    setPlace(place) {
      this.currentPlace = place;
    },
    markIssLocation() {
      if (this.center) {
        const marker = {
          lat: this.center.lat,
          lng: this.center.lng
        };
        this.markers.push({ position: marker });
        this.center = marker;
      }
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        };
        this.markers.push({ position: marker });
        this.places.push(this.currentPlace);
        this.center = marker;
        this.currentPlace = null;
      }
    },
    realTime: function(timestamp) {
      var date = new Date(timestamp * 1000);
      var hours = date.getHours();
      var minutes = "0" + date.getMinutes();
      var seconds = "0" + date.getSeconds();
      // Will display time in 10:30:23 format
      var formattedTime =
        hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
      return formattedTime;
    },

    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.addMarker();
      });
    }
  }
};
</script>
