<template>
  <div class="update-container">
    <h2>Gestionar Productos y Categorías</h2>

    <button v-if="!isAuthenticated" @click="authenticate" class="auth-button">
      Iniciar Sesión
    </button>

    <div v-else class="management-tabs">
      <button :class="['tab-button', { active: activeTab === 'add' }]" @click="activeTab = 'add'">
        Agregar Producto
      </button>
      <button :class="['tab-button', { active: activeTab === 'edit' }]" @click="activeTab = 'edit'">
        Editar/Eliminar Productos
      </button>
      <button
        :class="['tab-button', { active: activeTab === 'categories' }]"
        @click="activeTab = 'categories'"
      >
        Agregar/Eliminar Categorías
      </button>
      <button class="tab-button" @click="checkDuplicates">Buscar Duplicados</button>
    </div>

    <!-- Add Product Form -->
    <form
      v-if="isAuthenticated && activeTab === 'add'"
      @submit.prevent="uploadProduct"
      class="product-form"
    >
      <button @click="initializeMultipleProducts" class="add-multiple-button">
        Agregar Múltiples Productos
      </button>

      <div v-for="(product, index) in products" :key="index" class="product-form">
        <h3>Producto {{ index + 1 }} de {{ productCount }}</h3>

        <div class="form-group">
          <label for="name">Nombre del Producto:</label>
          <input
            id="name"
            v-model="product.name"
            required
            type="text"
            placeholder="Ej: Bolso tejido"
          />
        </div>

        <div class="form-group">
          <label for="description">Descripción:</label>
          <textarea
            id="description"
            v-model="product.description"
            required
            placeholder="Describe el producto..."
          ></textarea>
        </div>

        <div class="form-group">
          <label for="includes">Incluye:</label>
          <textarea
            id="includes"
            v-model="product.includes"
            required
            placeholder="¿Qué incluye el producto?"
          ></textarea>
        </div>

        <div class="form-group conversion-toggle">
          <label class="toggle-label">
            <input type="checkbox" v-model="useAutoConversion[index]" />
            <span class="toggle-text">Usar conversión automática</span>
          </label>
        </div>

        <div class="form-group" v-if="useAutoConversion[index]">
          <label for="exchange_rate">Tasa de Cambio (1 USD = X Bs):</label>
          <div class="price-input-container">
            <span class="currency-symbol">Bs</span>
            <input
              :id="'exchange_rate_' + index"
              v-model="exchangeRate"
              type="number"
              step="0.01"
              placeholder="56"
            />
          </div>
        </div>

        <div class="form-group">
          <label :for="'price_usd_' + index">Precio (USD):</label>
          <div class="price-input-container">
            <span class="currency-symbol">$</span>
            <input
              :id="'price_usd_' + index"
              v-model="product.price_usd"
              required
              type="number"
              step="0.01"
              placeholder="10"
              @input="updatePrices('usd', index)"
            />
          </div>
        </div>

        <div class="form-group">
          <label :for="'price_bs_' + index">Precio (Bs):</label>
          <div class="price-input-container">
            <span class="currency-symbol">Bs</span>
            <input
              :id="'price_bs_' + index"
              v-model="product.price_bs"
              required
              type="number"
              step="0.01"
              placeholder="560"
              @input="updatePrices('bs', index)"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Categorías (selecciona una o más):</label>
          <div class="categories-container">
            <div v-for="category in categories" :key="category" class="category-checkbox">
              <input
                type="checkbox"
                :id="`${category}-${index}`"
                :value="category"
                v-model="product.categories"
              />
              <label :for="`${category}-${index}`">{{ category }}</label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label :for="`images-${index}`">Imágenes:</label>
          <input
            type="file"
            :id="`images-${index}`"
            @change="(e) => previewImages(e, index)"
            multiple
            accept="image/*"
            required
          />
          <div class="image-previews" v-if="imagePreviewUrls[index]?.length > 0">
            <div
              v-for="(url, imgIndex) in imagePreviewUrls[index]"
              :key="imgIndex"
              class="preview-container"
            >
              <img :src="url" :alt="`Preview ${imgIndex + 1}`" class="image-preview" />
            </div>
          </div>
        </div>

        <div class="checkbox-group">
          <input type="checkbox" :id="`outOfStock-${index}`" v-model="product.outOfStock" />
          <label :for="`outOfStock-${index}`">Agotado</label>
        </div>
      </div>

      <div class="button-group">
        <button type="submit" class="submit-button">Subir Producto(s)</button>
        <button type="button" @click="clearForm" class="clear-button">Limpiar</button>
      </div>
    </form>

    <!-- Edit/Delete Products -->
    <div v-if="isAuthenticated && activeTab === 'edit'" class="edit-products">
      <form @submit.prevent="searchProducts" class="search-box">
        <input
          type="search"
          v-model="searchQuery"
          placeholder="Buscar producto..."
          enterkeyhint="search"
          @keyup.enter="searchProducts"
        />
      </form>

      <div v-if="isLoading" class="loading-state">Buscando productos...</div>

      <div v-else-if="searchQuery.trim() === ''" class="empty-state">
        Ingresa un término de búsqueda para encontrar productos
      </div>

      <div v-else-if="filteredProducts.length === 0" class="empty-state">
        No se encontraron productos que coincidan con la búsqueda
      </div>

      <div v-else class="products-list">
        <div v-for="product in filteredProducts" :key="product.id" class="product-item">
          <img :src="product.image" alt="Product image" class="product-thumbnail" />
          <div class="product-info">
            <h3>{{ product[3] }}</h3>
            <p>{{ product[9] }}$ / {{ product[10] }} Bs</p>
          </div>
          <div class="product-actions">
            <button @click="editProduct(product)" class="edit-button">Editar</button>
            <button @click="deleteProduct(product)" class="delete-button">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Manage Categories -->
    <div v-if="isAuthenticated && activeTab === 'categories'" class="manage-categories">
      <div class="add-category">
        <input type="text" v-model="newCategory" placeholder="Nueva categoría..." />
        <input
          type="file"
          @change="handleCategoryImageChange"
          accept="image/*"
          class="category-image-input"
        />
        <button @click="addCategory" class="add-button">Agregar</button>
      </div>

      <div class="categories-list">
        <div v-for="(category, index) in categories" :key="category" class="category-item">
          <div v-if="editingCategory?.oldName === category" class="category-edit-form">
            <input type="text" v-model="editingCategory.newName" />
            <input
              type="file"
              @change="handleCategoryImageChange"
              accept="image/*"
              class="category-image-input"
            />
            <img
              v-if="categoryImagePreview"
              :src="categoryImagePreview"
              class="category-image-preview"
            />
            <div class="edit-actions">
              <button @click="updateCategory" class="save-button">Guardar</button>
              <button @click="editingCategory = null" class="cancel-button">Cancelar</button>
            </div>
          </div>
          <div v-else class="category-display">
            <img
              :src="store.classesImages[index] || defaultImageUrl"
              :data-category="category"
              class="category-image"
              @error="handleImageError"
            />
            <span>{{ category }}</span>
            <div class="category-actions">
              <button @click="startEditCategory(category)" class="edit-button">Editar</button>
              <button @click="deleteCategory(category)" class="delete-button">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h3>Editar Producto</h3>

        <div class="edit-product-form">
          <div class="form-group">
            <label>Nombre:</label>
            <input v-model="editingItem.name" type="text" required />
          </div>

          <div class="form-group">
            <label>Descripción:</label>
            <textarea v-model="editingItem.description" required></textarea>
          </div>

          <div class="form-group">
            <label>Incluye:</label>
            <textarea v-model="editingItem.includes" required></textarea>
          </div>

          <div class="form-group">
            <label>Precio (USD):</label>
            <div class="price-input-container">
              <span class="currency-symbol">$</span>
              <input v-model="editingItem.price_usd" type="number" step="0.01" required />
            </div>
          </div>

          <div class="form-group">
            <label>Precio (Bs):</label>
            <div class="price-input-container">
              <span class="currency-symbol">Bs</span>
              <input v-model="editingItem.price_bs" type="number" step="0.01" required />
            </div>
          </div>

          <!-- Add categories selection -->
          <div class="form-group">
            <label>Categorías:</label>
            <div class="categories-container">
              <div v-for="category in categories" :key="category" class="category-checkbox">
                <input
                  type="checkbox"
                  :id="`edit-${category}`"
                  :value="category"
                  v-model="editingItem.categories"
                />
                <label :for="`edit-${category}`">{{ category }}</label>
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="checkbox-group">
              <input type="checkbox" id="editOutOfStock" v-model="editingItem.outOfStock" />
              <label for="editOutOfStock">Agotado</label>
            </div>
          </div>
        </div>

        <div class="modal-buttons">
          <button @click="saveEdit" class="save-button">Guardar</button>
          <button @click="showEditModal = false" class="cancel-button">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, watch, computed, onMounted, nextTick } from 'vue'
