<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const error = ref<string | null>(null)

async function handleSubmit() {
  error.value = null

  try {
    await authStore.login(form)
    router.push({ name: 'verify-2fa' })
  } catch {
    error.value = 'E-mail ou senha inválidos.'
  }
}
</script>

<template>
  <main>
    <h1>Login</h1>

    <form @submit.prevent="handleSubmit">
      <input v-model="form.email" type="email" placeholder="E-mail" required />
      <input v-model="form.password" type="password" placeholder="Senha" required />

      <button type="submit" :disabled="authStore.loading">
        {{ authStore.loading ? 'Entrando...' : 'Entrar' }}
      </button>

      <p v-if="error">{{ error }}</p>
    </form>
  </main>
</template>
