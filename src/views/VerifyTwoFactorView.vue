<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  code: '',
})

const error = ref<string | null>(null)

async function handleSubmit() {
  error.value = null

  if (!authStore.pendingEmail) {
    router.push({ name: 'login' })
    return
  }

  try {
    await authStore.verifyTwoFactor({
      email: authStore.pendingEmail,
      code: form.code,
    })

    router.push({ name: 'home' })
  } catch {
    error.value = 'Código inválido ou expirado.'
  }
}
</script>

<template>
  <main>
    <h1>Verificação em duas etapas</h1>

    <p>Digite o código enviado para seu e-mail.</p>

    <form @submit.prevent="handleSubmit">
      <input
        v-model="form.code"
        type="text"
        maxlength="6"
        placeholder="Código de 6 dígitos"
        required
      />

      <button type="submit" :disabled="authStore.loading">
        {{ authStore.loading ? 'Validando...' : 'Validar código' }}
      </button>

      <p v-if="error">{{ error }}</p>
    </form>
  </main>
</template>
