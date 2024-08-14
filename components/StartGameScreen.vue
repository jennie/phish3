<template>
  <div class="start-screen h-screen flex flex-col justify-center items-center bg-black text-white">
    <div v-if="isLoading" class="loading-container w-full max-w-md px-4">
      <p class="text-2xl mb-4 text-center">Loading...</p>
      <div>
        <div class="mt-6" aria-hidden="true">
          <div class="overflow-hidden rounded-full bg-gray-200">
            <div class="h-2 rounded-full bg-green-400" :style="`width: ${loadingProgress}%`" />
          </div>

        </div>
      </div>
      <UProgress :value="loadingProgress" />
      <p class="text-center mt-2">{{ loadingProgress }}%</p>
    </div>
    <div v-else class="start-game">
      <UProgress :value="70" />
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

onMounted(async () => {
  await initializeGame();
  // Add a small delay to ensure the progress bar reaches 100% visually
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});

// Watch for changes in loadingProgress
watch(loadingProgress, (newValue) => {
  console.log(`Loading progress: ${newValue}%`);
});
</script>