import { Store } from '@/stores/Store.js'
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll
} from 'firebase/storage'
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
  images: [],
  outOfStock: false
})

const exchangeRate = ref('')
const useAutoConversion = ref([])
const categories = ref([])
const selectedFiles = ref([])
const isAuthenticated = ref(false)
const activeTab = ref('add')
const searchQuery = ref('')
const filteredProducts = ref([])
const showEditModal = ref(false)
const editingItem = ref(null)
const newCategory = ref('')
const allProducts = ref([])
let isLoading = ref(false)
const productCount = ref(1)
const showProductCountModal = ref(false)
const products = ref([])
const imagePreviewUrls = ref([])
const editingCategory = ref(null)
const categoryImageFile = ref(null)
const categoryImagePreview = ref('')
const defaultImageUrl =
  'https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg'

// Get categories on mount
const getCategories = async () => {
  categories.value = [] // Clear local categories
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
  if (newValue) {
    products.value.forEach((product, index) => {
      if (useAutoConversion.value[index] && product.price_usd) {
        product.price_bs = (product.price_usd * newValue).toFixed(2)
      }
    })
  }
})

// New function to handle price conversions
const updatePrices = (currency, productIndex) => {
  if (!exchangeRate.value || !useAutoConversion.value[productIndex]) return

  if (currency === 'usd' && products.value[productIndex].price_usd) {
    products.value[productIndex].price_bs = (
      products.value[productIndex].price_usd * exchangeRate.value
    ).toFixed(2)
  } else if (currency === 'bs' && products.value[productIndex].price_bs) {
    products.value[productIndex].price_usd = (
      products.value[productIndex].price_bs / exchangeRate.value
    ).toFixed(2)
  }
}

