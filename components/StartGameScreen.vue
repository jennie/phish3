<template>
  <div class="start-screen text-white text-center">
    <h1>Welcome to the Game!</h1>
    <button @click="startGame" class="bg-white text-zinc-800 rounded-full px-4 py-2 mt-6">Start Game</button>
  </div>
</template>

<script setup>
import { useGameState } from '../composables/gameState';

const { startGame } = useGameState();
</script>
