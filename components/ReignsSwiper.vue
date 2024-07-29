<template>
  <StartGameScreen v-if="!gameStarted" />
  <div v-else class=" bg-black flex flex-col h-dvh">
    <!-- Floating Text Container -->
    <div class="flex-none h-1/6 flex items-center justify-center pointer-events-none px-6">
      <Transition name="fade" mode="out-in">
        <p v-if="currentCard && currentCard.type !== 'reveal'" :key="currentCardIndex"
          class="text-xl text-white leading-snug text-center">
          {{ currentCard.text }}
        </p>
        <p v-else-if="lastDecisionText" :key="'last-decision'" class="text-xl text-white leading-snug text-center">
          {{ lastDecisionText }}
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
                  :style="{ backgroundImage: `url(${card.image})` }">
                  <div
                    class="absolute top-4 left-4 max-w-[45%] px-3 py-2 rounded-full text-sm font-bold z-10 opacity-0 transition-opacity duration-300 bg-red-500 bg-opacity-70 text-white"
                    data-swiper-parallax="-300" data-swiper-parallax-duration="600"
                    v-html="card.distrustLabel || 'Distrust'" />
                  <div
                    class="absolute top-4 right-4 max-w-[45%] px-3 py-2 rounded-full text-sm font-bold z-10 opacity-0 transition-opacity duration-300 bg-green-500 bg-opacity-70 text-white"
                    data-swiper-parallax="-300" data-swiper-parallax-duration="600"
                    v-html="card.trustLabel || 'Trust'" />
                </div>
              </div>
            </div>
            <div v-if="card.type === 'reveal'"
              :class="['w-[calc(100vh*13/19*0.6)] max-w-[90vw] h-full rounded-xl overflow-hidden bg-gray-800 flex items-center justify-center transition-transform duration-600 absolute backface-hidden reveal  border-8 border-white', { 'rotate-y-180': !cardFlipStates[card.id] }]">
              <div v-if="decisionFeedback" class="p-4 text-white">
                <p class="text-xl px-8">{{ decisionFeedback }}</p>
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
        <button @click="handlePreviousClick" :disabled="!canNavigateBack"
          :class="['flex items-center justify-center shadow-md cursor-pointer transition-transform duration-200 hover:scale-110', { 'opacity-50 cursor-not-allowed': !canNavigateBack }]"
          style="width: var(--swiper-tinder-button-size); height: var(--swiper-tinder-button-size);">
          <BackButton v-if="!isDecisionCard" />
          <ThumbsDown v-else @click="handleDistrustClick" />
        </button>
        <button @click="handleNextClick" :disabled="!canNavigate"
          :class="['flex items-center justify-center shadow-md cursor-pointer transition-transform duration-200 hover:scale-110', { 'opacity-50 cursor-not-allowed': !canNavigate }]"
          style="width: var(--swiper-tinder-button-size); height: var(--swiper-tinder-button-size);">
          <NextButton v-if="!isDecisionCard" />
          <ThumbsUp v-else />
        </button>
      </div>
      <div class="text-blue-200 text-center p-2 flex flex-row justify-between">
        <HomeButton />
        <a href="/" class="cursor-pointer" @click.prevent="retryScenario">
          <RetryButton />
        </a>
      </div>
    </div>

    <!-- Debug Panel and Button -->
    <div class="absolute left-0 right-0 flex flex-col items-center z-50"
      :class="showDebugPanel ? 'bottom-[calc(env(safe-area-inset-bottom,20px)+8rem)]' : 'bottom-[calc(env(safe-area-inset-bottom,20px)+0.5rem)]'">
      <button @click="showDebugPanel = !showDebugPanel"
        class="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors mb-2">
        {{ showDebugPanel ? 'Hide' : 'Show' }} Debug
      </button>

      <div v-if="showDebugPanel" class="bg-black bg-opacity-80 text-white p-3 rounded text-xs max-w-xs w-full mt-2">
        <p class="mb-1">Current Card: {{ currentCardIndex + 1 }}</p>
        <p class="mb-1">Card Type: {{ currentCard?.type || 'N/A' }}</p>
        <p class="mb-1">Current Scenario: {{ currentScenario?.id || 'N/A' }}</p>
        <p class="mb-1">All Scenarios: {{ scenarios.map(s => s.id).join(', ') }}</p>
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
} = useGameState();

const decisionFeedback = ref('');
const currentCardIndex = ref(0);
const isRevealCardFlipped = ref(false);

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

  if (currentCard.value.type === 'decision') {
    const isTrust = direction === 'right';
    makeChoice(isTrust);
    decisionFeedback.value = isTrust
      ? currentCard.value.trustChoice?.feedback
      : currentCard.value.distrustChoice?.feedback;
    lastDecisionText.value = currentCard.value.text;
    s.slideNext(300, true);
  } else if (currentCard.value.type === 'reveal') {
    if (isRevealCardFlipped.value) {
      await transitionToNextScenario();
    } else {
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


const handleSlideChange = (s) => {
  if (!isDataReady.value) return;

  currentCardIndex.value = s.activeIndex;
  const card = currentCard.value;

  if (card?.type === 'reveal') {
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
  }
};
const flipRevealCard = (index) => {
  const card = currentScenario.value.cards[index];
  if (card && card.type === 'reveal' && !isRevealCardFlipped.value) {
    if (flipTimeout.value) {
      clearTimeout(flipTimeout.value);
    }
    flipTimeout.value = setTimeout(() => {
      cardFlipStates.value[card.id] = true;
      isRevealCardFlipped.value = true;
      if (swiper.value) {
        swiper.value.allowSlideNext = true;
      }
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

const retryScenario = async () => {
  if (swiper.value && currentCardIndex.value > 0) {
    isTransitioning.value = true;

    // Loop to navigate back to the first card
    while (currentCardIndex.value > 0) {
      await swiper.value.slidePrev(500); // Adjust duration as needed
      currentCardIndex.value--;
    }

    // Reset card flip states
    cardFlipStates.value = {};
    currentScenario.value.cards.forEach((card, index) => {
      cardFlipStates.value[card.id] = false;
    });

    // Reset other states
    isRevealCardFlipped.value = false;
    decisionFeedback.value = '';
    lastDecisionText.value = '';

    isTransitioning.value = false;
  }
};


</script>