// Upload product
const uploadProduct = async () => {
  alert('Subiendo productos...')
  if (!isAuthenticated.value) {
    alert('Por favor, inicia sesión primero')
    return
  }

  for (const product of products.value) {
    if (product.categories.length === 0) {
      alert('Por favor, selecciona al menos una categoría para cada producto')
      return
    }
  }

  try {
    for (const [index, product] of products.value.entries()) {
      const productId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      product.id = productId

      // Upload images using the correct index
      const uploadedImageUrls = []
      if (selectedFiles.value[index]?.length > 0) {
        for (const file of selectedFiles.value[index]) {
          const imageRef = storageRef(
            storage,
            `/Productos/${productId} - ${product.name}/${file.name}`
          )
          await uploadBytes(imageRef, file)
          const url = await getDownloadURL(imageRef)
          uploadedImageUrls.push(url)
        }
      }

      // Create product info
      const productInfo = []
      productInfo[0] = productId
      productInfo[1] = null
      productInfo[2] = productId
      productInfo[3] = product.name
      productInfo[4] = ''
      productInfo[5] = product.description
      productInfo[6] = ''
      productInfo[7] = product.includes
      productInfo[8] = product.outOfStock ? 'agotado' : ''
      productInfo[9] = Number(product.price_usd)
      productInfo[10] = Number(product.price_bs)
      product.categories.forEach((category) => {
        productInfo.push(category)
      })

      // Upload product info
      const infoRef = storageRef(storage, `/Productos/${productId} - ${product.name}/info.json`)
      await uploadBytes(infoRef, new TextEncoder().encode(JSON.stringify(productInfo)))

      // Update categories
      for (const category of product.categories) {
        const categoryRef = storageRef(storage, `/${category}/${category}.txt`)
        let categoryData = ''
        try {
          const url = await getDownloadURL(categoryRef)
          const response = await fetch(url)
          categoryData = await response.text()
        } catch (error) {
          console.log(`New category file will be created for ${category}`)
        }

        const newEntry = `${productId} - ${product.name}`
        const newCategoryData = categoryData
          ? `${categoryData.trim()} ${newEntry},`
          : ` ${newEntry},`

        await uploadBytes(categoryRef, new TextEncoder().encode(newCategoryData))
      }
    }

    alert('Productos subidos exitosamente')
    clearForm()
  } catch (error) {
    console.error('Error uploading products:', error)
    alert('Error al subir los productos')
  }
}

// Clear form
const clearForm = () => {
  products.value = [
    {
      id: '',
      name: '',
      description: '',
      includes: '',
      price_usd: '',
      price_bs: '',
      categories: [],
      images: [],
      outOfStock: false
    }
  ]
  productCount.value = 1
  exchangeRate.value = ''
  useAutoConversion.value = [true]
  selectedFiles.value = [[]]
  imagePreviewUrls.value = [[]]

  // Clear all file inputs
  document.querySelectorAll('input[type="file"]').forEach((input) => {
    input.value = ''
  })
}

