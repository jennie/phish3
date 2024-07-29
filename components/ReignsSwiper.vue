<template>
  <StartGameScreen v-if="!gameStarted" />
  <div v-else class=" bg-black flex flex-col h-dvh">
    <!-- Floating Text Container -->
    <div class="flex-none h-1/6 flex items-center justify-center pointer-events-none px-6">
      <Transition name="fade" mode="out-in">
        <p v-if="currentCard && currentCard.type !== 'reveal'" :key="currentCardIndex"
          class="text-xl text-white leading-snug text-center" v-html="parseCardText(currentCard.text)">
        </p>
        <p v-else-if="lastDecisionText" :key="'last-decision'" class="text-xl text-white leading-snug text-center"
          v-html="parseCardText(lastDecisionText)">
        </p>
      </Transition>
    </div>

    <!-- Slides/Cards Container -->
    <div class="flex-grow h-4/6 overflow-hidden flex items-center justify-center">
      <swiper-container v-if="isDataReady" ref="swiperRef" :modules="modules" effect="tinder" :slides-per-view="1"
        :allow-touch-move="true" observer observer-parents :init="false" class="w-full h-full">
        <swiper-slide v-for="(card, index) in currentScenario.cards" :key="index"
          class="h-full flex items-center justify-center">
          <div :ref="el => { if (el) cardRefs[index] = el }"
            class="relative w-full h-full flex items-center justify-center">
            <div
              :class="['w-[calc(100vh*13/19*0.6)] max-w-[90vw] h-full rounded-xl overflow-hidden transition-transform duration-600 absolute', { 'rotate-y-180': cardFlipStates[card.id] }]">
              <div class="w-full h-full">
                <div class="absolute inset-0 bg-cover bg-center rounded-xl border-8 border-white"
                  :style="{ backgroundImage: `url(${card.image || ''})` }">
                  <Transition name="pop-fade">
                    <div v-if="card.type === 'decision' && showDecisionIcon && !isCardSwiping"
                      class="absolute top-4 right-4 bg-yellow-200 leading-none rounded-full p-2 shadow-lg icon-pop z-30">
                      <button @click="toggleOverlay(card.id)" class="focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
                          <path fill="currentColor"
                            d="M196 96c0 29.47-24.21 54.05-56 59.06v.94a12 12 0 0 1-24 0v-12a12 12 0 0 1 12-12c24.26 0 44-16.15 44-36s-19.74-36-44-36s-44 16.15-44 36a12 12 0 0 1-24 0c0-33.08 30.5-60 68-60s68 26.92 68 60m-68 92a20 20 0 1 0 20 20a20 20 0 0 0-20-20" />
                        </svg>
                      </button>
                    </div>
                  </Transition>
                  <!-- Overlay -->
                  <Transition name="slide-vertical">
                    <div v-if="overlayStates[card.id]"
                      class="absolute inset-0 bg-gray-800  flex flex-col text-gray-200 p-4 z-40">
                      <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold">Card Information</h2>
                        <button @click="toggleOverlay(card.id)" class="text-white hover:text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                      <div class="flex-grow overflow-y-auto">
                        <p>{{ card.overlayContent || 'Additional information about this decision.' }}</p>
                      </div>
                    </div>
                  </Transition>
                  <!-- Existing trust/distrust labels -->
                  <div
                    class="text-right absolute top-0 left-0 w-full px-3 py-8 text-lg font-bold z-20 transition-opacity duration-300 bg-red-500 bg-opacity-70 text-white swiper-tinder-label swiper-tinder-label-no pointer-events-none"
                    data-swiper-parallax="-300" data-swiper-parallax-duration="600"
                    v-html="card.distrustLabel || 'Distrust'" />
                  <div
                    class="absolute top-0 right-0 w-full px-3 py-8 text-lg font-bold z-20 transition-opacity duration-300 bg-green-500 bg-opacity-70 text-white swiper-tinder-label swiper-tinder-label-yes pointer-events-none"
                    data-swiper-parallax="-300" data-swiper-parallax-duration="600"
                    v-html="card.trustLabel || 'Trust'" />
                </div>
              </div>
            </div>
            <div v-if="currentCard && currentCard.type === 'reveal'"
              :class="['w-[calc(100vh*13/19*0.6)] max-w-[90vw] h-full rounded-xl overflow-hidden bg-gray-800 flex items-center justify-center transition-transform duration-600 absolute backface-hidden reveal  border-8 border-white', { 'rotate-y-180': !cardFlipStates[card.id] }]">
              <div v-if="decisionFeedback" class="p-4 text-white">
                <p class="text-xl px-8" v-html="parseCardText(decisionFeedback)" />
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper-container>
      <div v-else class="h-full flex items-center justify-center text-white">
        Loading scenarios...
      </div>
    </div>

    <!-- Controls Container -->
    <div class="flex-none h-1/6 flex flex-col justify-end pb-safe">
      <div class="flex justify-center gap-5 z-10 py-2 mb-4">
        <button @click="handlePreviousClick" :disabled="!canNavigateBack || isFlipping"
          :class="['flex items-center justify-center shadow-md cursor-pointer transition-transform duration-200 hover:scale-110', { 'opacity-50 cursor-not-allowed': !canNavigateBack || isFlipping }]"
          style="width: var(--swiper-tinder-button-size); height: var(--swiper-tinder-button-size);">
          <BackButton v-if="!isDecisionCard" />
          <ThumbsDown v-else @click="handleDistrustClick" />
        </button>
        <button @click="handleNextClick" :disabled="!canNavigate || isFlipping"
          :class="['flex items-center justify-center shadow-md cursor-pointer transition-transform duration-200 hover:scale-110', { 'opacity-50 cursor-not-allowed': !canNavigate || isFlipping }]"
          style="width: var(--swiper-tinder-button-size); height: var(--swiper-tinder-button-size);">
          <NextButton v-if="!isDecisionCard" />
          <ThumbsUp v-else />
        </button>
      </div>


      <div class="text-center p-4 flex flex-row justify-between items-center">
        <a href="/" @click.prevent="returnToStartScreen" class="p-2">
          <HomeButton />
        </a>
        <button @click="retryScenario" :disabled="isRetryDisabled" class="p-2 bg-transparent border-none"
          :class="{ 'opacity-50': isRetryDisabled }" :style="{ cursor: isRetryDisabled ? 'not-allowed' : 'pointer' }">
          <RetryButton />
        </button>
      </div>

    </div>

    <!-- Debug Panel and Button -->
    <!-- Debug Panel and Button -->
    <div class="fixed top-4 right-4 flex flex-col items-end z-50">
      <button @click="showDebugPanel = !showDebugPanel"
        class="bg-red-500 text-white px-4 py-2 rounded-full uppercase text-xs hover:bg-red-600 transition-colors mb-2">
        {{ showDebugPanel ? 'Hide' : 'Show' }} Debug
      </button>

      <div v-if="showDebugPanel"
        class="bg-red-500 bg-opacity-80 text-white p-3 rounded text-xs max-w-xs w-full mt-2 overflow-auto max-h-[80vh]">
        <p class="mb-1">Current Card: {{ currentCardIndex + 1 }}</p>
        <p class="mb-1">Card Type: {{ currentCard?.type || 'N/A' }}</p>
        <p class="mb-1">Current Scenario: {{ currentScenario?.id || 'N/A' }}</p>
        <p class="mb-1">All Scenarios (in current order):</p>
        <span v-for="(scenario, index) in scenarios" :key="scenario.id">
          <button @click="jumpToScenario(scenario.id)" class="underline hover:text-yellow-300 text-2xl px-2 ">
            {{ scenario.id }}
          </button>

        </span>
      </div>
    </div>
  </div>
