<template>
  <div>
    <div>
      <button @click="getISSCurrentLocation">See ISS Now</button>
      <h2>Search and add a pin</h2>
      <label>
        <gmap-autocomplete @place_changed="setPlace"></gmap-autocomplete>
        <button @click="addMarker">Add</button>
      </label>
      <br>
      <h2>Where was the iss x hours ago?</h2>
      <form @submit.prevent="IssFromThenToNow">
        <date-picker
          v-model="selectedIssDate"
          lang="en"
          type="datetime"
          format="[on] MM-DD-YYYY [at] HH:mm"
        ></date-picker>
        <!-- <datepicker v-model="selectedIssDate"></datepicker> -->
        <input type="submit" value="Submit">
      </form>
    </div>
    <br>
    <gmap-map :center="center" :zoom="3" style="width:100%;  height: 400px;">
      <!-- <gmap-custom-marker :center="center">
        <img src="http://lorempixel.com/800/600/nature/">
      </gmap-custom-marker>-->
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        @click="center=m.position"
      ></gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
import { eventBus } from "../main";
import axios from "axios";
import GmapCustomMarker from "vue2-gmap-custom-marker";
// import Datepicker from "vuejs-datepicker";
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
      issCurrentMarker: "",
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
      console.log(Date(dateNow));
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
            lng: parseFloat(response.data[0]["latitude"])
          };
          this.markIsCurrentLocation();
          eventBus.$emit("send-center", this.center);
        });
      // this.geolocate();
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
            lng: parseFloat(response.data[0]["latitude"])
          };
          this.markIssLocation();
        });
    },
    IssFromThenToNow() {
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
    markIsCurrentLocation() {
      if (this.center) {
        const marker = {
          lat: this.center.lat,
          lng: this.center.lng
        };
        this.markers.push({ position: marker });
        // NEED TO HAVE IT REFRESH AND DELETE OLD MARKER
        // this.issCurrentMarker = marker;
        this.center = marker;
      }
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