let processedIds = [] // Track processed IDs

// Modified loadAllProducts function
const loadAllProducts = async (searchTerm) => {
  if (!searchTerm.trim()) {
    filteredProducts.value = []
    return
  }

  filteredProducts.value = []

  try {
    // Get all products directly from Products folder
    const productsRef = storageRef(storage, '/Productos')
    let found = []

    // First, get all folder names
    const folders = await listAll(productsRef)
    const names = folders.prefixes.map((prefix) => prefix.name)

    // Search in folder names using regex
    const searchRegex = searchTerm
      .toLowerCase()
      .split(' ')
      .filter((word) => word.length > 0)
      .map((word) => {
        return word
          .replace(/[aáàäâ]/g, '[aáàäâ]')
          .replace(/[eéèëê]/g, '[eéèëê]')
          .replace(/[iíìïî]/g, '[iíìïî]')
          .replace(/[oóòöô]/g, '[oóòöô]')
          .replace(/[uúùüû]/g, '[uúùü]')
      })
      .map((word) => new RegExp(word, 'i'))

    // Filter and deduplicate by ID before processing
    found = names
      .filter((name) => {
        const lowercaseName = name.toLowerCase()
        return searchRegex.every((regex) => regex.test(lowercaseName))
      })
      .filter((name) => {
        const productId = name.split(' - ')[0]
        if (processedIds.indexOf(productId.toString()) !== -1) {
          return false
        }
        processedIds.push(productId)
        return true
      })

    // Load product info for found items
    for (const name of found) {
      try {
        const productId = name.split(' - ')[0]

        // Get product info
        const infoRef = storageRef(storage, `/Productos/${name}/info.json`)
        const productUrl = await getDownloadURL(infoRef)
        const productResponse = await fetch(productUrl)
        const productData = await productResponse.json()

        // Get first image as thumbnail
        const productImagesRef = storageRef(storage, `/Productos/${name}`)
        const imagesList = await listAll(productImagesRef)
        const firstImage = imagesList.items.find((item) =>
          item.name.match(/\.(jpg|jpeg|png|gif)$/i)
        )

        if (firstImage) {
          const imageUrl = await getDownloadURL(firstImage)
          filteredProducts.value.push({
            ...productData,
            id: productId,
            image: imageUrl
          })
        }
      } catch (error) {
        console.error('Error loading product details:', error)
      }
    }

    // Sort results by name
    filteredProducts.value.sort((a, b) => a[3].localeCompare(b[3]))
  } catch (error) {
    console.error('Error in search:', error)
  }
}

// Modified search function
const searchProducts = async () => {
  if (!searchQuery.value.trim()) {
    filteredProducts.value = []
    return
  }

  isLoading.value = true
  processedIds = [] // Reset processed IDs before each search
  try {
    await loadAllProducts(searchQuery.value)
  } finally {
    isLoading.value = false
  }
}

// Delete product
const deleteProduct = async (product) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return

  try {
    // Delete product folder and all contents
    const productRef = storageRef(storage, `/Productos/${product.id} - ${product[3]}`)
    const files = await listAll(productRef)

    // Delete all files in the product folder
    await Promise.all([
      ...files.items.map((file) => deleteObject(file)),
      ...files.prefixes.map(async (prefix) => {
        const subFiles = await listAll(prefix)
        return Promise.all(subFiles.items.map((file) => deleteObject(file)))
      })
    ])

    // Remove product from categories
    for (const category of categories.value) {
      try {
        const categoryRef = storageRef(storage, `/${category}/${category}.txt`)
        const url = await getDownloadURL(categoryRef)
        const response = await fetch(url)
        let data = await response.text()

        // Remove product from category list
        const productEntry = `${product.id} - ${product[3]},`
        data = data.replace(productEntry, '')

        // Ensure proper formatting
        data = data.trim()
        if (data) {
          data = ` ${data}`
        }

        await uploadBytes(categoryRef, new TextEncoder().encode(data))
      } catch (error) {
        console.error(`Error updating category ${category}:`, error)
      }
    }

    // After successful deletion, refresh the search data
    await store.refreshSearchData()

    // Refresh product list
    if (searchQuery.value) {
      await searchProducts()
    }
    alert('Producto eliminado exitosamente')
  } catch (error) {
    console.error('Error deleting product:', error)
    alert('Error al eliminar el producto')
  }
}

