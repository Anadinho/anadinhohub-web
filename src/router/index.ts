import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import LoginView from '../views/LoginView.vue'
import VerifyTwoFactorView from '../views/VerifyTwoFactorView.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        guest: true,
      },
    },
    {
      path: '/verify-2fa',
      name: 'verify-2fa',
      component: VerifyTwoFactorView,
      meta: {
        guest: true,
      },
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchMe()
    } catch {
      await authStore.logout()
      return { name: 'login' }
    }
  }

  if (to.meta.requiresAuth && !authStore.token) {
    return { name: 'login' }
  }

  if (to.meta.guest && authStore.token) {
    return { name: 'home' }
  }
})

export default router
