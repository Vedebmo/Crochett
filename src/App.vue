<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HomeView from './views/HomeView.vue'
</script>

<style src="@/assets/icomoon/style.css"></style>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400..700;1,400..700&family=Belleza&family=IM+Fell+English:ital@0;1&display=swap');
</style>
<style>
  *{
    margin: 0%;
    padding: 0;
    font-family: "Im Fell English", "Belleza", 'Arimo';
  }

  html{
    scroll-behavior: smooth;
    height: 100vh;
    overflow-x: hidden;
  }

  .row{
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 90%;
    margin: auto;
  }

  hr{
    border: #cda349 2px solid;
    width: -webkit-fill-available;
    margin-left: 2%;
    height: 0px;
  }
</style>

<template>
  <RouterView />
</template>