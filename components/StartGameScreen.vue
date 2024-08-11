<template>
  <div class="start-screen">
    <div v-if="isLoading" class="loading-message">
      <p>Loading...</p>
    </div>
    <div v-else class="start-game">
      <button @click="startGame" class="bg-white text-zinc-800 rounded-full px-4 py-2 mt-6">Start
        Game</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useGameState } from '@/composables/gameState';

const { initializeGame, gameStarted } = useGameState();
const isLoading = ref(true);

const startGame = () => {
  gameStarted.value = true;
};

onMounted(async () => {
  await initializeGame(); // Preload all assets
  isLoading.value = false; // Hide the loading message once done
});
</script>

<style>
.loading-message {
  font-size: 2rem;
  color: white;
  text-align: center;
  margin-top: 50%;
}

.start-game {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
