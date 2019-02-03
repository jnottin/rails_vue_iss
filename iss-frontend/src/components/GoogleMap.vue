<template>
  <div>
    <div>
      <form @submit.prevent="getOtherSatelitesLocation">
        <select v-model="selectedOtherSat">
          <option disabled value>See Different Industry Satelites!</option>
          <option value="18">Amateur Radio</option>
          <option value="8">Disaster Monitoring</option>
          <option value="6">Earth Resources</option>
          <option value="29">Education</option>
          <option value="28">Engineering</option>
          <option value="50">Global Positioning System (GPS) Constellation</option>
          <option value="20">Global Positioning System (GPS) Operational</option>
          <option value="30">Military</option>
          <option value="24">Navy Navigation Satellite System</option>
          <option value="31">Radar Calibration</option>
          <option value="25">Russian LEO Navigation</option>
          <option value="7">Search & Rescue</option>
          <option value="26">Space & Earth Science</option>
          <option value="34">TV</option>
          <option value="3">Weather</option>
          <option value="33">XM & Sirius</option>
          <option value="CLEAR">CLEAR SATELITES FROM MAP</option>
        </select>
        <input type="submit" value="Submit">
      </form>
      <div v-if="otherSatelitesMarkers">{{otherSatelitesMarkers.length}} Satelites</div>
      <!-- <div>{{OtherSatelitesInfo}}</div> -->
      <button @click="getISSCurrentLocation">See ISS Now</button>
      <button @click="geolocate">See Where You Are Now</button>
      <h2>Search and add a pin</h2>
      <label>
        <gmap-autocomplete @place_changed="setPlace"></gmap-autocomplete>
        <button @click="searchLocationByInput">Search Area By Location</button>
      </label>
      <br>
      <h2>Has the ISS been messing around on us 🧐? Enter in a date and time below to check where it was and even where it's going!</h2>
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
    <gmap-map :center="center" :zoom="mapZoom" style="width:100%;  height: 400px;">
      <gmap-marker :key="index" v-for="(m, index) in otherSatelitesMarkers" :position="m.position"></gmap-marker>
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
      center: { lat: 45.508, lng: -73.587 },
      markers: [],
      mapZoom: 3,
      issCurrentMarker: { lat: "", lng: "" },
      places: [],
      currentPlace: null,
      issCurrentInfo: "",
      issSelectedDateInfo: "",
      selectedIssDate: "",
      selectedOtherSat: "",
      otherSatelitesInfo: "",
      otherSatelitesMarkers: ""
    };
  },

  mounted() {
    this.getISSCurrentLocation();
    // eventBus.$emit("send-timestamp-conversion", this.realTime);
  },

  methods: {
    // compareTwoDates(d1, d2) {},
    getOtherSatelitesLocation() {
      this.otherSatelitesInfo = "";
      this.otherSatelitesMarkers = "";
      if (this.selectedOtherSat != "CLEAR") {
        axios
          .get(
            "https://www.n2yo.com/rest/v1/satellite/above/41.702/-6.014/0/180/" +
              this.selectedOtherSat +
              "/&apiKey=SWYY5P-THKE7U-HY6XQG-3Y65"
          )
          .then(response => {
            this.otherSatelitesInfo = response.data;
            var satellitesArray = this.otherSatelitesInfo.above;
            var otherSatelitesMarkers1 = [];
            satellitesArray.forEach(function(satellite) {
              const marker = {
                lat: satellite.satlat,
                lng: satellite.satlng
              };
              otherSatelitesMarkers1.push({ position: marker });
            });
            this.otherSatelitesMarkers = otherSatelitesMarkers1;
            console.log(this.otherSatelitesMarkers);
          });
      }
    },
    getISSCurrentLocation() {
      axios
        .get(" https://api.wheretheiss.at/v1/satellites/25544")
        .then(response => {
          var formattedTime = this.realTime(response.data.timestamp);
          response.data.formattedTime = formattedTime;
          this.issCurrentInfo = response.data;
          this.center = {
            lat: parseFloat(response.data["latitude"]),
            lng: parseFloat(response.data["longitude"])
          };
          this.issCurrentMarker = {
            lat: parseFloat(response.data["latitude"]),
            lng: parseFloat(response.data["longitude"])
          };
          eventBus.$emit("send-center", this.center);
          // eventBus.$emit("send-markers", this.markers, this.issCurrentInfo);
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
          this.mapZoom = 3;
          eventBus.$emit("send-center", this.center);
        });
    },
    IssAtSpecificTime() {
      var selectedIssDateTimestamp = Math.round(
        this.selectedIssDate.getTime() / 1000
      );
      this.findISSByTimeStamp(selectedIssDateTimestamp);
      this.mapZoom = 3;

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
    searchLocationByInput() {
      if (this.currentPlace) {
        this.center = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        };
        this.mapZoom = 10;
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
        this.mapZoom = 10;
      });
    }
  }
};
</script>
