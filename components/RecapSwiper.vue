<template>
  <div class="bg-black flex flex-col h-dvh justify-between">
    <TransitionCard v-if="isTransitionCardVisible" :game-stage="'recap'" :is-last-regular-scenario="true"
      @proceed="handleMoveToNextStage" />

    <!-- Floating Text Container -->
    <div class="flex-none h-1/6 flex items-center justify-center pointer-events-none px-6">
      <p class="text-2xl font-serif text-white leading-snug text-center">
        Review your choices
      </p>
    </div>

    <!-- Slides/Cards Container -->
    <div class="flex-grow absolute h-full w-full flex items-center justify-center overflow-hidden">
      <swiper-container v-if="isDataReady" ref="swiperRef" :modules="modules" effect="tinder" :slides-per-view="1"
        :allow-touch-move="true" observer observer-parents :init="false" class="w-full h-full">
        <swiper-slide v-for="scenario in regularScenarios" :key="scenario.id" class="flex items-center justify-center">
          <div class="card-container relative">
            <div class="card-face absolute inset-0 rounded-xl overflow-hidden transition-transform duration-600">
              <div class="absolute inset-0 bg-cover bg-center rounded-xl border-8 border-white aspect-[11/19]"
                :style="{ backgroundImage: `url(${getScenarioImage(scenario)})` }">
                <div
                  :class="`absolute inset-0 ${getScoreChange(scenario) === 1 ? 'bg-green-400' : 'bg-red-300'} bg-opacity-90 p-4 flex flex-col  overflow-y-auto justify-between`">
                  <div>
                    <div class="mx-16 mt-20">
                      <p class="font-serif font-black text-black mb-2 text-center text-2xl">{{
                        getDecisionCardText(scenario) }}
                      </p>
                    </div>
                    <div class="p-3">
                      <p class="text-center text-xs text-white mb-1 flex flex-col items-center justify-center">
                        <span class="text-xl rounded-md text-black">
                          <span class="uppercase font-bold mr-2 text-xl">You chose: {{ getChoiceDirection(scenario)
                            }}
                          </span>
                          <div>{{ getUserChoice(scenario) }}</div>
                        </span>
                      </p>
                    </div>
                  </div>

                  <!-- Sash container -->
                  <div class="absolute -top-3 -left-3 w-64 h-64 overflow-hidden clip-diagonal">
                    <!-- Sash -->
                    <div :class="[
                      'absolute -top-10 -left-10 w-full text-center pt-20 pb-2 text-white text-2xl font-bold font-sans uppercase transform -rotate-45 translate-y-10 -translate-x-10 clip-diagonal',
                      getScoreChange(scenario) === 1 ? 'bg-green-500' : 'bg-red-500'
                    ]">
                      {{ getScoreChange(scenario) === 1 ? 'Correct!' : 'Incorrect!' }}
                    </div>
                  </div>
                  <div class="learning-objective text-black p-3">

                    <p class="font-serif text-lg text-black text-center leading-snug ">{{ scenario.learningObjectives }}
                    </p>

                  </div>
                  <!-- Debug Information -->
                  <details v-if="showDebugPanel" class="mt-2 text-white">
                    <summary class="cursor-pointer text-xs">Debug Info</summary>
                    <pre
                      class="text-[8px] mt-1 overflow-x-auto">{{ JSON.stringify(userChoices[scenario.id], null, 2) }}</pre>
                    <p class="text-[8px] mt-1">Consequences:</p>
                    <pre class="text-[8px] mt-1 overflow-x-auto">{{ getChoiceConsequences(scenario) }}</pre>
                  </details>
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
    <div class="flex-none h-1/6 flex flex-col align-middle items-center justify-end w-full">
      <div class="flex space-x-12 justify-between z-10">

        <div class="flex justify-center gap-5 z-10 py-2 mb-4">
          <button @click="handlePreviousClick" :disabled="!canNavigateBack" :class="['flex items-center justify-center shadow-md cursor-pointer transition-transform duration-200 hover:scale-110',
            { 'opacity-50 cursor-not-allowed': !canNavigateBack }]"
            style="width: var(--swiper-tinder-button-size); height: var(--swiper-tinder-button-size);">
            <BackButton />
          </button>
          <button @click="handleNextClick" :disabled="!canNavigate" :class="['flex items-center justify-center shadow-md cursor-pointer transition-transform duration-200 hover:scale-110',
            { 'opacity-50 cursor-not-allowed': !canNavigate }]"
            style="width: var(--swiper-tinder-button-size); height: var(--swiper-tinder-button-size);">
            <NextButton />
          </button>
        </div>

      </div>
    </div>

    <!-- Game Over Prompt Modal -->
    <div v-if="showGameOverPrompt" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg text-center">
        <h2 class="text-2xl font-bold mb-4">Recap Complete</h2>
        <p class="mb-4">You've reviewed all your choices. Ready to see your final results?</p>
        <button @click="goToGameOver" class="bg-blue-500 text-white px-4 py-2 rounded mr-2">
          See Final Results
        </button>
        <button @click="showGameOverPrompt = false" class="bg-gray-300 px-4 py-2 rounded">
          Review Again
        </button>
      </div>
    </div>

    <!-- Debug Panel and Button -->
    <DebugPanel :score="playerState.score" :regular-scenarios-count="regularScenarios.length" :game-stage="gameStage"
      @show-transition-card="showTransitionCard" @skip-to-game-over="skipToGameOver" />
  </div>
