<template>
  <div class="game-over-screen flex flex-col items-center justify-center text-white">
    <!-- <img :src="gameOverArt" alt="Game Over Art" class="mb-4" /> -->
    <img src="/images/reelPolytechnicLogo.png" alt="Reel Polytechnic Logo" class=" max-w-72 mb-4" />
    <h1 class="text-3xl font-bold mb-2">{{ gameOverTitle }}</h1>
    <p class="text-xl mb-4">{{ gameOverText }}</p>
    <p class="text-lg mb-2">Your Score: {{ finalScorePercentage }}%</p>
    <p class="text-lg mb-6">Best Score: {{ bestScorePercentage }}%</p>
    <p v-if="isNewBestScore" class="text-lg font-bold text-yellow-400 mb-6">New Best Score!</p>
    <button @click="restartGame" class="bg-blue-500 px-6 py-2 rounded-full hover:bg-blue-600">Play Again</button>
  </div>
</template>

<script>
import confetti from 'canvas-confetti';

export default {
  props: {
    finalScore: {
      type: Number,
      required: true
    },
    isNewBestScore: {
      type: Boolean,
      required: true
    }
  },
  mounted() {
    this.checkAndTriggerConfetti();
  },
  computed: {
    bestScorePercentage() {
      const user = useUserSession().user;
      console.log('user', user);
      return user.value.bestScore > 0 ? (user.value.bestScore / 20) * 100 : 0;
    },
    finalScorePercentage() {
      return (this.finalScore / 20) * 100;
    },
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
      if (this.isNewBestScore) {
        return 'New Personal Best!';
      } else if (this.finalScore >= 20) {
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
    async restartGame() {
      try {
        const response = await fetch('/api/update-score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ score: this.finalScore }),
        });

        if (!response.ok) {
          throw new Error('Failed to update score');
        }

        const result = await response.json();
        console.log('Score updated:', result);

        if (result.finalScore > 16 || result.isNewBestScore) {
          this.triggerConfetti();
        }

        // Emit the restart-game event
        this.$emit('restart-game');
      } catch (error) {
        console.error('Error updating score:', error);
      }
    },
    triggerConfetti() {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.5, y: 0.5 }
      });
    },
    checkAndTriggerConfetti() {
      if (this.finalScore > 16 || this.isNewBestScore) {
        this.triggerConfetti();
      }
    }
  }
};
</script>

<style scoped>
.game-over-screen {
  background-image: url('/images/home-bg.png');
  height: 100vh;
  padding: 20px;
  text-align: center;
}
</style>