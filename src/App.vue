<template>
  <div id="app">

    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  watch: {
    $route(to, from) {
      if (to.path != '/login') {
        let obj = {
          name: to.name,
          title: to.meta.title
        }
        this.$store.commit("addTab", obj);
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  background-color: rgb(142, 181, 168);
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
aside{
  width: 350px !important;
}
</style>
