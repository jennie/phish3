<!-- components/RecapSwiper.vue -->
<template>
  <Transition name="fade" mode="out-in">
    <div v-if="!isTransitioningToGameOver" class="flex flex-col h-dvh justify-between">
      <TransitionCard v-if="isTransitionCardVisible" :game-stage="'recap'" :is-last-regular-scenario="true"
        @proceed="handleMoveToNextStage" />

      <!-- Floating Text Container -->
      <div class="flex-none h-1/6 flex items-center justify-center pointer-events-none px-6">
        <p class="text-2xl font-display text-white leading-snug text-center">
          Review your choices
        </p>
      </div>

      <!-- Slides/Cards Container -->
      <div class="flex-grow absolute h-full w-full flex items-center justify-center overflow-hidden">
        <swiper-container v-if="isDataReady" ref="swiperRef" :modules="modules" effect="tinder" :slides-per-view="1"
          :allow-touch-move="true" observer observer-parents :init="false" class="w-full h-full">
          <swiper-slide v-for="scenario in filteredScenarios" :key="scenario.id"
            class="flex items-center justify-center">
            <div class="card-container relative">
              <div
                class="card-face absolute inset-0 rounded-3xl overflow-hidden transition-transform duration-600 border-8 border-white mfa-reveal-card">
                <div class="h-full absolute inset-0 bg-cover bg-center"
                  :style="{ backgroundImage: `url(${getScenarioImage(scenario)})` }">
                  <div
                    class="h-full absolute inset-0 bg-opacity-90 flex flex-col overflow-y-auto justify-between bg-stone-200">
                    <div class="flex flex-col h-full justify-between">
                      <!-- Sash container -->
                      <div class="top-0 left-0 w-full overflow-hidden">
                        <!-- Sash -->
                        <div :class="[
                          'w-full text-center font-display py-4 text-white text-2xl font-bold uppercase',
                          getScoreChange(scenario) === 1 ? 'bg-green-500' : 'bg-red-500'
                        ]">
                          {{ getScoreChange(scenario) === 1 ? 'Correct!' : 'Incorrect!' }}
                        </div>
                      </div>
                      <div class="flex flex-col justify-between">
                        <div class="p-3">
                          <p class="text-center text-lg text-white mb-1 flex flex-col items-center justify-center">
                            <span class="text-lg rounded-md text-black">
                              <div class="font-display text-2xl">{{ getDecisionCardText(scenario) }}</div>
                            </span>
                          </p>
                        </div>
                        <div class="pt-6 px-3">
                          <p class="font-sans font-black text-black mb-2 text-center text-xl">
                            You said: {{ getUserChoice(scenario) }}
                          </p>
                        </div>
                      </div>
                      <div class="learning-objective text-stone-800 p-3 self-end">
                        <p class="font-display text-lg pb-20 text-stone-800 text-center leading-snug">
                          {{ scenario.learningObjectives }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper-container>
        <div v-else class="h-full flex items-center justify-center text-white">
          Loading recap...
        </div>
      </div>

      <!-- Controls Container -->
      <div class="h-1/6 flex flex-col align-middle items-center justify-start w-full">
        <div class="px-6 w-full flex flex-col items-center space-y-4 z-10">
          <div class="flex justify-center gap-5 z-10 py-2 mb-4 space-x-4 w-full self-center">
            <button @click="handlePreviousClick" :disabled="!canNavigateBack" :class="['-mt-12 flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110',
              { 'opacity-50 cursor-not-allowed': !canNavigateBack }]">
              <BackButton />
            </button>
            <button @click="handleNextClick"
              :class="'-mt-12 flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110'">
              <NextButton />
            </button>
          </div>
        </div>
      </div>

      <!-- Debug Panel and Button -->
      <DebugPanel :score="playerState.score" :regular-scenarios-count="regularScenarios.length" :game-stage="gameStage"
        @show-transition-card="showTransitionCard" @skip-to-game-over="skipToGameOver" />
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { register } from 'swiper/element/bundle';
import EffectTinder from '~/effect-tinder.esm';
import { useGameState } from '@/composables/gameState';

