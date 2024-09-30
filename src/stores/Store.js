import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const Store = defineStore('Store', {
  state: () => ({
    showingMenu: false,
    classes: ["Stock", "Floristería", "Combos", "Peluches y Llaveros", "Navidad", "Agrégale a tu pedido", "Ropa Tejida"],
  }),

  actions:{
    toogleMenu(){
      let lastPosition = window.scrollY
      this.showingMenu = !this.showingMenu
      if(this.showingMenu && document.documentElement.clientWidth < 601){
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