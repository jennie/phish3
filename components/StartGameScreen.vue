<template>
  <div class="start-screen h-screen flex flex-col justify-center items-center bg-black text-white">
    <div v-if="isLoading" class="loading-container w-full max-w-md px-4 text-center">
      <p class="text-2xl mb-4">Loading...</p>
      <!-- Tailwind Spinner -->
      <div class="flex justify-center items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-green-400"></div>
      </div>
    </div>

    <div v-else class="start-game w-full max-w-md px-4">
      <AuthState v-slot="{ loggedIn, user, clear }">
        <div v-if="loggedIn" class="text-center">
          <p class="text-xl mb-4">Welcome, {{ user.email }}!</p>
          <p class="mb-4">Your best score: {{ user.bestScore }}</p>
          <button @click="startGame"
            class="bg-white text-zinc-800 rounded-full px-6 py-3 text-lg font-semibold hover:bg-gray-200 transition-colors mb-4">
            Start Game
          </button>
          <button @click="logout"
            class="bg-red-500 text-white rounded-full px-6 py-3 text-lg font-semibold hover:bg-red-600 transition-colors">
            Logout
          </button>
        </div>
        <div v-else>
          <h2 class="text-2xl mb-4 text-center">Enter Your Seneca Email to Play</h2>
          <p class="text-sm mb-4 text-center">New to Reel Polytechnic? We'll create an account for you!</p>
          <form @submit.prevent="requestLogin" class="flex flex-col items-center">
            <input v-model="email" type="email" placeholder="Your Seneca Email" required
              class="w-full px-4 py-2 mb-4 text-black rounded">
            <button type="submit"
              class="bg-white text-zinc-800 rounded-full px-6 py-3 text-lg font-semibold hover:bg-gray-200 transition-colors">
              Send Login Link
            </button>
          </form>
        </div>
      </AuthState>
    </div>

    <div v-if="loginMessage" class="mt-4 text-center text-green-400">
      {{ loginMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useGameState } from '@/composables/gameState';
import { useUserSession } from '#imports';

const { initializeGame, gameStarted, loadingProgress } = useGameState();
const { clear, fetch: fetchSession } = useUserSession();
const isLoading = ref(true);
const email = ref('');
const loginMessage = ref('');

const startGame = () => {
  gameStarted.value = true;
};

const requestLogin = async () => {
  try {
    await $fetch('/api/auth/login-request', {
      method: 'POST',
      body: { email: email.value }
    });
    loginMessage.value = 'Login link sent to your email. If this is your first time, we\'ve created an account for you. Please check your inbox.';
    email.value = '';
  } catch (error) {
    console.error('Login request failed:', error);
    loginMessage.value = 'Failed to send login link. Please try again.';
  }
};

const logout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' });
    await clear();
    loginMessage.value = 'Logged out successfully.';
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// Load scenarios on mount and handle loading state
onMounted(async () => {
  await initializeGame();
  await fetchSession();
  setTimeout(() => {
    isLoading.value = false;
  }, 500); // A small delay to ensure smoother transition after loading
});
</script>