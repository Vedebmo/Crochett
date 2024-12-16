<template>
  <div class="update-container">
    <h2>Gestionar Productos</h2>

    <button v-if="!isAuthenticated" @click="authenticate" class="auth-button">
      Iniciar Sesión
    </button>

    <form v-else @submit.prevent="uploadProduct" class="product-form">
      <div class="form-group">
        <label for="name">Nombre del Producto:</label>
        <input
          id="name"
          v-model="newProduct.name"
          required
          type="text"
          placeholder="Ej: Bolso tejido"
        />
      </div>

      <div class="form-group">
        <label for="description">Descripción:</label>
        <textarea
          id="description"
          v-model="newProduct.description"
          required
          placeholder="Describe el producto..."
        ></textarea>
      </div>

      <div class="form-group">
        <label for="includes">Incluye:</label>
        <textarea
          id="includes"
          v-model="newProduct.includes"
          required
          placeholder="¿Qué incluye el producto?"
        ></textarea>
      </div>

      <div class="form-group conversion-toggle">
        <label class="toggle-label">
          <input type="checkbox" v-model="useAutoConversion" />
          <span class="toggle-text">Usar conversión automática</span>
        </label>
      </div>

      <div class="form-group" v-if="useAutoConversion">
        <label for="exchange_rate">Tasa de Cambio (1 USD = X Bs):</label>
        <div class="price-input-container">
          <span class="currency-symbol">Bs</span>
          <input
            id="exchange_rate"
            v-model="exchangeRate"
            type="number"
            step="0.01"
            placeholder="56"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="price_usd">Precio (USD):</label>
        <div class="price-input-container">
          <span class="currency-symbol">$</span>
          <input
            id="price_usd"
            v-model="newProduct.price_usd"
            required
            type="number"
            step="0.01"
            placeholder="10"
            @input="updatePrices('usd')"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="price_bs">Precio (Bs):</label>
        <div class="price-input-container">
          <span class="currency-symbol">Bs</span>
          <input
            id="price_bs"
            v-model="newProduct.price_bs"
            required
            type="number"
            step="0.01"
            placeholder="560"
            @input="updatePrices('bs')"
          />
        </div>
      </div>

      <div class="form-group">
        <label>Categorías (selecciona una o más):</label>
        <div class="categories-container">
          <div v-for="category in categories" :key="category" class="category-checkbox">
            <input
              type="checkbox"
              :id="category"
              :value="category"
              v-model="newProduct.categories"
            />
            <label :for="category">{{ category }}</label>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="images">Imágenes:</label>
        <input
          type="file"
          id="images"
          @change="handleFileSelect"
          multiple
          accept="image/*"
          required
        />
        <small class="file-info" v-if="selectedFiles.length > 0">
          {{ selectedFiles.length }} archivo
        </small>
      </div>

      <div class="button-group">
        <button type="submit" class="submit-button">Subir Producto</button>
        <button type="button" @click="clearForm" class="clear-button">Limpiar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import { Store } from '@/stores/Store.js'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup
} from 'firebase/auth'

const store = Store()
const storage = getStorage()

const newProduct = ref({
  id: '',
  name: '',
  description: '',
  includes: '',
  price_usd: '',
  price_bs: '',
  categories: [],
  images: []
})

const exchangeRate = ref('')
const useAutoConversion = ref(true)
const categories = ref([])
const selectedFiles = ref([])
const isAuthenticated = ref(false)

// Get categories on mount
const getCategories = async () => {
  if (store.classes.length === 0) {
    await store.getClasses()
  }
  categories.value = store.classes
}

onBeforeMount(async () => {
  await getCategories()
})

// Authentication
const authenticate = async () => {
  const auth = getAuth()
  const provider = new GoogleAuthProvider()

  try {
    await setPersistence(auth, browserLocalPersistence)
    const result = await signInWithPopup(auth, provider)

    if (result.user.email === 'crochettaccesories@gmail.com') {
      isAuthenticated.value = true
    } else {
      await result.user.delete()
      alert('No tienes acceso a esta función')
    }
  } catch (error) {
    console.error('Authentication error:', error)
  }
}

// Handle file selection
const handleFileSelect = (event) => {
  selectedFiles.value = Array.from(event.target.files)
}

// Toggle category selection
const toggleCategory = (category) => {
  const index = newProduct.value.categories.indexOf(category)
  if (index === -1) {
    newProduct.value.categories.push(category)
  } else {
    newProduct.value.categories.splice(index, 1)
  }
}

// Watch for changes in the toggle
watch(useAutoConversion, (newValue) => {
  if (newValue && exchangeRate.value && newProduct.value.price_usd) {
    // If turning on auto-conversion, update Bs price based on USD
    newProduct.value.price_bs = (newProduct.value.price_usd * exchangeRate.value).toFixed(2)
  }
})

// Watch for changes in exchange rate
watch(exchangeRate, (newValue) => {
  if (useAutoConversion.value && newValue && newProduct.value.price_usd) {
    // Update Bs price when exchange rate changes
    newProduct.value.price_bs = (newProduct.value.price_usd * newValue).toFixed(2)
  }
})