</template>


<style>
/* Root variables */
:root {
  --swiper-tinder-no-color: red;
  --swiper-tinder-yes-color: green;
  --swiper-tinder-label-text-color: #fff;
  --swiper-tinder-label-font-size: 32px;
  --swiper-tinder-button-size: 56px;
  --swiper-tinder-button-icon-size: 32px;
}

/* Enhance 3D effect for the card container */
.reveal {
  perspective: 2000px;
}

/* Enhance the flip animation */
.transition-transform {
  transition-duration: 0.6s;
  transition-timing-function: ease-out;
}

.rotate-y-180 {
  transform: rotateY(180deg) translate3d(0, 0, 50px);
}

/* Optional: Enhance the reveal card appearance */
.reveal {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* Transition styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Swiper specific styles */
.swiper-slide-shadow {
  @apply absolute inset-0 bg-black bg-opacity-15 pointer-events-none z-10;
}

.swiper-slide-active.swiper-slide-swiping .swiper-tinder-label {
  @apply opacity-100;
}

/* Safe area adjustment */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}

/* Utility classes */
.backface-hidden {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.card-face {
  @apply border-2 border-white rounded-xl overflow-hidden;
}

.reveal {

  background-image: url('/images/card-reveal.png');
  background-size: cover;
  background-position: center center;
}

.swiper-tinder-label {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.swiper-slide-active.swiper-slide-swiping .swiper-tinder-label {
  opacity: 1;
}

.swiper-slide-active.swiper-slide-swiping-left .swiper-tinder-label-no {
  opacity: 1;
}

.swiper-slide-active.swiper-slide-swiping-right .swiper-tinder-label-yes {
  opacity: 1;
}

.pop-fade-enter-active {
  animation: pop-in 0.5s ease-out;
}

.pop-fade-leave-active,
.pop-fade-enter-active {
  transition: opacity 0.2s ease-out;
}

.pop-fade-enter-from,
.pop-fade-leave-to {
  opacity: 0;
}

@keyframes pop-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }

  50% {
    transform: scale(1.2);
    opacity: 1;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.icon-pop {
  transform-origin: center;
  will-change: transform, opacity;
}

.slide-vertical-enter-active,
.slide-vertical-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-vertical-enter-from,
.slide-vertical-leave-to {
  transform: translateY(-100%);
}

.slide-vertical-enter-to,
.slide-vertical-leave-from {
  transform: translateY(0);
}

/* Optional: Add a subtle scale effect for a more dynamic feel */
.slide-vertical-enter-active {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.slide-vertical-enter-from {
  transform: translateY(-100%) scale(0.95);
  opacity: 0;
}

.slide-vertical-enter-to {
  transform: translateY(0) scale(1);
  opacity: 1;
}
</style>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { register } from 'swiper/element/bundle';
import EffectTinder from '~/effect-tinder.esm';
import { useGameState } from '@/composables/gameState';
import '/assets/css/styles.css';

register();
const showDebugPanel = ref(false);

const modules = [EffectTinder];
const swiperRef = ref(null);
const swiper = ref(null);
const cardRefs = ref([]);
const cardFlipStates = ref({});
const isTransitioning = ref(false);
const flipTimeout = ref(null);
const lastDecisionText = ref('');
const isDecisionCard = computed(() => {
  return currentCard.value?.type === 'decision';
});
// after the decision card is shown, add an icon to the top right of the card with a brief "pop" animation

const parseCardText = (text) => {
  return text.replace(/\\n/g, '<br>');
};
const isFlipping = ref(false);
const {
  gameStarted,
  startGame,
  currentScenario,
  makeChoice,
  nextCard,
  nextScenario,
  previousCard,
  gameOver,
  playerState,
  scenarios,
  resetGame,
  currentScenarioIndex
} = useGameState();

const decisionFeedback = ref('');
const currentCardIndex = ref(0);
const isRevealCardFlipped = ref(false);
let swipingTimeout = null;

const isDataReady = computed(() => {
  return !!currentScenario.value && !!scenarios.value && scenarios.value.length > 0;
});

const scenarioIds = computed(() => {
  return scenarios.value ? scenarios.value.map(scenario => scenario.id) : [];
});

const canNavigate = computed(() => {
  if (!currentCard.value) return false;
  if (currentCard.value.type === 'reveal' && !isRevealCardFlipped.value) return false;
  return true;
});

const canNavigateBack = computed(() => {
  if (!currentCard.value) return false;
  if (currentCardIndex.value === 0) return false;
  if (currentCard.value.type === 'reveal' && isRevealCardFlipped.value) return false;
  return true;
});
const currentCard = computed(() => {
  if (currentScenario.value && currentScenario.value.cards) {
    return currentScenario.value.cards[currentCardIndex.value];
  }
  return null;
});


const handleTinderSwipe = async (s, direction) => {
  if (!isDataReady.value) return;

  if (!currentCard.value) return;

  console.log('handleTinderSwipe called with direction:', direction);
  console.log('Current card:', JSON.parse(JSON.stringify(currentCard.value)));

  if (currentCard.value.type === 'story') {
    console.log('Story card detected, moving to next card');
    nextCard();
    s.slideNext(300, true);
  } else if (currentCard.value.type === 'decision') {
    const isTrust = direction === 'right';
    console.log('Decision card detected. Is trust decision:', isTrust);
    makeChoice(isTrust);

    console.log('Trust feedback:', currentCard.value.trustChoice?.feedback);
    console.log('Distrust feedback:', currentCard.value.distrustChoice?.feedback);

    decisionFeedback.value = isTrust
      ? currentCard.value.trustChoice?.feedback
      : currentCard.value.distrustChoice?.feedback;

    console.log('Set decisionFeedback to:', decisionFeedback.value);

    lastDecisionText.value = currentCard.value.text;
    nextCard();
    s.slideNext(300, true);
  } else if (currentCard.value.type === 'reveal') {
    console.log('Reveal card detected');
    if (isRevealCardFlipped.value) {
      console.log('Reveal card is flipped, transitioning to next scenario');
      await transitionToNextScenario();
    } else {
      console.log('Flipping reveal card');
      flipRevealCard(currentCardIndex.value);
    }
  }
};


const handleNextClick = async () => {
  if (swiper.value && canNavigate.value && !isTransitioning.value) {
    if (currentCard.value?.type === 'reveal' && isRevealCardFlipped.value) {
      await transitionToNextScenario();
    } else {
      if (currentCard.value?.type === 'decision') {
        makeChoice(true); // Trust choice
        decisionFeedback.value = currentCard.value.trustChoice?.feedback;
        lastDecisionText.value = currentCard.value.text;
      }
      swiper.value.slideNext(300, true);
    }
  }
};

const handlePreviousClick = async () => {
  if (swiper.value && !isTransitioning.value) {
    if (canNavigateBack.value) {
      await previousCard();
      swiper.value.slidePrev(300, true);
    } else if (currentCard.value?.type === 'reveal' && isRevealCardFlipped.value) {
      await transitionToNextScenario();
    }
  }
};




const showDecisionIcon = ref(false);
const isCardSwiping = ref(false);

const handleSlideChange = (s) => {
  if (!isDataReady.value) return;

  currentCardIndex.value = s.activeIndex;
  const card = currentCard.value;

  if (card?.type === 'decision') {
    showDecisionIcon.value = false;
    isCardSwiping.value = false;
    nextTick(() => {
      showDecisionIcon.value = true;
    });
  } else if (card?.type === 'reveal') {
    if (flipTimeout.value) {
      clearTimeout(flipTimeout.value);
    }
    flipTimeout.value = setTimeout(() => {
      if (!isRevealCardFlipped.value) {
        flipRevealCard(currentCardIndex.value);
      }
    }, 1000);
  } else {
    isRevealCardFlipped.value = false;
    decisionFeedback.value = '';
    showDecisionIcon.value = false;
  }
};
const flipRevealCard = (index) => {
  const card = currentScenario.value.cards[index];
  if (card && card.type === 'reveal' && !isRevealCardFlipped.value) {
    if (flipTimeout.value) {
      clearTimeout(flipTimeout.value);
    }
    isFlipping.value = true;
    flipTimeout.value = setTimeout(() => {
      cardFlipStates.value[card.id] = true;
      isRevealCardFlipped.value = true;
      if (swiper.value) {
        swiper.value.allowSlideNext = true;
      }
      isFlipping.value = false;
    }, 1000);
  }
};


const transitionToNextScenario = async () => {
  isTransitioning.value = true;
  await nextScenario();
  currentCardIndex.value = 0;
  isRevealCardFlipped.value = false;
  decisionFeedback.value = '';
  cardFlipStates.value = {};
  await nextTick();
  if (swiper.value) {
    swiper.value.slideTo(0, 0);
    await swiper.value.update();
  }
  isTransitioning.value = false;
};
const initializeSwiper = () => {
  if (swiperRef.value && isDataReady.value) {
    const swiperParams = {
      modules: [EffectTinder],
      effect: 'tinder',
      slidesPerView: 1,
      allowTouchMove: true,
      watchSlidesProgress: true,
      virtualTranslate: true,
      on: {
        progress: function (s, progress) {
          const swiper = this;
          for (let i = 0; i < swiper.slides.length; i++) {
            const slideProgress = swiper.slides[i].progress;
            const absProgress = Math.abs(slideProgress);
            swiper.slides[i].style.opacity = 1 - absProgress / 1;
          }
        },
        setTransition: function (s, duration) {
          const swiper = this;
          for (let i = 0; i < swiper.slides.length; i++) {
            swiper.slides[i].style.transition = `${duration}ms`;
          }
        },
        slideChange: handleSlideChange,
        tinderSwipe: handleTinderSwipe,
        sliderFirstMove: () => {
          if (currentCard.value?.type === 'decision') {
            isCardSwiping.value = true;
            if (swipingTimeout) {
              clearTimeout(swipingTimeout);
            }
          }
        },
        sliderMove: () => {
          if (swipingTimeout) {
            clearTimeout(swipingTimeout);
          }
        },
        touchEnd: () => {
          if (currentCard.value?.type === 'decision') {
            if (swipingTimeout) {
              clearTimeout(swipingTimeout);
            }
            swipingTimeout = setTimeout(() => {
              isCardSwiping.value = false;
            }, 300); // Adjust this delay as needed
          }
        },
      },
    };
    Object.assign(swiperRef.value, swiperParams);
    swiperRef.value.initialize();
    swiper.value = swiperRef.value.swiper;
  }
};

onMounted(async () => {
  await nextTick();
  await initializeSwiper();
  if (flipTimeout.value) {
    clearTimeout(flipTimeout.value);
  }
});
watch(gameStarted, async (started) => {
  if (started) {
    await nextTick();
    await initializeSwiper();
  }
});
watch(isDataReady, async (ready) => {
  if (ready) {
    await initializeSwiper();
  }
});

watch(currentScenario, async (newScenario) => {
  if (newScenario) {
    cardFlipStates.value = {};
    newScenario.cards.forEach((card, index) => {
      if (!card.id) {
        card.id = `card-${index}`;
      }
      cardFlipStates.value[card.id] = false;
    });

    await nextTick();
    if (swiper.value) {
      swiper.value.slideTo(0, 0);
      swiper.value.update();
    }
  }
});

const swipeRight = async () => {
  if (swiper.value && canNavigate.value && !isTransitioning.value) {
    if (currentCard.value?.type === 'reveal' && isRevealCardFlipped.value) {
      await transitionToNextScenario();
    } else {
      swiper.value.tinder.yes();
    }
  }
};

const swipeLeft = async () => {
  if (swiper.value && !isTransitioning.value) {
    if (canNavigateBack.value) {
      await previousCard();
      swiper.value.tinder.no();
    } else if (currentCard.value?.type === 'reveal' && isRevealCardFlipped.value) {
      await transitionToNextScenario();
    }
  }
};


const returnToStartScreen = () => {
  resetGame();
  gameStarted.value = false;
};


const isRetryDisabled = computed(() => {
  return currentCard.value?.type === 'decision' || currentCard.value?.type === 'reveal';
});

const retryScenario = async () => {
  if (swiper.value && currentScenario.value && !isRetryDisabled.value) {
    isTransitioning.value = true;

    // Reset to the first card of the current scenario
    currentCardIndex.value = 0;

    // Reset card flip states
    cardFlipStates.value = {};
    currentScenario.value.cards.forEach((card, index) => {
      if (!card.id) {
        card.id = `card-${index}`;
      }
      cardFlipStates.value[card.id] = false;
    });

    // Reset other states
    isRevealCardFlipped.value = false;
    decisionFeedback.value = '';
    lastDecisionText.value = '';

    // Update Swiper
    await nextTick();
    if (swiper.value) {
      swiper.value.slideTo(0, 0);
      await swiper.value.update();
    }

    isTransitioning.value = false;
  }
};


const overlayStates = reactive({});

const toggleOverlay = (cardId) => {
  if (overlayStates[cardId] === undefined) {
    overlayStates[cardId] = true;
  } else {
    overlayStates[cardId] = !overlayStates[cardId];
  }
};

watch(() => currentScenario.value, (newScenario) => {
  if (newScenario && newScenario.cards) {
    newScenario.cards.forEach(card => {
      if (!overlayStates[card.id]) {
        overlayStates[card.id] = false;
      }
    });
  }
}, { immediate: true });

const jumpToScenario = async (scenarioId) => {
  console.log('Jumping to scenario:', scenarioId);
  const targetIndex = scenarios.value.findIndex(s => s.id === Number(scenarioId));
  console.log('Target index:', targetIndex);
  if (targetIndex !== -1) {
    // Reset game state
    isTransitioning.value = true;
    currentCardIndex.value = 0;
    isRevealCardFlipped.value = false;
    decisionFeedback.value = '';
    lastDecisionText.value = '';
    cardFlipStates.value = {};

    // Set the current scenario index directly
    currentScenarioIndex.value = targetIndex;

    // Update Swiper
    await nextTick();
    if (swiper.value) {
      swiper.value.slideTo(0, 0);
      await swiper.value.update();
    }

    isTransitioning.value = false;
    console.log('Jumped to scenario:', currentScenario.value.id);
  } else {
    console.error('Scenario not found:', scenarioId);
  }
};

</script>
