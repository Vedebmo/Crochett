import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:catchAll(.*)',
      name: 'error',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/' + encodeURI('Categoría/:class'),
      name: 'template',
      component: () => import('@/views/Template.vue')
    },
    {
      path: '/Producto/:product',
      name: 'product',
      component: () => import('@/views/Product.vue')
    },
    {
      path: '/Ticket',
      name: 'Ticket',
      component: () => import('@/views/Ticket.vue')
    },
    {
      path: '/Update',
      name: 'Update',
      component: () => import('@/views/Update.vue')
    }
  ]
})

export default router