// Add category
const addCategory = async () => {
  if (!newCategory.value.trim()) return

  try {
    const categoryName = newCategory.value.trim()
    const categoryRef = storageRef(storage, `/${categoryName}/${categoryName}.txt`)

    // Create empty category file
    await uploadBytes(categoryRef, new TextEncoder().encode(''))

    // Upload category image if selected
    if (categoryImageFile.value) {
      const fileExtension = categoryImageFile.value.name.split('.').pop()
      const imageRef = storageRef(storage, `/${categoryName}/image.${fileExtension}`)
      await uploadBytes(imageRef, categoryImageFile.value)
    }

    // Refresh categories
    await store.getClasses() // This will refresh both categories and images
    categories.value = store.classes

    newCategory.value = ''
    categoryImageFile.value = null
    categoryImagePreview.value = ''
    alert('Categoría agregada exitosamente')
  } catch (error) {
    console.error('Error adding category:', error)
    alert('Error al agregar la categoría')
  }
}

// Delete category
const deleteCategory = async (category) => {
  if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) return

  try {
    const categoryRef = storageRef(storage, `/${category}`)
    const files = await listAll(categoryRef)

    // Delete all files in category
    await Promise.all(files.items.map((file) => deleteObject(file)))

    // Refresh categories
    await store.getClasses() // This will refresh both categories and images
    categories.value = store.classes

    alert('Categoría eliminada exitosamente')
  } catch (error) {
    console.error('Error deleting category:', error)
    alert('Error al eliminar la categoría')
  }
}

// Watch for tab changes
watch(activeTab, async (newTab) => {
  if (newTab === 'edit') {
    // await loadAllProducts()
  }
})

// Modified editProduct function to ensure categories is always an array
const editProduct = (product) => {
  // Extract categories from product data (indices 11 and beyond)
  const productCategories = []
  for (let i = 11; i < Object.keys(product).length; i++) {
    if (product[i]) {
      productCategories.push(product[i])
    }
  }

  editingItem.value = {
    id: product[2], // Make sure we're using the correct index for ID
    name: product[3],
    description: product[5],
    includes: product[7],
    outOfStock: product[8] === 'agotado',
    price_usd: product[9],
    price_bs: product[10],
    categories: productCategories, // This will be bound to the checkboxes
    originalName: product[3],
    originalCategories: [...productCategories] // Keep track of original categories
  }

  // Force a reactivity update
  nextTick(() => {
    showEditModal.value = true
  })
}

