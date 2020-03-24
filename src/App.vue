<template>
  <div id="app">
    <component :is="viewModel"></component>
  </div>
</template>

<script>
import Dating from './components/Dating.vue'
import WatingRoom from './components/WatingRoom.vue'
export default {
  name: 'App',
  components: {
    Dating,
    WatingRoom
  },
  data(){
    return {

    }
  },
  computed:{
    viewModel(){
      return this.$store.state.viewModel
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
