<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <main>
    <h1>Home</h1>

    <p>Você está autenticado.</p>

    <p v-if="authStore.user">
      Bem-vindo, {{ authStore.user.name }}.
    </p>

    <button @click="handleLogout">
      Sair
    </button>
  </main>
</template>
