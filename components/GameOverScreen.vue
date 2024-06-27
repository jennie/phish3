<template>
  <div class="game-over">
    <h1>Game Over</h1>
    <p>{{ gameOverReason }}</p>
    <button @click="restartGame">Play Again</button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGameState } from '../composables/gameState';

const { playerState, gameOver } = useGameState();

const gameOverReason = computed(() => {
  if (playerState.value.trust <= 0) return "You've lost all trust!";
  if (playerState.value.trust >= 100) return "You're too trusting!";
  if (playerState.value.security <= 0) return "Your security measures have failed!";
  if (playerState.value.security >= 100) return "Your security measures are too strict!";
  if (playerState.value.gooseInfiltration >= 100) return "The geese have taken over!";
  return "Game Over";
});

function restartGame() {
  // Implement restart logic
}
</script>

// File: src/App.vue
<template>
  <div id="app">
    <GameOverScreen v-if="gameOver" />
    <ReignsSwiper v-else />
  </div>
</template>

<script setup>
import ReignsSwiper from './components/ReignsSwiper.vue';
import GameOverScreen from './components/GameOverScreen.vue';
import { useGameState } from './composables/gameState';

const { gameOver } = useGameState();
</script>