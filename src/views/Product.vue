<script setup>
  import { ref } from 'vue';
  import Back  from "@/components/Back.vue";
  import { Cart } from "@/Stores/Cart.js";
  const cart = Cart()
  const showModal = ref(false);
  const largeImage = ref('');

  function showLargeImage(imageUrl) {
    largeImage.value = imageUrl;
    showModal.value = true;
  }
</script>

<template>
  <Back class="arrow"></Back>
  <div class="product-container">
    <div class="left">
      <div class="main-image">
        <img @click="showLargeImage('https://zeromotorcycles.com/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fzero-cms-disco%2F9ddb733e-225b-4bf7-bf41-72d36c6f4272_S_MY24.2.jpg%3Fauto%3Dcompress%2Cformat&w=3840&q=75')" src="https://zeromotorcycles.com/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fzero-cms-disco%2F9ddb733e-225b-4bf7-bf41-72d36c6f4272_S_MY24.2.jpg%3Fauto%3Dcompress%2Cformat&w=3840&q=75" alt="product image">
      </div>
      <div class="small-images">
        <img @click="showLargeImage('https://picsum.photos/200/300')" src="https://picsum.photos/200/300" alt="product image">

        <img @click="showLargeImage('https://picsum.photos/200/300')" src="https://picsum.photos/200/300" alt="product image">

        <img @click="showLargeImage('https://picsum.photos/200/300')" src="https://picsum.photos/200/300" alt="product image">
      </div>
    </div>
    <div class="right">
      <h1>Girasol y perfume</h1>
      <p>Precio: 8$/ 348 Bs</p>
      <div class="description">
        <p>
          Descripción:
        </p>
        <p style="margin-top: 10px;">
          Pedido disponible por encargo, con una semana y media de anticipación
        </p>
        <br>
        <p class="incluye">
          Incluye:
          Girasol de 15 cm de diametro
          Perfume
          Caja 26x20x9 cm
        </p>
      </div>
      <div class="row-buttons">
        <div class="button">
          <img src="@/assets/Frame.webp" alt="Botón">
          <p>Comprar</p>
        </div>
        <div class="amount">
          <span @click="cart.ChangeAdd('less')">-</span>
          <span>{{cart.toAdd}}</span>
          <span @click="cart.ChangeAdd('more')">+</span>
        </div>
      </div>
    </div>
    <div class="modal" v-if="showModal" @click="showModal = false">
      <div class="modal-content" @click.stop>
        <img :src="largeImage" alt="Large product image">
        <button @click="showModal = false">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
   .button {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    z-index: 1;
    width: 50%;
    cursor:default;
  }

  .button a{
    color: black;
  }

  .button img {
    width: 110%;
    height: 110%;
    object-fit: cover;
    transition: background ease 1s;
    cursor: pointer;
  }

  .button p {
    position: absolute;
    text-wrap: nowrap;
    font-size: 130%;
    z-index: 2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    transition: color ease 1s;
    cursor: pointer;
  }

  .button:hover img{
    background-color: #CDA349;
  }

  .button:hover p{
    color: white;
  }

  .product-container{
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .main-image{
    width: 90%;
    margin: 10px auto;
    height: 34vh;
  }

  .main-image img{
    width: 100%;
    height: 100%;
  }

  .small-images{
    display: flex;
    justify-content: space-around;
    height: 14vh;
    flex-wrap: wrap;
    overflow: auto;
  }

  .small-images img{
    width: 20%;
    height: 100%;
    padding: 5px;
  }

  h1{
    font-size: 2.5rem;
    text-align: center;
  }

  h1 + p{
    font-size: 1.5rem;
    text-align: center;
  }

  .right{
    height: -webkit-fill-available;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  .right *{
    font-family: "Arimo";
  }

  .row-buttons{
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .amount{
    font-size: 1.5rem;
    background-color: black;
    color: white;
    display: flex;
    width: 20%;
  }

  .amount span{
    flex-grow: 1;
    text-align: center;
    transition: background ease .5s;
  }

  .description{
    width: 90%;
    margin: 0 auto;
  }

  img{
    cursor: pointer;
  }

  .amount span:nth-child(2):hover{
    background-color: black;
    cursor: default;
  }

  .amount span:hover{
    background-color: #333;
    cursor: pointer;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }

  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    width: 80%;
    max-width: 800px;
  }

  .modal-content img {
    width: 100%;
    height: auto;
    max-height: 40vh;
    margin-bottom: 20px;
    object-fit: scale-down;
    cursor: default;
  }

  .modal-content button {
    background-color: #333;
    color: #fff;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }

  .modal-content button:hover {
    background-color: #444;
  }

  @media screen and (min-width: 601px) {
    .button{
      width: auto;
      height: 3vh;
      top: 10vh;
    }

    .button img{
      height: 170%;
      width: 14rem;
      object-fit: unset;
    }

    .button p{
      left: 50%;
    }

    .product-container{
      flex-direction: row;
      align-items: center;
      justify-content: space-evenly;
    }


    .left{
      width: 50%;
      display: grid;
      height: 70vh;
      align-content: center;
    }

    .right{
      width: 40%;
      height: 70vh;
    }

    .right h1, .right p{
      text-align: left;
    }

    .arrow{
      position: absolute;
    }

    .small-images{
      width: 100%;
      margin: auto;
      justify-content: flex-start;
      height: 20vh
    }

    .small-images img{
      margin: 20px 24px 0 0;
    }

    .main-image{
      width: 100%;
      object-fit: cover;
    }

    .amount{
      position: relative;
      top: 10vh;
    }

    .description{
      font-size: 1.5rem;
      margin: inherit
    }
  }
</style>