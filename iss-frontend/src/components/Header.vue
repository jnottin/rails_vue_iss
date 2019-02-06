<template>
  <div>
    <ul class="navbar">
      <li class="nav-item">
        <img class="logo nav-item" src="https://i.imgur.com/QyRaUXD.png" alt>
      </li>
      <li class="nav-item">
        <a class="app-title-link" href="/">
          <h1 class="app-title">Space Traffic</h1>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { eventBus } from "../main";

export default {
  name: "Header",
  data() {
    return {
      center: ""
    };
  },
  created() {
    eventBus.$on("send-center", center => {
      this.center = center;
    });
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar {
  margin-top: 0;
  padding-left: 0;
  box-shadow: 2px 10px 18px #888888;
  /* background-color: rgb(179, 179, 179); */
  background-color: rgb(121, 121, 210);
  list-style: none;
  margin-bottom: 0;
  width: 100%;
  height: 70px;
  z-index: 1;
}

.nav-item {
  float: left;
  text-align: center;
  text-decoration: none;
  padding: 7px 10px;
}

.logo {
  padding-top: 3px;
  height: 50px;
  width: 50px;
}
.app-title {
  font-size: 30px;
  color: white;
  text-shadow: 2px 2px 4px #000000;
  margin: 0;
  padding: 0;
  /* font-family: 'Cinzel', serif; */
}

.app-title-link {
  text-decoration: none;
  padding: 0;
}
</style>
