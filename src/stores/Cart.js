import { defineStore } from 'pinia'

export const Cart = defineStore('Cart', {
  state: () => ({
    showingCart: false,
    toAdd: 1
  }),

  actions:{
    ChangeAdd(operation){
        operation == "more" ? this.toAdd += 1 : (
            this.toAdd > 1 ? this.toAdd -= 1 : this.toAdd
        )
    },
    toogleCart(){
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
    }
  }
})