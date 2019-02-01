<template>
  <div>
    <h1>Header</h1>
    <div v-if="center">{{center}}</div>
  </div>
</template>

<script>
import {eventBus} from "../main";

export default {
  name: 'Header',
  data () {
    return {
        center: ''
    }
  },
  created() {
        eventBus.$on('send-center', (center) => {
            this.center = center
        });
    },
  methods: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>