// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { init } from '../firebase.js';
init()

import { getStorage, uploadBytes, ref, listAll } from 'firebase/storage'
const storage = getStorage();
const storageRef = ref(storage, '/Excel/Archivo');
import * as XLSX from 'xlsx';

import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence, signInWithPopup } from 'firebase/auth';

export const Store = defineStore('Store', {
  state: () => ({
    showingMenu: false,
    classes: [],
    headersTitles: [],
    products: []
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
    },
    ulpoadExcel(){
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      setPersistence(auth, browserLocalPersistence)
      .then(()=>{
        signInWithPopup(auth, provider)
        .then((result) => {
          if(result.user.email !== 'vedebmo@gmail.com'){
            result.user.delete().then(() => {
              alert('No tienes acceso a esta función');
            })
          }
          else{
            let file = document.querySelector('#fileUpload').files[0]
            if(file == undefined || file.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
              alert('No has seleccionado un excel')
            }
            else{
              const reader = new FileReader();
              reader.onload = () => {
                const workbook = XLSX.read(reader.result, { type: 'binary' });
                const worksheet = workbook.Sheets['Hoja1'];
                if(worksheet){
                  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                  const headers = data[0];

                  for (let index = 1; index < data.length; index++) {
                    if(index == 1){
                      this.products.push({ ...data[index], [0]: null })
                    }
                    else{
                      this.products.push(data[index])
                    }
                  }

                  for (let index = 0; index < headers.length; index++) {
                    if(headers[index]){
                      this.headersTitles.push(headers[index])
                    }
                  }
                  this.update(file)
                }
              };
              reader.readAsBinaryString(file);
            }
          }
        })
      })

    },

    update(file) {
      uploadBytes(storageRef, file)
      .then(() => {
        this.headersTitles.forEach((header,index) => {
          if(index > 6){
            const folderRef = ref(storage, `/${header}/.dummy`);
            const dummyFile = new Uint8Array(0);
            uploadBytes(folderRef, dummyFile)
          }
        });
      })
      .then(()=>{
        this.products.forEach((product, index) => {
          const productJson = JSON.stringify(product);
          const productRef = ref(storage, `/Productos/${index + 1} - ${product[3]}/info.json`);
          uploadBytes(productRef, new TextEncoder().encode(productJson))
        })
      })
      .then(()=>{
        alert("Listo, archivo subido")
      })
    },

    getClasses(){
      const storageRef = ref(storage, '/');
      listAll(storageRef)
      .then((res)=>{
        res.prefixes.forEach((category)=>{
          if(category.name !== 'Excel' && category.name !== "Productos"){
            this.classes.push(category.name)
          }
        })
      })
    }
  }
})