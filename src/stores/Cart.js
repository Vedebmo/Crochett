import { defineStore } from 'pinia'

export const Cart = defineStore('Cart', {
  state: () => ({
    toAdd: 1
  }),

  actions:{
    ChangeAdd(operation){
        operation == "more" ? this.toAdd += 1 : (
            this.toAdd > 1 ? this.toAdd -= 1 : this.toAdd
        )
    }
  }
})