// Update the saveEdit function
const saveEdit = async () => {
  try {
    const product = editingItem.value
    const oldFolderName = `${product.id} - ${product.originalName}`
    const newFolderName = `${product.id} - ${product.name}`
    const isNameChanged = product.originalName !== product.name

    // Prepare the new product info
    const productInfo = []
    productInfo[0] = product.id
    productInfo[1] = null
    productInfo[2] = product.id
    productInfo[3] = product.name
    productInfo[4] = ''
    productInfo[5] = product.description
    productInfo[6] = ''
    productInfo[7] = product.includes
    productInfo[8] = product.outOfStock ? 'agotado' : ''
    productInfo[9] = Number(product.price_usd)
    productInfo[10] = Number(product.price_bs)
    // Add categories
    product.categories.forEach((category) => {
      productInfo.push(category)
    })

    // Handle category changes
    const categoriesToRemove = product.originalCategories.filter(
      (cat) => !product.categories.includes(cat)
    )
    const categoriesToAdd = product.categories.filter(
      (cat) => !product.originalCategories.includes(cat)
    )

    // Update category files
    const updatePromises = []

    // Remove from old categories
    for (const category of categoriesToRemove) {
      const promise = (async () => {
        const categoryRef = storageRef(storage, `/${category}/${category}.txt`)
        try {
          const url = await getDownloadURL(categoryRef)
          const response = await fetch(url)
          let data = await response.text()
          const productEntry = `${product.id} - ${product.originalName},`
          data = data.replace(productEntry, '')
          data = data.trim()
          if (data) {
            data = ` ${data}`
          }
          await uploadBytes(categoryRef, new TextEncoder().encode(data))
        } catch (error) {
          console.error(`Error updating category ${category}:`, error)
        }
      })()
      updatePromises.push(promise)
    }

    // Add to new categories
    for (const category of categoriesToAdd) {
      const promise = (async () => {
        const categoryRef = storageRef(storage, `/${category}/${category}.txt`)
        try {
          const url = await getDownloadURL(categoryRef)
          const response = await fetch(url)
          let data = await response.text()
          const productEntry = `${product.id} - ${product.name},`
          data = data.trim()
          data = data ? `${data} ${productEntry}` : ` ${productEntry}`
          await uploadBytes(categoryRef, new TextEncoder().encode(data))
        } catch (error) {
          console.error(`Error updating category ${category}:`, error)
        }
      })()
      updatePromises.push(promise)
    }

    // Update existing categories if name changed
    if (isNameChanged) {
      const unchangedCategories = product.categories.filter((cat) =>
        product.originalCategories.includes(cat)
      )
      for (const category of unchangedCategories) {
        const promise = (async () => {
          const categoryRef = storageRef(storage, `/${category}/${category}.txt`)
          try {
            const url = await getDownloadURL(categoryRef)
            const response = await fetch(url)
            let data = await response.text()
            const oldEntry = `${product.id} - ${product.originalName},`
            const newEntry = `${product.id} - ${product.name},`
            data = data.replace(oldEntry, newEntry)
            await uploadBytes(categoryRef, new TextEncoder().encode(data))
          } catch (error) {
            console.error(`Error updating category ${category}:`, error)
          }
        })()
        updatePromises.push(promise)
      }
    }

    // Wait for all category updates to complete
    await Promise.all(updatePromises)

    // Update product info file
    if (isNameChanged) {
      // Create new folder and copy files
      const oldFolderRef = storageRef(storage, `/Productos/${oldFolderName}`)
      const oldFiles = await listAll(oldFolderRef)

      // Copy all files to new location
      for (const file of oldFiles.items) {
        if (file.name === 'info.json') continue // Skip info.json as we'll create a new one
        const fileData = await getDownloadURL(file)
        const response = await fetch(fileData)
        const blob = await response.blob()
        const newFileRef = storageRef(storage, `/Productos/${newFolderName}/${file.name}`)
        await uploadBytes(newFileRef, blob)
      }

      // Delete old folder after successful transfer
      for (const file of oldFiles.items) {
        await deleteObject(file)
      }
    }

    // Save new info.json
    const infoRef = storageRef(
      storage,
      `/Productos/${isNameChanged ? newFolderName : oldFolderName}/info.json`
    )
    await uploadBytes(infoRef, new TextEncoder().encode(JSON.stringify(productInfo)))

    // After successful edit, refresh the search data
    await store.refreshSearchData()

    alert('Producto actualizado exitosamente')
    showEditModal.value = false

    // Reset search and refresh product list
    searchQuery.value = ''
    filteredProducts.value = []
    processedIds = []
    searchQuery.value = product.name
    await searchProducts()
  } catch (error) {
    console.error('Error saving changes:', error)
    alert('Error al guardar los cambios')
  }
}

const checkDuplicates = async () => {
  try {
    const productsRef = storageRef(storage, '/Productos')
    const folders = await listAll(productsRef)

    const productMap = new Map()

    folders.prefixes.forEach((prefix) => {
      const name = prefix.name.split(' - ')[1]
      const id = prefix.name.split(' - ')[0]

      if (productMap.has(name)) {
        productMap.get(name).push({ id, fullName: prefix.name })
      } else {
        productMap.set(name, [{ id, fullName: prefix.name }])
      }
    })

    const duplicates = Array.from(productMap.entries()).filter(
      ([_, products]) => products.length > 1
    )

    if (duplicates.length === 0) {
      alert('No se encontraron productos duplicados')
      return
    }

    // Process each duplicate group one by one
    for (const [name, products] of duplicates) {
      const shouldDelete = confirm(
        `Se encontró producto duplicado: "${name}"\n¿Quieres eliminar uno de los duplicados?`
      )

      if (shouldDelete) {
        const options = products.map((p, index) => `${index + 1}: ID ${p.id}`).join('\n')

        const selection = prompt(
          `Selecciona el número del producto a eliminar:\n${options}\n\nIngresa el número (1-${products.length}):`
        )

        const index = parseInt(selection) - 1
        if (isNaN(index) || index < 0 || index >= products.length) {
          alert('Selección inválida')
          continue
        }

        const productToDelete = products[index]
        try {
          // Delete product folder and contents
          const productRef = storageRef(storage, `/Productos/${productToDelete.fullName}`)
          const files = await listAll(productRef)

          // Delete all files in the product folder
          await Promise.all([
            ...files.items.map((file) => deleteObject(file)),
            ...files.prefixes.map(async (prefix) => {
              const subFiles = await listAll(prefix)
              return Promise.all(subFiles.items.map((file) => deleteObject(file)))
            })
          ])

          // Remove from categories
          for (const category of categories.value) {
            try {
              const categoryRef = storageRef(storage, `/${category}/${category}.txt`)
              const url = await getDownloadURL(categoryRef)
              const response = await fetch(url)
              let data = await response.text()

              // Remove product from category list
              const productEntry = `${productToDelete.id} - ${name},`
              data = data.replace(productEntry, '')

              // Ensure proper formatting
              data = data.trim()
              if (data) {
                data = ` ${data}`
              }

              await uploadBytes(categoryRef, new TextEncoder().encode(data))
            } catch (error) {
              console.error(`Error updating category ${category}:`, error)
            }
          }

          alert('Producto duplicado eliminado exitosamente')
        } catch (error) {
          console.error('Error deleting duplicate:', error)
          alert('Error al eliminar el producto duplicado')
        }
      }
    }
  } catch (error) {
    console.error('Error checking duplicates:', error)
    alert('Error al buscar duplicados')
  }
}

