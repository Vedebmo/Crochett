<script setup>
import { ref } from 'vue'
import Back from '@/components/Back.vue'
import ShopCart from '@/components/ShopCart.vue'
import { Cart } from '@/Stores/Cart.js'
import Button from '@/components/Button.vue'
import { Store } from '@/stores/Store.js'
import { useRoute } from 'vue-router'
const $route = useRoute()
const store = Store()
const cart = Cart()
const showModal = ref(false)
const largeImage = ref('')

function showLargeImage(imageUrl) {
  largeImage.value = imageUrl
  showModal.value = true
}

import { onMounted, onBeforeMount, onBeforeUnmount } from 'vue'

onBeforeMount(async () => {
  store.getImagesProduct($route.params.product)
  const data = await store.getInfo($route.params.product)
  store.tempData = data
  store.isLoading = false
})

onMounted(async () => {
  cart.toAdd = 1
})

onBeforeUnmount(() => {
  store.imagesProduct = []
})
</script>

<template>
  <div v-if="store.isLoading">Cargando...</div>
  <div v-else>
    <Back class="arrow"></Back>
    <ShopCart v-if="cart.showingCart"></ShopCart>
    <div class="product-container">
      <div class="left">
        <div class="main-image">
          <img
            @click="showLargeImage(store.imagesProduct[0])"
            :src="store.imagesProduct[0]"
            alt="product image"
          />
        </div>
        <div class="small-images" v-if="store.imagesProduct.length > 1">
          <img
            :src="product"
            alt="product image"
            v-for="(product, index) in store.imagesProduct.slice(1)"
            @click="showLargeImage(product)"
          />
        </div>
      </div>
      <div class="right">
        <h1>{{ store.tempData[3] }}</h1>
        <div v-if="store.tempData[8] === 'agotado'" class="out-of-stock-banner">AGOTADO</div>
        <p>Precio: {{ store.tempData[9] }}$ / {{ store.tempData[10] }} Bs</p>
        <div class="description">
          <p>Descripción:</p>
          <p style="margin-top: 10px">
            {{ store.tempData[5] }}
          </p>
          <br />
          <p class="incluye">
            Incluye:
            {{ store.tempData[7] }}
          </p>
        </div>
        <div class="row-buttons" v-if="store.tempData[8] !== 'agotado'">
          <Button @click="cart.toogleCart(['Add', store.tempData])"></Button>
          <div class="amount">
            <span @click="cart.ChangeAdd('less')">-</span>
            <span>{{ cart.toAdd }}</span>
            <span @click="cart.ChangeAdd('more')">+</span>
          </div>
        </div>
        <div v-else class="out-of-stock-message">Este producto está temporalmente agotado</div>
      </div>
      <div class="modal" v-if="showModal" @click="showModal = false">
        <div class="modal-content" @click.stop>
          <img :src="largeImage" alt="Imagen" />
          <button @click="showModal = false">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-image {
  width: 90%;
  margin: 10px auto;
  height: 34vh;
}

.main-image img {
  width: 100%;
  height: 100%;
}

.small-images {
  display: flex;
  justify-content: space-around;
  height: 14vh;
  flex-wrap: wrap;
  overflow: auto;
}

.small-images img {
  width: 20%;
  height: 100%;
  padding: 5px;
}

h1 {
  font-size: 2.5rem;
  text-align: center;
}

h1 + p {
  font-size: 1.5rem;
  text-align: center;
}

.right {
  height: -webkit-fill-available;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.right * {
  font-family: 'Arimo';
}

.row-buttons {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.amount {
  font-size: 1.5rem;
  background-color: black;
  color: white;
  display: flex;
  width: 20%;
}

.amount span {
  flex-grow: 1;
  text-align: center;
  transition: background ease 0.5s;
}

.description {
  width: 90%;
  margin: 0 auto;
}

img {
  cursor: pointer;
}

.amount span:nth-child(2):hover {
  background-color: black;
  cursor: default;
}

.amount span:hover {
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

img {
  object-fit: contain;
}

@media screen and (min-width: 601px) {
  .product-container {
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
  }

  .left {
    width: 50%;
    display: grid;
    height: 70vh;
    align-content: center;
  }

  .right {
    width: 40%;
    height: 70vh;
  }

  .right h1,
  .right p {
    text-align: left;
  }

  .arrow {
    position: absolute;
  }

  .small-images {
    width: 100%;
    margin: auto;
    justify-content: flex-start;
    height: 20vh;
  }

  .small-images img {
    margin: 20px 24px 0 0;
  }

  .main-image {
    width: 100%;
    object-fit: cover;
  }

  .amount {
    position: relative;
    top: 10vh;
  }

  .description {
    font-size: 1.5rem;
    margin: inherit;
  }
}

.out-of-stock-banner {
  background-color: red;
  color: white;
  text-align: center;
  padding: 10px;
  margin: 10px 0;
  font-weight: bold;
  border-radius: 4px;
}

.out-of-stock-message {
  text-align: center;
  color: red;
  font-weight: bold;
  margin: 20px 0;
  font-size: 1.2rem;
}
</style>
