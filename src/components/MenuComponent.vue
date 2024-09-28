<template>
    <div class="menu">
    <span class="icon-arrow-left" @click="store.toogleMenu"></span>
    <h1>Menú</h1>
    <ul>Stock</ul>
    <ul>Floristería</ul>
    <ul>Combos</ul>
    <ul>Peluches y Llaveros</ul>
    <ul>Navidad</ul>
    <ul>Agrégale a tu pedido</ul>
    <ul>Ropa Tejida</ul>
  </div>
</template>

<script setup>
    import {Store} from "@/stores/Store.js"
    const store = Store()
</script>

<script>
    export default{
        name: "Menu"
    }
</script>

<style>
    .menu {
        position: absolute;
        top: 0;
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
        align-items: center;
        justify-content: space-evenly;
        background-color: #CDA349;
        z-index: 1;
        overflow-y: auto;
    }

    .menu ul{
        font-size: large;
        width: 35%;
        padding: 3% 0;
        text-align: center;
        cursor: pointer;
        transition: background ease 1s;
        border-radius: 5px;
    }

    .menu ul:hover{
        background: #967632;
    }

    .icon-arrow-left{
        color: white;
        position: absolute;
        top: 8vh;
        left: 8vw;
        font-size: 7vh;
        cursor: pointer;
    }

    @media screen and (min-width: 601px) {
        .menu{
            width: 40vw;
            position: fixed;
        }
    }
</style>