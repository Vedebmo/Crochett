import { defineStore } from 'pinia'

export const Cart = defineStore('Cart', {
  state: () => ({
    showingCart: false,
    toAdd: 1,
    productsCart: [],
    total$: 0,
    totalBs: 0
  }),

  actions:{
    ChangeAdd(operation){
        operation == "more" ? this.toAdd += 1 : (
            this.toAdd > 1 ? this.toAdd -= 1 : this.toAdd
        )
    },
    toogleCart(product){
      if(product[0] == "Add"){
        this.addToCart(product[1])
      }
      let lastPosition = window.scrollY
      this.showingCart = !this.showingCart
      if(this.showingCart && document.documentElement.clientWidth < 601){
        window.scrollTo(0, 0)
        document.querySelector("html").style.overflow = "clip"
      }
      else{
        if(!window.scrollY){
          window.scrollTo(0, lastPosition)
        }
        document.querySelector("html").style.overflow = "revert-layer"
      }
    },
    addToCart(product){
      let productIndex = product[2]
      let productName = product[3]
      let price$ = product[9]
      let priceBs = product[10]
      const productToAdd = [productIndex,productName,price$,priceBs]

      if(this.productsCart.find(item => item[1][0] == productIndex)){
        if(confirm("Este producto ya fue añadido, ¿Quieres añadirlo igual?")){
          this.productsCart.push([this.toAdd,productToAdd])
          this.toAdd = 1
          this.calcTotal()
        }
      }
      else{
        this.productsCart.push([this.toAdd,productToAdd])
        this.toAdd = 1
        this.calcTotal()
      }
    },

    calcTotal(){
      this.total$ = 0
      this.totalBs = 0
      this.productsCart.forEach((product)=>{
        this.total$ += parseInt(product[1][2])*parseInt(product[0])
        this.totalBs += parseInt(product[1][3])*parseInt(product[0])
      })
    },

    deleteCart(id){
      if(confirm("¿Está seguro de querer eliminar el producto del carrito?")){
        this.productsCart.splice(id,1)
        this.calcTotal()
      }
    }
  }
})