import { defineStore } from 'pinia'
import router from '../router'
import emailjs from '@emailjs/browser';

export const Cart = defineStore('Cart', {
  state: () => ({
    router,
    showingCart: false,
    toAdd: 1,
    productsCart: [],
    total$: 0,
    totalBs: 0,
    formData: {}
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
    },

    buy(){
      if(this.productsCart.length == 0){
        alert("No hay productos en el carrito")
      }
      else{
        if(confirm("¿Está seguro de querer comprar estos productos del carrito?")){
          this.toogleCart({})
          router.push('/Ticket')
        }
      }
    },

    validate(){
      let errors = [];

      // Validate mobile form
      const mobileName = document.getElementById('name');
      const mobileLastName = document.getElementById('lastName');
      const mobileId = document.getElementById('id');
      const mobileEmail = document.getElementById('email');
      const mobileAddress = document.getElementById('address');
      const mobileCity = document.getElementById('city');
      const mobileState = document.getElementById('state');
      const mobilePhone = document.getElementById('phone');
      const mobileDelivery = document.querySelector('input[name="delivery"]:checked');
      const mobilePay = document.querySelector('input[name="pay"]:checked');

      // Validate PC form
      const pcName = document.getElementById('pc-name');
      const pcLastName = document.getElementById('pc-lastName');
      const pcId = document.getElementById('pc-id');
      const pcEmail = document.getElementById('pc-email');
      const pcAddress = document.getElementById('pc-address');
      const pcCity = document.getElementById('pc-city');
      const pcState = document.getElementById('pc-state');
      const pcPhone = document.getElementById('pc-phone');
      const pcDelivery = document.querySelector('input[name="delivery"]:checked');
      const pcPay = document.querySelector('input[name="pay"]:checked');

      if (!mobileName.value && !pcName.value) {
        errors.push('Nombre es requerido');
      }
      if (!mobileLastName.value && !pcLastName.value) {
        errors.push('Apellido es requerido');
      }

      const regex = /^[V|E|J|P][0-9]{5,9}$/;


      if (!regex.test(mobileId.value) && !regex.test(pcId.value)) {
        errors.push('Cédula es requerida y debe tener el formato correcto');
      }


      if ((!mobileEmail.value || !mobileEmail.value.includes('@')) && (!pcEmail.value || !pcEmail.value.includes('@'))) {
        errors.push('Correo electrónico es requerido y debe ser válido');
      }
      if (!mobileAddress.value && !pcAddress.value) {
        errors.push('Dirección es requerida');
      }
      if (!mobileCity.value && !pcCity.value) {
        errors.push('Ciudad es requerida');
      }
      if (!mobileState.value && !pcState.value) {
        errors.push('Estado es requerido');
      }

      const regexPhone = /^0(414|412|416|424|xxx|161|171)-[0-9]{7}$/

      if (!regexPhone.test(mobilePhone.value) && !regexPhone.test(pcPhone.value)) {
        errors.push('Teléfono es requerido y debe tener el formato correcto');
      }


      if (!mobileDelivery && !pcDelivery) {
        errors.push('Método de entrega es requerido');
      }
      if (!mobilePay && !pcPay) {
        errors.push('Método de pago es requerido');
      }

      if (errors.length > 0) {
        alert(errors.join('\n'));
        return false;
      }

      if (mobileName.value) {
        this.formData.name = mobileName.value;
        this.formData.lastName = mobileLastName.value;
        this.formData.id = mobileId.value;
        this.formData.email = mobileEmail.value;
        this.formData.address = mobileAddress.value;
        this.formData.city = mobileCity.value;
        this.formData.state = mobileState.value;
        this.formData.phone = mobilePhone.value;
        this.formData.delivery = mobileDelivery.value;
        this.formData.pay = mobilePay.value;
      } else {
        this.formData.name = pcName.value;
        this.formData.lastName = pcLastName.value;
        this.formData.id = pcId.value;
        this.formData.email = pcEmail.value;
        this.formData.address = pcAddress.value;
        this.formData.city = pcCity.value;
        this.formData.state = pcState.value;
        this.formData.phone = pcPhone.value;
        this.formData.delivery = pcDelivery.value;
        this.formData.pay = pcPay.value;
      }

      this.sendTicket()
    },

    sendTicket(){
      alert('Procesando el pago...')
      let productsList = `<ul>${this.productsCart.map((product) => {
        return `<li>${product[1][1]} - ${product[0]} Unidad(es) - ${product[1][2] * product[0]}$ / ${product[1][3] * product[0]} Bs</li>`;
      }).join('')}</ul>`

      let params = {
        toEmail: this.formData.email,
        products: productsList,
        price$: this.total$,
        priceBs: this.totalBs,
        html: true
      }

      emailjs.init({
        publicKey: "2y11hxIM5PO5Jrdux",
      })

      emailjs.send('service_bhdgl7o', 'template_e76ijex',params)
      .then(() => {
        params = {
          products: productsList,
          price$: this.total$,
          priceBs: this.totalBs,
          name: this.formData.name,
          lastName: this.formData.lastName,
          CI: this.formData.id,
          email: this.formData.email,
          city: this.formData.city,
          address: this.formData.address,
          state: this.formData.state,
          phoneNumber: this.formData.phone,
          delivery: this.formData.delivery,
          pay: this.formData.pay
        }
        emailjs.send('service_bhdgl7o', 'template_rl40103',params)
        .then(()=>{
          alert('Tu pedido ha sido confirmado, se te ha enviado un correo con la información del encargo')
          this.productsCart = []
          this.total$ = 0,
          this.totalBs = 0,
          this.formData = {}
          router.push('/')
        })
      })
    }
  }
})