</template>

<script setup>
import { register } from 'swiper/element/bundle';
import EffectTinder from '~/effect-tinder.esm';
import { useGameState } from '@/composables/gameState';


register();

const modules = [EffectTinder];
const swiperRef = ref(null);
const currentSlideIndex = ref(0);
const showGameOverPrompt = ref(false);
const showDebugPanel = ref(false);
const isTransitionCardVisible = ref(false);

const { playerState, scenarios, userChoices, setGameOver, resetGame, moveToNextStage, gameSequence, jumpToScenario,

} = useGameState();

const canNavigate = computed(() => currentSlideIndex.value < regularScenarios.value.length - 1);
const canNavigateBack = computed(() => currentSlideIndex.value > 0);
const isLastSlide = computed(() => currentSlideIndex.value === regularScenarios.value.length - 1);
const isRetryDisabled = computed(() => true); // Disable retry in recap mode

const isDataReady = computed(() => regularScenarios.value.length > 0);

const regularScenarios = computed(() =>
  scenarios.value.filter(s => s.scenarioType !== 'ending')
);

const handleNextClick = () => {
  if (canNavigate.value && swiperRef.value) {
    swiperRef.value.swiper.slideNext();
  } else if (isLastSlide.value) {
    showGameOverPrompt.value = true;
  }
};

const handlePreviousClick = () => {
  if (canNavigateBack.value && swiperRef.value) {
    swiperRef.value.swiper.slidePrev();
  }
};
const goToGameOver = () => {
  moveToNextStage();
};

const showTransitionCard = () => {
  console.log('Showing transition card');
  isTransitionCardVisible.value = true;
};

const handleMoveToNextStage = () => {
  console.log('Moving to next stage');
  isTransitionCardVisible.value = false;
  moveToNextStage();
};

const skipToGameOver = () => {
  console.log('Skipping to game over');
  setGameOver(true);
};

const returnToStartScreen = () => {
  resetGame();
};

const retryScenario = () => {
  // Implement retry functionality if needed
  console.log('Retry functionality not implemented in recap mode');
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
  return choice.choiceText || (choice.choice === 'trust' ? 'Trust' : 'Distrust');
};

const getChoiceClass = (scenario) => {
  const choice = userChoices.value[scenario.id];
  if (!choice) return 'bg-yellow-500';
  return choice.choice === 'trust' ? 'bg-green-500' : 'bg-red-300';
};

const getChoiceDirection = (scenario) => {
  const choice = userChoices.value[scenario.id];
  if (!choice) return 'No choice made';
  return choice.choice === 'trust' ? '👍' : '👎';
};

const getUserFeedback = (scenario) => {
  const choice = userChoices.value[scenario.id];
  return choice ? choice.feedback.replace(/\\n/g, '<br>') : 'No feedback available';
};

const getScenarioImage = (scenario) => {
  const decisionCard = scenario.cards.find(card => card.type === 'decision');
  return decisionCard?.image || '/images/card-placeholder.png';
};

const getChoiceConsequences = (scenario) => {
  const choice = userChoices.value[scenario.id];
  if (!choice) return 'No choice made';
  const decisionCard = scenario.cards.find(card => card.type === 'decision');
  if (!decisionCard) return 'No decision card found';
  const consequences = choice.choice === 'trust' ? decisionCard.trustChoice.consequences : decisionCard.distrustChoice.consequences;
  try {
    return JSON.stringify(JSON.parse(consequences), null, 2);
  } catch (error) {
    return 'Invalid consequences data';
  }
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
        reachEnd: () => {
          showGameOverPrompt.value = true;
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
}


.card-face {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transition: transform 0.6s;
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

.clip-diagonal {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, 85% 0, 100% 15%, 100% 100%, 0 100%);
}
</style>