register();

const modules = [EffectTinder];
const swiperRef = ref(null);
const currentSlideIndex = ref(0);
const isTransitionCardVisible = ref(false);
const isTransitioningToGameOver = ref(false);

const { playerState, scenarios, userChoices, setGameOver, moveToNextStage, gameStage } = useGameState();

const canNavigate = computed(() => currentSlideIndex.value < filteredScenarios.value.length - 1);
const canNavigateBack = computed(() => currentSlideIndex.value > 0);
const isLastSlide = computed(() => currentSlideIndex.value === filteredScenarios.value.length - 1);
const isDataReady = computed(() => filteredScenarios.value.length > 0);

const regularScenarios = computed(() =>
  scenarios.value.filter(s => s.scenarioType !== 'ending')
);

const filteredScenarios = computed(() =>
  regularScenarios.value.filter(scenario => userChoices.value[scenario.id])
);

const handleNextClick = () => {
  if (canNavigate.value && swiperRef.value) {
    swiperRef.value.swiper.slideNext();
  } else if (isLastSlide.value) {
    transitionToGameOver();
  }
};

const handlePreviousClick = () => {
  if (canNavigateBack.value && swiperRef.value) {
    swiperRef.value.swiper.slidePrev();
  }
};

const transitionToGameOver = () => {
  isTransitioningToGameOver.value = true;
  setTimeout(() => {
    moveToNextStage();
  }, 500); // Adjust this timing to match your fade duration
};

const showTransitionCard = () => {
  isTransitionCardVisible.value = true;
};

const handleMoveToNextStage = () => {
  isTransitionCardVisible.value = false;
  moveToNextStage();
};

const skipToGameOver = () => {
  setGameOver(true);
};

const getDecisionCardText = (scenario) => {
  const decisionCard = scenario.cards.find(card => card.type === 'decision');
  return decisionCard ? decisionCard.text : 'No decision found for this scenario';
};

const getScoreChange = (scenario) => {
  const choice = userChoices.value[scenario.id];
  return choice ? choice.scoreChange : 0;
};

const getUserChoice = (scenario) => {
  const choice = userChoices.value[scenario.id];
  if (!choice) return 'No choice made';
  return choice.choice === 'trust' ? '👍' : '👎';
};

const getScenarioImage = (scenario) => {
  const decisionCard = scenario.cards.find(card => card.type === 'decision');
  return decisionCard?.image || '/images/card-placeholder.png';
};

onMounted(() => {
  if (swiperRef.value) {
    const swiperParams = {
      modules: [EffectTinder],
      effect: 'tinder',
      slidesPerView: 1,
      allowTouchMove: true,
      on: {
        slideChange: (swiper) => {
          currentSlideIndex.value = swiper.activeIndex;
        },
      },
    };
    Object.assign(swiperRef.value, swiperParams);
    swiperRef.value.initialize();
  }
});
</script>

<style scoped>
/* Root variables */
:root {
  --swiper-tinder-no-color: red;
  --swiper-tinder-yes-color: green;
  --swiper-tinder-label-text-color: #fff;
  --swiper-tinder-label-font-size: 32px;
  --swiper-tinder-button-size: 56px;
  --swiper-tinder-button-icon-size: 32px;
  --card-aspect-ratio: 1.2;
  --card-max-height: 70vh;
  --card-horizontal-margin: 5vw;
}

.card-container {
  @apply aspect-[11/19] h-4/6 relative;
  perspective: 2000px;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card-face {
  @apply z-10;
  backface-visibility: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.mfa-reveal-card {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform-style: preserve-3d;
}

/* Swiper specific styles */
.swiper-slide-shadow {
  @apply absolute inset-0 bg-black bg-opacity-15 pointer-events-none z-10;
}

/* Safe area adjustment */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}

.learning-objective br {
  @apply mb-2 block;
  content: "";
}

.learning-objective p {
  @apply mb-0;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>