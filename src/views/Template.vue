<script setup>
import { useRoute } from 'vue-router'
const $route = useRoute()
import Back from '@/components/Back.vue'
import { Store } from '@/stores/Store.js'
const store = Store()

import { Cart } from '@/Stores/Cart.js'
const cart = Cart()
let previewSite = $route.fullPath

import { onBeforeMount, onBeforeUnmount, ref, computed } from 'vue'

const itemsPerPage = 8
const currentPage = ref(store.currentPage || 1)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return store[$route.params.class]?.slice(start, end) || []
})

const paginatedImages = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return store.imagesToShow?.slice(start, end) || []
})

const loadMore = () => {
  currentPage.value++
  store.currentPage = currentPage.value
}

const loadPrevious = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    store.currentPage = currentPage.value
  }
}

onBeforeMount(async () => {
  store.dataLoaded = false
  store.productsToShow = []
  await store.getProducts(`${$route.params.class}`)
})

onBeforeUnmount(() => {
  if (!store.dataLoaded) {
    store.previewSite = previewSite
    store.actualSite = ''
  }
  store.dataLoaded = false
  store.imagesToShow = []
})
</script>

<template>
  <Back></Back>
  <div class="row">
    <h2 style="text-align: center; text-wrap: nowrap">{{ $route.params.class }}</h2>
    <hr />
  </div>

  <div class="product-parent">
    <div class="products" v-if="store.dataLoaded">
      <router-link
        v-for="(product, index) in paginatedProducts"
        :key="product"
        class="product-container link"
        :to="{
          path: `/Producto/${product}`,
          query: {
            productInfo: product[1] == null ? Object.values(store.productsToShow[index]) : undefined
          }
        }"
      >
        <div class="product-container">
          <img :src="paginatedImages[index]" alt="Imagén del producto" />
          <br />
          <h4>{{ product.split('- ')[1] }}</h4>
          <p>
            Precio: {{ store.productsToShow[index]?.[9] ?? '...' }}$ /
            {{ store.productsToShow[index]?.[10] ?? '...' }} Bs
          </p>
        </div>
      </router-link>

      <div class="pagination-buttons">
        <button @click="loadPrevious" v-if="currentPage > 1" class="loadButton">
          Productos Anteriores
        </button>
        <button
          @click="loadMore"
          v-if="currentPage * itemsPerPage < store[$route.params.class]?.length"
          class="loadButton"
        >
          Siguientes Productos
        </button>
      </div>
    </div>
    <div v-else>Cargando...</div>
  </div>
</template>

<style scoped>
.products {
  position: relative;
  margin: auto;
  width: 90vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
}

.product-parent {
  display: grid;
  place-items: center;
  height: 90vh;
}

.product-container {
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: background ease 1s;
  cursor: pointer;
}

.link {
  color: black;
  text-decoration: none;
  transition: background ease 1s color ease 1s;
  width: -webkit-fill-available;
}

.product-container img {
  height: 70%;
  width: 100%;
}

.product-container * {
  font-family: 'Arimo';
}

.link:hover {
  background-color: #cda349;
  color: white;
}

.product-container h4 {
  font-weight: 500;
}

img {
  object-fit: contain;
}

.loadButton {
  margin: 20px 0px 30px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #cda349;
  color: white;
  border: none;
  cursor: pointer;
}

.pagination-buttons {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0px 30px;
}

.loadButton {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #cda349;
  color: white;
  border: none;
  cursor: pointer;
}

.loadButton:hover {
  background-color: #b88f35;
}

@media screen and (min-width: 601px) {
  .products {
    width: 80vw;
  }

  .product-container {
    height: 35vh;
    flex-basis: 16vw;
  }

  .link {
    width: initial;
  }

  .loadButton {
    margin: 0px 20px;
  }

  .pagination-buttons {
    margin: 20px 0px;
  }
}
</style>
