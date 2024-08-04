<template>
  <div class="game-over-screen flex flex-col items-center justify-center text-white">
    <img :src="gameOverArt" alt="Game Over Art" class="mb-4" />
    <h1 class="text-3xl font-bold mb-2">{{ gameOverTitle }}</h1>
    <p class="text-xl mb-4">{{ gameOverText }}</p>
    <p class="text-lg mb-6">Your Score: {{ finalScore }}</p>
    <button @click="restartGame" class="bg-red-500 px-6 py-2 rounded-full hover:bg-red-600">Play Again</button>
  </div>
</template>

<script>
export default {
  props: {
    finalScore: {
      type: Number,
      required: true
    }
  },
  computed: {
    gameOverArt() {
      if (this.finalScore >= 20) {
        return '/path/to/high-score-art.png';
      } else if (this.finalScore >= 16) {
        return '/path/to/medium-score-art.png';
      } else {
        return '/path/to/low-score-art.png';
      }
    },
    gameOverTitle() {
      if (this.finalScore >= 20) {
        return 'Congratulations!';
      } else if (this.finalScore >= 16) {
        return 'Wow, Great Job!';
      } else {
        return 'Better Luck Next Time!';
      }
    },
    gameOverText() {
      if (this.finalScore >= 20) {
        return 'Perfect score! You are now eligible for the contest!';
      } else if (this.finalScore >= 16) {
        return 'You did ok, but there\'s room for improvement. Keep trying!';
      } else {
        return 'Not so good. Try again and see if you can do better!';
      }
    }
  },
  methods: {
    restartGame() {
      this.$emit('restart-game');
    }
  }
};
</script>

<style scoped>
.game-over-screen {
  background-color: black;
  height: 100vh;
  padding: 20px;
  text-align: center;
}
</style>
