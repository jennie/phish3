<template>
  <div class="bg-black flex flex-col h-dvh justify-between">
    <!-- Floating Text Container -->
    <div class="flex-none h-1/6 flex items-center justify-center pointer-events-none px-6">
      <p class="text-xl text-white leading-snug text-center">
        Recap: Review your choices
      </p>
    </div>

    <!-- Slides/Cards Container -->
    <div class="absolute h-screen w-screen flex items-center justify-center">
      <swiper-container ref="swiperRef" :modules="modules" effect="tinder" :slides-per-view="1" :allow-touch-move="true"
        observer observer-parents :init="false" class="w-full h-full">
        <swiper-slide v-for="scenario in regularScenarios" :key="scenario.id"
          class="h-full flex flex-col items-center justify-center">
          <div class="relative w-full h-4/6 flex items-center justify-center">
            <div
              class="w-[calc(100vh*13/19*0.6)] max-w-[90vw] h-full rounded-xl overflow-hidden transition-transform duration-600 absolute">
              <div class="w-full h-full">
                <div class="absolute inset-0 bg-cover bg-center rounded-xl border-8 border-white"
                  :style="{ backgroundImage: `url(${getScenarioImage(scenario)})` }">
                  <div
                    class="absolute inset-0 bg-black bg-opacity-50 p-6 flex flex-col justify-between overflow-y-auto">
                    <div>
                      <h2 class="text-2xl font-bold text-white mb-4">Scenario {{ scenario.id }}</h2>
                      <p class="text-white mb-4">{{ getDecisionCardText(scenario) }}</p>
                      <p class="text-white mb-2">Your choice:
                        <span :class="getChoiceClass(scenario)">
                          {{ getUserChoice(scenario) }}
                        </span>
                      </p>
                      <p class="text-white mb-2">Score change: {{ getScoreChange(scenario) }}</p>
                      <p class="text-white mb-4">{{ getUserFeedback(scenario) }}</p>
                    </div>
                    <p class="text-white italic">Learning Objective: {{ scenario.learningObjective || 'Not specified' }}
                    </p>

                    <!-- Debug Information -->
                    <details class="mt-4 text-white">
                      <summary class="cursor-pointer">Debug Info</summary>
                      <pre
                        class="text-xs mt-2 overflow-x-auto">{{ JSON.stringify(debugUserChoices[scenario.id], null, 2) }}</pre>
                      <p class="text-xs mt-2">Consequences:</p>
                      <pre class="text-xs mt-1 overflow-x-auto">{{ getChoiceConsequences(scenario) }}</pre>
                    </details>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper-container>
    </div>
    <div class="text-white text-center mt-4">
      Total Score: {{ totalScore }}
    </div>

    <!-- Controls Container -->
    <div class="flex-none h-1/6 flex flex-col justify-end pb-safe">
      <div class="flex justify-center gap-5 z-10 py-2 mb-4">
        <button @click="handlePreviousClick" :disabled="!canNavigateBack"
          class="flex items-center justify-center shadow-md cursor-pointer transition-transform duration-200 hover:scale-110"
          style="width: var(--swiper-tinder-button-size); height: var(--swiper-tinder-button-size);">
          <BackButton />
        </button>
        <button @click="handleNextClick" :disabled="!canNavigate"
          class="flex items-center justify-center shadow-md cursor-pointer transition-transform duration-200 hover:scale-110"
          style="width: var(--swiper-tinder-button-size); height: var(--swiper-tinder-button-size);">
          <NextButton />
        </button>
      </div>
      <div class="text-center p-4 flex flex-row justify-center items-center z-50">
        <button v-if="isLastSlide" @click="goToGameOver" class="p-2 bg-blue-500 text-white rounded">
          See Final Results
        </button>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { register } from 'swiper/element/bundle';
import EffectTinder from '~/effect-tinder.esm';
import { useGameState } from '@/composables/gameState';
import BackButton from './BackButton.vue';
import NextButton from './NextButton.vue';

register();

const modules = [EffectTinder];
const swiperRef = ref(null);
const currentSlideIndex = ref(0);
const showGameOverPrompt = ref(false);

const { playerState, scenarios, userChoices, setGameOver } = useGameState();

const canNavigate = computed(() => currentSlideIndex.value < scenarios.value.length - 1);
const canNavigateBack = computed(() => currentSlideIndex.value > 0);
const isLastSlide = computed(() => currentSlideIndex.value === scenarios.value.length - 1);




const handleNextClick = () => {
  if (canNavigate.value && swiperRef.value) {
    swiperRef.value.swiper.slideNext();
  } else if (isLastSlide.value) {
    showGameOverPrompt.value = true;
  }
};

const goToGameOver = () => {
  setGameOver(true);
};
const totalScore = computed(() => playerState.value.score);

// DEBUGGING

const debugUserChoices = ref({});


onMounted(() => {
  console.log("All scenarios:", scenarios.value);
  console.log("Regular scenarios:", regularScenarios.value);
  console.log("User choices:", userChoices.value);
  console.log("Total score:", totalScore.value);
  debugUserChoices.value = JSON.parse(JSON.stringify(userChoices.value));
});


// END DEBUGGING

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

const handlePreviousClick = () => {
  if (canNavigateBack.value && swiperRef.value) {
    swiperRef.value.swiper.slidePrev();
  }
};

const finishRecap = () => {
  resetGame();
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


const getDecisionCardText = (scenario) => {
  const decisionCard = scenario.cards.find(card => card.type === 'decision');
  console.log(`Decision card for scenario ${scenario.id}:`, decisionCard);
  return decisionCard ? decisionCard.text : 'No decision found for this scenario';
};

const getScoreChange = (scenario) => {
  const choice = userChoices.value[scenario.id];
  return choice ? choice.scoreChange : 0;
};
const regularScenarios = computed(() =>
  scenarios.value.filter(s => s.scenarioType !== 'ending')
);

const getUserChoice = (scenario) => {
  const choice = userChoices.value[scenario.id];
  console.log(`Getting choice for scenario ${scenario.id}:`, choice);
  if (!choice) return 'No choice made';
  return choice.choiceText || (choice.choice === 'trust' ? 'Trust' : 'Distrust');
};

const getChoiceClass = (scenario) => {
  const choice = userChoices.value[scenario.id];
  if (!choice) return 'text-yellow-500';
  return choice.choice === 'trust' ? 'text-green-500' : 'text-red-500';
};

const getUserFeedback = (scenario) => {
  const choice = userChoices.value[scenario.id];
  return choice ? choice.feedback : 'No feedback available';
};



const getScenarioImage = (scenario) => {
  const decisionCard = scenario.cards.find(card => card.type === 'decision');
  return decisionCard?.image || '/images/card-placeholder.png';
};
</script>

<style scoped>
.recap-card {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin: 10px;
}

.learning-objective {
  font-style: italic;
  margin-top: 10px;
}
</style>