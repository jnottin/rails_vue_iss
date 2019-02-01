/* eslint no-console: 0 */
// Run this example by adding <%= javascript_pack_tag 'hello_vue' %> (and
// <%= stylesheet_pack_tag 'hello_vue' %> if you have styles in your component)
// to the head of your layout file,
// like app/views/layouts/application.html.erb.
// All it does is render <div>Hello Vue</div> at the bottom of the page.

import Vue from 'vue/dist/vue.esm'
import axios from 'axios'
import * as VueGoogleMaps from 'vue2-google-maps'
// import response from 'response'

document.addEventListener('DOMContentLoaded', () => {
  Vue.component('navbar', {
    template: `
      <div class="navbar">
      <ul class="navbar-stuff">
    <li class="nav-item"><img class="logo nav-item" :src='image'
            alt="nasa-logo"></li>
    <li class="nav-item">
        <a class="app-title-link" href="/">
            <h1 class="app-title">Find The International Space Station!</h1>
        </a>
    </li>
    <div v-for="item in space_o_station" :key="space_o_station.id">
    <li @mouseover="updateSiteIcon(item.image)">{{item.name}}</li>
    </div>
  </ul>
        
        </div>
     `,
    data() {
      return {
        image: 'https://i.imgur.com/QyRaUXD.png',
        space_o_station: [{
          id: 1,
          name: 'space',
          image: 'https://i.imgur.com/aUHu1yB.jpg',
        }, {
          id: 2,
          name: 'station',
          image: 'https://i.imgur.com/QyRaUXD.png',
        }]
      }
    },
    methods: {
      updateSiteIcon(iconImage) {
        this.image = iconImage
      },
    },
    computed: {

    }
  })
  Vue.use(VueGoogleMaps, {
    load: {
      key: "AIzaSyC2KMba-R4OMF2ROiKGpYGiXBpjyWFNV-4",
      libraries: "places" //necessary for places input
    }
  });

  Vue.component('iss-info', {
    props: {
      info: {
        type: Object,
        required: true
      }
    },
    template: `
      <div>
      <h2 v-if="info.iss_position.latitude < 0">
      ISS is in the Southern Hemisphere</h2>
      <h2 v-else>ISS is in the Northern Hemisphere</h2>
      <ul>
          <li>Timestamp: {{info.timestamp}}</li>
          <li>Message: {{info.message}}</li>
          <li>Lat: {{info.iss_position.latitude}}</li>
          <li>Long: {{info.iss_position.longitude}}</li>
      </ul>
        </div>
     `,
    data() {
      return {

      }
    },
    methods: {

    },
    computed: {

    }
  })

  Vue.component('search-iss-time', {
    template: `
    <div>
      <form class="review-form" @submit.prevent="onSubmit">
      <p>
        <label for="userTime">Give a time and see where the ISS was!</label>
        <input id="userTime" v-model="userTime" placeholder="00:00:00">
      </p>
      <p>
      <input type="submit" value="Submit">  
    </p>    
  
    </form>

    </div>
     `,
    data() {
      return {
        userTime: null,
        iss_time_info: null,
      }
    },
    methods: {
      onSubmit() {
        axios
          // .get('https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps=' + timeStamp + '&units=miles')
          .get('https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps=1548978585&units=miles')
          .then(response => {
            this.iss_time_info = response.data[0]
            console.log(this.iss_time_info)
          })

        this.userTime = null
      }

    },
    computed: {

    }
  })



  Vue.use(VueGoogleMaps, {
    load: {
      key: "AIzaSyC2KMba-R4OMF2ROiKGpYGiXBpjyWFNV-4",
      libraries: "places" //necessary for places input
    }
  });



  var app = new Vue({
    el: '#app',
    data() {
      return {
        info: null,
        message: "Hello vue",
      }
    },
    mounted() {
      console.log('mounted')
      axios
        .get('http://api.open-notify.org/iss-now.json')
        .then(response => {
          var formattedTime = this.realTime(response.data.timestamp)
          response.data.formattedTime = formattedTime
          this.info = response.data
        })
    }, methods: {
      realTime: function (timestamp) {
        var date = new Date(timestamp * 1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        // Will display time in 10:30:23 format
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        return formattedTime
      }
    },
  })
})

// The above code uses Vue without the compiler, which means you cannot
// use Vue to target elements in your existing html templates. You would
// need to always use single file components.
// To be able to target elements in your existing html/erb templates,
// comment out the above code and uncomment the below
// Add <%= javascript_pack_tag 'hello_vue' %> to your layout
// Then add this markup to your html template:
//
// <div id='hello'>
//   {{message}}
//   <app></app>
// </div>


// import Vue from 'vue/dist/vue.esm'
// import App from '../app.vue'
//
// document.addEventListener('DOMContentLoaded', () => {
//   const app = new Vue({
//     el: '#hello',
//     data: {
//       message: "Can you say hello?"
//     },
//     components: { App }
//   })
// })
//
//
//
// If the using turbolinks, install 'vue-turbolinks':
//
// yarn add 'vue-turbolinks'
//
// Then uncomment the code block below:
//
// import TurbolinksAdapter from 'vue-turbolinks'
// import Vue from 'vue/dist/vue.esm'
// import App from '../app.vue'
//
// Vue.use(TurbolinksAdapter)
//
// document.addEventListener('turbolinks:load', () => {
//   const app = new Vue({
//     el: '#hello',
//     data: {
//       message: "Can you say hello?"
//     },
//     components: { App }
//   })
// })
