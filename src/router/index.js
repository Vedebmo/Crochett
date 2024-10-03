import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Template from '../views/Template.vue'
import Product from '../views/Product.vue'
import Ticket from '../views/Ticket.vue'
import Update from '../views/Update.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:catchAll(.*)',
      name: 'error',
      component: HomeView
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/' + encodeURI('Categoría/:class'),
      name: 'template',
      component: Template
    },
    {
      path: '/Producto/:product',
      name: 'product',
      component: Product
    },
    {
      path: '/Ticket',
      name: 'Ticket',
      component: Ticket
    },
    {
      path: '/Update',
      name: 'Update',
      component: Update
    }
  ]
})

export default router
