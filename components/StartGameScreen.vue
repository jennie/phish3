<template>
  <div class="start-screen h-screen flex flex-col justify-center items-center bg-black text-white">
    <div v-if="isLoading" class="loading-container w-full max-w-md px-4 text-center">
      <p class="text-2xl mb-4">Loading...</p>
      <!-- Tailwind Spinner -->
      <div class="flex justify-center items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-green-400"></div>
      </div>
    </div>

    <div v-else class="start-game">
      <button @click="startGame"
        class="bg-white text-zinc-800 rounded-full px-6 py-3 text-lg font-semibold hover:bg-gray-200 transition-colors">
        Start Game
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useGameState } from '@/composables/gameState';

const { initializeGame, gameStarted, loadingProgress } = useGameState();
const isLoading = ref(true);

const startGame = () => {
  gameStarted.value = true;
};

// Load scenarios on mount and handle loading state
onMounted(async () => {
  await initializeGame();
  setTimeout(() => {
    isLoading.value = false;
  }, 500); // A small delay to ensure smoother transition after loading
});
</script>