// Update the image preview function to handle multiple products
const previewImages = (event, productIndex) => {
  selectedFiles.value[productIndex] = Array.from(event.target.files)
  imagePreviewUrls.value[productIndex] = []

  selectedFiles.value[productIndex].forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreviewUrls.value[productIndex].push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

// Add method to initialize multiple products
const initializeMultipleProducts = () => {
  const count = parseInt(prompt('¿Cuántos productos deseas agregar?', '1'))
  if (!count || count < 1) {
    alert('Por favor ingresa un número válido mayor a 0')
    return
  }

  productCount.value = count
  products.value = Array(count)
    .fill()
    .map(() => ({
      id: '',
      name: '',
      description: '',
      includes: '',
      price_usd: '',
      price_bs: '',
      categories: [],
      images: [],
      outOfStock: false
    }))

  useAutoConversion.value = Array(count).fill(true)
  selectedFiles.value = Array(count).fill([])
  imagePreviewUrls.value = Array(count).fill([])

  showProductCountModal.value = false
}

const startEditCategory = async (category) => {
  editingCategory.value = {
    oldName: category,
    newName: category,
    image: null
  }

  // Try to load existing category image
  try {
    const imageRef = storageRef(storage, `/${category}`)
    const files = await listAll(imageRef)
    const imageFile = files.items.find((item) =>
      item.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)
    )

    if (imageFile) {
      const url = await getDownloadURL(imageFile)
      categoryImagePreview.value = url
    } else {
      categoryImagePreview.value = ''
    }
  } catch (error) {
    categoryImagePreview.value = ''
  }
}