// New function to handle price conversions
const updatePrices = (currency) => {
  if (!exchangeRate.value || !useAutoConversion.value) return

  if (currency === 'usd' && newProduct.value.price_usd) {
    newProduct.value.price_bs = (newProduct.value.price_usd * exchangeRate.value).toFixed(2)
  } else if (currency === 'bs' && newProduct.value.price_bs) {
    newProduct.value.price_usd = (newProduct.value.price_bs / exchangeRate.value).toFixed(2)
  }
}

// Upload product
const uploadProduct = async () => {
  if (!isAuthenticated.value) {
    alert('Por favor, inicia sesión primero')
    return
  }

  if (newProduct.value.categories.length === 0) {
    alert('Por favor, selecciona al menos una categoría')
    return
  }

  try {
    const productId = `${Date.now()}`
    newProduct.value.id = productId

    // Upload images
    const uploadedImageUrls = []
    for (const file of selectedFiles.value) {
      const imageRef = storageRef(
        storage,
        `/Productos/${productId} - ${newProduct.value.name}/${file.name}`
      )
      await uploadBytes(imageRef, file)
      const url = await getDownloadURL(imageRef)
      uploadedImageUrls.push(url)
    }

    // Create product info as an array with exact positions
    const productInfo = []
    productInfo[0] = productId
    productInfo[1] = null
    productInfo[2] = productId
    productInfo[3] = newProduct.value.name
    productInfo[4] = ''
    productInfo[5] = newProduct.value.description
    productInfo[6] = ''
    productInfo[7] = newProduct.value.includes
    productInfo[8] = ''
    productInfo[9] = Number(newProduct.value.price_usd) // Convert to number
    productInfo[10] = Number(newProduct.value.price_bs) // Convert to number
    // Add categories starting from index 11
    newProduct.value.categories.forEach((category) => {
      productInfo.push(category)
    })

    // Upload product info
    const infoRef = storageRef(
      storage,
      `/Productos/${productId} - ${newProduct.value.name}/info.json`
    )
    await uploadBytes(infoRef, new TextEncoder().encode(JSON.stringify(productInfo)))

    // Update each category file
    for (const category of newProduct.value.categories) {
      const categoryRef = storageRef(storage, `/${category}/${category}.txt`)
      let categoryData = ''
      try {
        const url = await getDownloadURL(categoryRef)
        const response = await fetch(url)
        categoryData = await response.text()
      } catch (error) {
        console.log(`New category file will be created for ${category}`)
      }

      const newCategoryData = categoryData + `${productId} - ${newProduct.value.name}, `
      await uploadBytes(categoryRef, new TextEncoder().encode(newCategoryData))
    }

    alert('Producto subido exitosamente')
    clearForm()
  } catch (error) {
    console.error('Error uploading product:', error)
    alert('Error al subir el producto')
  }
}

// Clear form
const clearForm = () => {
  newProduct.value = {
    id: '',
    name: '',
    description: '',
    includes: '',
    price_usd: '',
    price_bs: '',
    categories: [],
    images: []
  }
  exchangeRate.value = ''
  useAutoConversion.value = true
  selectedFiles.value = []
  const fileInput = document.querySelector('#images')
  if (fileInput) {
    fileInput.value = ''
  }
}
</script>

<style scoped>
.update-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: bold;
  color: #333;
}

input,
textarea,
select {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.submit-button,
.clear-button,
.auth-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.submit-button {
  background-color: #cda349;
  color: white;
}

.submit-button:hover {
  background-color: #b88f35;
}

.clear-button {
  background-color: #e0e0e0;
  color: #333;
}

.clear-button:hover {
  background-color: #d0d0d0;
}

.auth-button {
  background-color: #4285f4;
  color: white;
  margin: 1rem 0;
}

.auth-button:hover {
  background-color: #3367d6;
}

.categories-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.category-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-checkbox input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.category-checkbox label {
  cursor: pointer;
  font-weight: normal;
}

@media (max-width: 600px) {
  .update-container {
    margin: 1rem;
    padding: 1rem;
  }

  .button-group {
    flex-direction: column;
  }

  .categories-container {
    grid-template-columns: 1fr;
  }
}

.price-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 10px;
  color: #666;
  z-index: 1;
}

.price-input-container input {
  padding-left: 25px;
  width: 100%;
}

.price-input-container input::-webkit-outer-spin-button,
.price-input-container input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.price-input-container input[type='number'] {
  -moz-appearance: textfield;
}

.form-group:has(.price-input-container) input {
  padding-left: 30px;
}

/* Add some spacing between price inputs */
.form-group + .form-group {
  margin-top: 1rem;
}

.conversion-toggle {
  margin: 1rem 0;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.toggle-label input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.toggle-text {
  font-weight: normal;
  color: #333;
}

/* Conditional styling for price inputs when auto-conversion is off */
.price-input-container input[disabled] {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
</style>
