import { defineStore } from 'pinia'
import { init } from '../firebase.js'
import router from '../router'

init()

import { getStorage, uploadBytes, ref, listAll, getDownloadURL } from 'firebase/storage'
const storage = getStorage()
const storageRef = ref(storage, '/Excel/Archivo')
import * as XLSX from 'xlsx'

let lastPosition

import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup
} from 'firebase/auth'

export const Store = defineStore('Store', {
  state: () => ({
    router,
    currentPage: 1,
    showingMenu: false,
    dataLoaded: false,
    classes: [],
    headersTitles: [],
    products: [],
    productsToShow: [],
    isLoading: true,
    actualSite: '',
    previewSite: '',
    classesImages: [],
    imagesToShow: [],
    imagesProduct: [],
    searchedImages: [],
    tempData: ''
  }),

  actions: {
    toogleMenu() {
      let lastPosition = window.scrollY
      this.showingMenu = !this.showingMenu
      if (this.showingMenu && document.documentElement.clientWidth < 601) {
        window.scrollTo(0, 0)
        document.querySelector('html').style.overflow = 'clip'
      } else {
        if (!window.scrollY) {
          window.scrollTo(0, lastPosition)
        }
        document.querySelector('html').style.overflow = 'revert-layer'
      }
    },
    ulpoadExcel() {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      setPersistence(auth, browserLocalPersistence).then(() => {
        signInWithPopup(auth, provider).then((result) => {
          if (result.user.email !== 'crochettaccesories@gmail.com') {
            result.user.delete().then(() => {
              alert('No tienes acceso a esta función')
            })
          } else {
            let file = document.querySelector('#fileUpload').files[0]
            if (
              file == undefined ||
              file.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ) {
              alert('No has seleccionado un excel')
            } else {
              const reader = new FileReader()
              reader.onload = () => {
                const workbook = XLSX.read(reader.result, { type: 'binary' })
                const worksheet = workbook.Sheets['Hoja1']
                if (worksheet) {
                  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
                  const headers = data[0]

                  for (let index = 1; index < data.length; index++) {
                    if (index == 1) {
                      this.products.push({ ...data[index], [0]: null })
                    } else {
                      this.products.push(data[index])
                    }
                  }

                  for (let index = 0; index < headers.length; index++) {
                    if (headers[index]) {
                      this.headersTitles.push(headers[index])
                    }
                  }
                  this.update(file)
                }
              }
              reader.readAsBinaryString(file)
            }
          }
        })
      })
    },

    update(file) {
      let keyToHeader = {}
      uploadBytes(storageRef, file)
        .then(() => {
          this.headersTitles.forEach((header, index) => {
            if (index > 6) {
              const folderRef = ref(storage, `/${header}/.dummy`)
              const dummyFile = new Uint8Array(0)
              uploadBytes(folderRef, dummyFile)
            }
          })
        })
        .then(() => {
          for (let header of this.headersTitles) {
            let variableName = header.replace(/\s+/g, '') // remove spaces and create a valid variable name

            this[variableName] = [] // create a property on the current object
          }

          let offset = 4
          for (let i = 7; i < this.headersTitles.length; i++) {
            keyToHeader[i + offset] = this.headersTitles[i] // assuming keys start from 1
            offset++
          }

          this.products.forEach((product, index) => {
            const productJson = JSON.stringify(product)
            const productArray = Object.keys(product).map((key) => ({ [key]: product[key] }))

            productArray.forEach((obj) => {
              Object.keys(obj).forEach((key) => {
                if (parseInt(key) > 10) {
                  const header = keyToHeader[parseInt(key)]
                  if (!this[header]) {
                    this[header] = [] // initialize the property as an empty array
                  }
                  this[header].push(`${product[2]} - ${product[3]}, `)
                }
              })
            })

            const productRef = ref(storage, `/Productos/${index + 1} - ${product[3]}/info.json`)
            uploadBytes(productRef, new TextEncoder().encode(productJson))
          })
        })
        .then(() => {
          Object.values(keyToHeader).forEach((header) => {
            const file = new File(this[header], `${header}.txt`, { type: 'text/plain' })
            const storageRef = ref(storage, `${header}/${header}.txt`)
            uploadBytes(storageRef, file)
          })
        })
        .then(() => {
          alert('Listo, archivo subido')
        })
    },

    getClasses() {
      // Clear existing data
      this.classes = []
      this.classesImages = []

      const storageRef = ref(storage, '/')
      listAll(storageRef)
        .then((res) => {
          res.prefixes.forEach((category) => {
            if (category.name !== 'Excel' && category.name !== 'Productos') {
              this.classes.push(category.name)
            }
          })
        })
        .then(() => {
          this.getClassesImages()
        })
    },

    getClassesImages() {
      this.classes.forEach((category, index) => {
        const storageRef = ref(storage, `/${category}`)
        listAll(storageRef).then((res) => {
          res.items.forEach((item) => {
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
            const itemName = item.name.toLowerCase()

            if (imageExtensions.some((ext) => itemName.endsWith(ext))) {
              getDownloadURL(item).then((url) => {
                this.classesImages[index] = url
              })
            }
          })
        })
      })
    },

    async getProducts(category) {
      this.productsToShow = []
      this[category] = []
      this.actualSite = router.currentRoute.value.fullPath
      const storageRef = ref(storage, `${category}/${category}.txt`)
      const url = await getDownloadURL(storageRef)
      const response = await fetch(url)
      let data = await response.text()

      // Split by comma and clean each item
      data = data
        .trim()
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0) // Remove empty entries

      this[category] = data

      // Clear and refetch all product data
      this.productsToShow = []

      for (let index = 0; index < data.length; index++) {
        const productRef = ref(storage, `/Productos/${data[index].replace(/,+$/, '')}/info.json`)
        try {
          const productUrl = await getDownloadURL(productRef)
          const productResponse = await fetch(productUrl)
          const productData = await productResponse.json()
          this.productsToShow.push(productData)
        } catch (error) {
          console.error('Error fetching product:', error)
        }
      }

      if (
        (this.previewSite == this.actualSite || this.previewSite == '') &&
        this.actualSite !== ''
      ) {
        this.getProductsImages()
      } else {
        this.previewSite = ''
        this.productsToShow = []
      }
    },

    getProductsImages() {
      this.productsToShow.forEach((product, index) => {
        let found = false
        const storageRef = ref(storage, `/Productos/${product[2]} - ${product[3]}/`)
        listAll(storageRef).then((res) => {
          res.items.forEach((item) => {
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
            const itemName = item.name.toLowerCase()

            if (imageExtensions.some((ext) => itemName.endsWith(ext))) {
              getDownloadURL(item).then((url) => {
                if (!found) {
                  this.imagesToShow[index] = url
                  found = true
                }
              })
            }
          })
        })
      })
      this.dataLoaded = true
    },

    search(e) {
      if (e.key == 'Enter') {
        let productSearched = document.querySelector('#input').value
        const storageRef = ref(storage, '/Productos')
        let found
        let names = []
        listAll(storageRef)
          .then((res) => {
            res.prefixes.forEach((item) => {
              names.push(item.name)
            })
          })
          .then(() => {
            const productNameRegex = /([^-\s]+)$/i
            const productName = productNameRegex.exec(productSearched)

            found = names.filter((name) => {
              const regex = new RegExp(productName[1], 'i')
              return regex.test(name)
            })

            //Check even when misspelled
            if (found.length == 0) {
              const levenshteinDistance = (a, b) => {
                const m = a.length
                const n = b.length
                const d = new Array(m + 1).fill(null).map(() => new Array(n + 1).fill(null))

                for (let i = 0; i <= m; i++) {
                  d[i][0] = i
                }
                for (let j = 0; j <= n; j++) {
                  d[0][j] = j
                }

                for (let i = 1; i <= m; i++) {
                  for (let j = 1; j <= n; j++) {
                    const cost = a[i - 1] === b[j - 1] ? 0 : 1
                    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
                  }
                }

                return d[m][n]
              }

              found = names.filter(
                (name) =>
                  levenshteinDistance(name.toLowerCase(), productSearched.toLowerCase()) <= 2
              )
            }
          })
          .then(() => {
            this.searchedImages = []
            document.querySelector('#input').value = ''
            if (found.length == 0) {
              alert('No se han encontrado resultados')
              document.getElementById('search-modal').classList.remove('show')
              return
            }
            // Show the modal with the results
            const modal = document.getElementById('search-modal')
            const resultsList = document.getElementById('search-results')
            resultsList.innerHTML = '' // clear the list
            let result
            for (let index = 0; index < found.length; index++) {
              result = found[index]
              const listItem = document.createElement('li')
              const storageRef = ref(storage, `/Productos/${result}/info.json`)
              getDownloadURL(storageRef).then((url) => {
                fetch(url).then((response) => {
                  response.json().then((data) => {
                    if (data[11] === undefined) {
                      return
                    }
                    const storageRef2 = ref(storage, `/Productos/${data[2]} - ${data[3]}/`)
                    let imgFound = false
                    listAll(storageRef2).then((res) => {
                      res.items.forEach((item) => {
                        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
                        const itemName = item.name.toLowerCase()

                        if (imageExtensions.some((ext) => itemName.endsWith(ext))) {
                          getDownloadURL(item).then((url) => {
                            if (!imgFound) {
                              this.searchedImages[data[2]] = url
                              imgFound = true
                              listItem.innerHTML = `
                                <img src='${this.searchedImages[data[2]]}' style="width:100%;max-height:50vh">
                                <h1 style="text-align: center">${data[3]}</h1>
                                <h3 style="text-align: center">Precio: ${data[9]}$ ó ${data[10]} Bs</h3>
                                `
                              listItem.style = 'margin-bottom: 30px; cursor: pointer'
                              resultsList.appendChild(listItem)

                              listItem.addEventListener('click', () => {
                                this.closeSearch()
                                router.push({
                                  path: `/Producto/${data[2]} - ${data[3]}`,
                                  query: {
                                    productInfo: data
                                  }
                                })
                              })
                            }
                          })
                        }
                      })
                    })
                  })
                })
              })
            }
            modal.classList.add('show')
            lastPosition = window.scrollY
            window.scrollTo(0, 0)
            document.querySelector('html').style.overflow = 'clip'
          })
      }
    },

    closeSearch() {
      document.getElementById('search-modal').classList.remove('show')
      window.scrollTo(0, lastPosition)
      document.querySelector('html').style.overflow = 'revert-layer'
      document.querySelector('#search-modal').style = 'display: none'
    },

    async getInfo(id) {
      this.tempData = ''
      const storageRef = ref(storage, `/Productos/${id}/info.json`)
      const url = await getDownloadURL(storageRef)
      const response = await fetch(url)
      const data = await response.json()
      return data
    },

    getImagesProduct(id) {
      const storageRef = ref(storage, `/Productos/${id}/`)
      listAll(storageRef).then((res) => {
        res.items.forEach((item) => {
          const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
          const itemName = item.name.toLowerCase()

          if (imageExtensions.some((ext) => itemName.endsWith(ext))) {
            getDownloadURL(item).then((url) => {
              this.imagesProduct.push(url)
            })
          }
        })
      })
    },

    async refreshSearchData() {
      // Clear existing search data
      this.searchedImages = []

      // Re-initialize search-related data
      const storageRef = ref(storage, '/Productos')
      try {
        const res = await listAll(storageRef)
        // Update the products list for search
        this.products = res.prefixes.map((prefix) => prefix.name)
      } catch (error) {
        console.error('Error refreshing search data:', error)
      }
    }
  }
})
