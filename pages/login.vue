<template>
  <div class="start-screen h-screen flex flex-col justify-center items-center bg-red-600 text-gray-100">
    <svg width="276px" height="118px" viewBox="0 0 276 118" version="1.1" xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink">
      <!-- SVG content remains the same as in the original code -->
    </svg>

    <div class="w-full max-w-md px-4 text-center">
      <h2 class="text-2xl mb-2 text-center font-display mt-12">Login Error</h2>
      <p class="text-xl mb-4">{{ errorMessage }}</p>
      <button @click="goToHome"
        class="bg-white text-zinc-800 rounded-full px-6 py-3 text-lg font-semibold hover:bg-gray-200 transition-colors">
        Go back to login
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const errorMessage = ref('')

const errorMessages = {
  missing_token: 'Login token is missing. Please try again.',
  invalid_token: 'Invalid login token. Please request a new login link.',
  user_not_found: 'User not found. Please check your email or sign up.',
  default: 'An error occurred. Please try again.'
}

onMounted(() => {
  const error = route.query.error as string
  if (error) {
    errorMessage.value = errorMessages[error] || errorMessages.default
  }
})

const goToHome = () => {
  router.push('/')
}
</script>