const updateCategory = async () => {
  if (!editingCategory.value || !editingCategory.value.newName.trim()) return
  alert('Actualizando categoría...')
  try {
    const oldName = editingCategory.value.oldName
    const newName = editingCategory.value.newName.trim()

    // If only changing the image (same name)
    if (oldName === newName && categoryImageFile.value) {
      const fileExtension = categoryImageFile.value.name.split('.').pop()
      const imageRef = storageRef(storage, `/${oldName}/image.${fileExtension}`)
      await uploadBytes(imageRef, categoryImageFile.value)
      alert('Imagen de categoría actualizada exitosamente')
      return // Exit early for image-only updates
    }

    // If changing name (with or without new image)
    if (oldName !== newName) {
      // Prepare all promises for concurrent execution
      const promises = []

      // 1. Get old category content and prepare new category
      const oldCategoryRef = storageRef(storage, `/${oldName}/${oldName}.txt`)
      const contentPromise = getDownloadURL(oldCategoryRef)
        .then((url) => fetch(url))
        .then((response) => response.text())
        .catch(() => '') // Default to empty string if no content
        .then((content) => {
          const newCategoryRef = storageRef(storage, `/${newName}/${newName}.txt`)
          return uploadBytes(newCategoryRef, new TextEncoder().encode(content))
        })
      promises.push(contentPromise)

      // 2. Handle image transfer/upload
      if (categoryImageFile.value) {
        const fileExtension = categoryImageFile.value.name.split('.').pop()
        const newImageRef = storageRef(storage, `/${newName}/image.${fileExtension}`)
        promises.push(uploadBytes(newImageRef, categoryImageFile.value))
      } else {
        const imagePromise = listAll(storageRef(storage, `/${oldName}`))
          .then((res) => {
            const imageFile = res.items.find((item) =>
              item.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)
            )
            if (imageFile) {
              return getDownloadURL(imageFile)
                .then((url) => fetch(url))
                .then((response) => response.blob())
                .then((imageBlob) => {
                  const fileExtension = imageFile.name.split('.').pop()
                  const newImageRef = storageRef(storage, `/${newName}/image.${fileExtension}`)
                  return uploadBytes(newImageRef, imageBlob)
                })
            }
          })
          .catch((error) => console.log('No existing image to copy:', error))
        promises.push(imagePromise)
      }

      // 3. Update product references
      const updateRefsPromise = listAll(storageRef(storage, '/Productos')).then(async (res) => {
        const updatePromises = res.prefixes.map(async (folder) => {
          const infoRef = storageRef(storage, `/Productos/${folder.name}/info.json`)
          try {
            const url = await getDownloadURL(infoRef)
            const response = await fetch(url)
            const data = await response.json()

            let updated = false
            for (let i = 11; i < data.length; i++) {
              if (data[i] === oldName) {
                data[i] = newName
                updated = true
              }
            }

            if (updated) {
              return uploadBytes(infoRef, new TextEncoder().encode(JSON.stringify(data)))
            }
          } catch (error) {
            console.error(`Error updating product ${folder.name}:`, error)
          }
        })
        return Promise.all(updatePromises.filter(Boolean))
      })
      promises.push(updateRefsPromise)

      // Execute all operations concurrently
      await Promise.all(promises)

      // 4. Delete old category folder after successful transfer
      const oldFolder = storageRef(storage, `/${oldName}`)
      const oldFiles = await listAll(oldFolder)
      await Promise.all(oldFiles.items.map((file) => deleteObject(file)))

      alert(`Categoría "${oldName}" actualizada a "${newName}" exitosamente`)
    }

    // 5. Refresh UI
    categories.value = []
    await store.getClasses()
    categories.value = store.classes
    editingCategory.value = null
    categoryImageFile.value = null
    categoryImagePreview.value = ''
  } catch (error) {
    console.error('Error updating category:', error)
    alert('Error al actualizar la categoría')
  }
}

const refreshCategories = async () => {
  await store.getClasses()
  categories.value = store.classes
}

const handleCategoryImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    categoryImageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      categoryImagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleImageError = (event) => {
  event.target.src =
    'https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg'
  console.error('Failed to load image for category:', event.target.getAttribute('data-category'))
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

.management-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #e0e0e0;
}

.tab-button.active {
  background-color: #cda349;
  color: white;
}

.edit-products,
.manage-categories {
  margin-top: 2rem;
}

.search-box {
  margin-bottom: 1rem;
  display: flex;
}

.search-box input[type='search'] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  -webkit-appearance: none;
}

/* Remove the search cancel button in webkit browsers */
.search-box input[type='search']::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
}

.product-item,
.category-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
  border-radius: 4px;
}

.product-thumbnail {
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 1rem;
}

.product-info,
.category-info {
  flex-grow: 1;
}

.product-actions,
.category-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: 10px;
  width: -webkit-fill-available;
  justify-content: flex-end;
}

.edit-button,
.delete-button {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-button {
  background-color: #4285f4;
  color: white;
}

.delete-button {
  background-color: #dc3545;
  color: white;
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
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 4px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.add-category {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.add-category input {
  flex-grow: 1;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-button {
  padding: 0.75rem 1.5rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-product-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.save-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #218838;
}

.cancel-button:hover {
  background-color: #c82333;
}

.loading-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}

.image-previews {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.preview-container {
  position: relative;
  aspect-ratio: 1;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.add-multiple-button {
  margin-bottom: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-multiple-button:hover {
  background-color: #3367d6;
}

.product-form {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
}

.product-form h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
}

.categories-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.category-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.image-previews {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.preview-container {
  position: relative;
  aspect-ratio: 1;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ddd;
  margin-bottom: 0.5rem;
  border-radius: 4px;
}

.category-image-input {
  margin: 0.5rem 0;
}

.category-image-preview,
.category-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
}

.category-edit-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
}

.category-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.category-actions {
  display: flex;
  gap: 0.5rem;
}

.categories-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.category-checkbox {
  display: flex;
  align-items: center;
  gap: 5px;
}

.category-checkbox input[type='checkbox'] {
  margin: 0;
}

.category-checkbox label {
  margin: 0;
  cursor: pointer;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.checkbox-group input[type='checkbox'] {
  width: auto;
}

.checkbox-group label {
  margin: 0;
  cursor: pointer;
}
</style>
