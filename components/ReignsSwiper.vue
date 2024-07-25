<template>
  <StartGameScreen v-if="!gameStarted" />
  <div v-else class="swiper-tinder-container h-full bg-black flex flex-col pb-safe">
    <!-- Debug Panel and Button -->

    <div class="floating-text-container">
      <Transition name="fade" mode="out-in">
        <p v-if="currentCard && currentCard.type !== 'reveal'" :key="currentCardIndex"
          class="card-text text-white inset-x-0 bottom-4 text-center px-4">
          {{ currentCard.text }}
        </p>
        <p v-else-if="lastDecisionText" :key="'last-decision'"
          class="card-text text-white absolute inset-x-0 bottom-4 text-center px-4">
          {{ lastDecisionText }}
        </p>
      </Transition>
    </div>
    <div v-if="isDataReady" class="swiper-wrapper flex-grow relative overflow-visible px-6">
      <swiper-container ref="swiperRef" :modules="modules" effect="tinder" :slides-per-view="1" :allow-touch-move="true"
        observer observer-parents :init="false" class="h-full overflow-visible">
        <swiper-slide v-for="(card, index) in currentScenario.cards" :key="index" class="overflow-visible">
          <div :ref="el => { if (el) cardRefs[index] = el }"
            :class="['card-container', { 'is-flipped': cardFlipStates[card.id] }]">
            <div class="swiper-tinder-label swiper-tinder-label-yes" data-swiper-parallax="-300"
              data-swiper-parallax-duration="600" v-html="card.trustLabel || 'Trust'" />
            <div class="swiper-tinder-label swiper-tinder-label-no" data-swiper-parallax="-300"
              data-swiper-parallax-duration="600" v-html="card.distrustLabel || 'Distrust'" />
            <div :class="`swiper-slide card-face card-front ${card.type}`">
              <div class="card-image" :style="{ backgroundImage: `url(${card.image})` }"></div>
              <div class="card-gradient-overlay"></div>
              <div class="hidden absolute top-0 left-0 bg-red-400 bg-opacity-50 text-white p-2">
                type: {{ card.type }}
              </div>
              <div class="card-content">
                <p v-if="card.type === 'reveal'" class="reveal-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                    <path fill="currentColor"
                      d="M14.6 8.075q0-1.075-.712-1.725T12 5.7q-.725 0-1.312.313t-1.013.912q-.4.575-1.088.663T7.4 7.225q-.35-.325-.387-.8t.237-.9q.8-1.2 2.038-1.862T12 3q2.425 0 3.938 1.375t1.512 3.6q0 1.125-.475 2.025t-1.75 2.125q-.925.875-1.25 1.363T13.55 14.6q-.1.6-.513 1t-.987.4t-.987-.387t-.413-.963q0-.975.425-1.787T12.5 11.15q1.275-1.125 1.688-1.737t.412-1.338M12 22q-.825 0-1.412-.587T10 20t.588-1.412T12 18t1.413.588T14 20t-.587 1.413T12 22" />
                  </svg>
                </p>
              </div>
            </div>
            <div class="card-face card-back" v-if="card.type === 'reveal'">
              <div class="slide-inner h-full flex flex-col justify-between">
                <div v-if="decisionFeedback" class="feedback-text p-4 ">
                  <p>{{ decisionFeedback }}</p>
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper-container>
    </div>
    <div v-else>
      Loading scenarios...
    </div>
    <div class="fixed-bottom-buttons">
      <div class="absolute left-0 right-0 flex flex-col items-center z-50"
        :class="showDebugPanel ? 'bottom-panel-open' : 'bottom-safe'">
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
      <div class="swiper-tinder-buttons flex justify-center gap-5 z-10 py-2 mb-4">
        <button class="swiper-tinder-button swiper-tinder-button-no" @click="swipeLeft" :disabled="!canNavigateBack"
          :class="{ 'opacity-50 cursor-not-allowed': !canNavigateBack }">
          <BackButton v-if="!isDecisionCard" />
          <ThumbsDown v-else />
        </button>
        <button class="swiper-tinder-button swiper-tinder-button-yes" @click="swipeRight" :disabled="!canNavigate"
          :class="{ 'opacity-50 cursor-not-allowed': !canNavigate }">
          <NextButton v-if="!isDecisionCard" />
          <ThumbsUp v-else />
        </button>
      </div>
      <div class="container-end text-blue-200 text-center p-2 flex flex-row justify-between">
        <svg width="32px" height="37px" viewBox="0 0 32 37" version="1.1" xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink">
          <title>icon-home</title>
          <g id="UX-Flow" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Scenerio-00---00" transform="translate(-28, -740)">
              <g id="icon-home" transform="translate(28, 740)">
                <text id="HOME" font-family="Roboto-Medium, Roboto" font-size="10" font-weight="400" fill="#fff">
                  <tspan x="1.79101562" y="35">HOME</tspan>
                </text>
                <g id="arrow-return" transform="translate(0, -0)" fill="#fff" fill-rule="nonzero">
                  <path
                    d="M25.5057983,0 L18.0057983,0 C17.4535136,0 17.0057983,0.44771525 17.0057983,1 C17.0057983,1.55228475 17.4535136,2 18.0057983,2 L25.5057983,2 C27.9910797,2 30.0057983,4.01471863 30.0057983,6.5 C30.0057983,8.98528137 27.9910797,11 25.5057983,11 L3.41579832,11 L7.71579832,6.71 C8.10792048,6.31787782 8.10792047,5.68212219 7.7157983,5.29000002 C7.32367614,4.89787786 6.6879205,4.89787785 6.29579832,5.29 L0.295798324,11.29 C0.106485674,11.4777666 0,11.7333625 0,12 C0,12.2666375 0.106485674,12.5222334 0.295798324,12.71 L6.29579832,18.71 C6.48356492,18.8993127 6.73916079,19.0057983 7.00579832,19.0057983 C7.27243586,19.0057983 7.52803172,18.8993127 7.71579832,18.71 C7.90511098,18.5222334 8.01159665,18.2666375 8.01159665,18 C8.01159665,17.7333625 7.90511098,17.4777666 7.71579832,17.29 L3.41579832,13 L25.5057983,13 C29.0956492,13 32.0057983,10.0898509 32.0057983,6.5 C32.0057983,2.91014913 29.0956492,0 25.5057983,0 Z"
                    id="Path"></path>
                </g>
              </g>
            </g>
          </g>
        </svg>
        <a href="/" class="cursor-pointer" @click.prevent="retryScenario">
          <svg width="32px" height="39px" viewBox="0 0 32 39" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink">
            <title>icon-retry</title>
            <g id="UX-Flow" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Scenerio-00---00" transform="translate(-302, -738)">
                <g id="icon-retry" transform="translate(302, 738)">
                  <text id="RETRY" font-family="Roboto-Medium, Roboto" font-size="10" font-weight="400" fill="#fff">
                    <tspan x="0.851074219" y="37">RETRY</tspan>
                  </text>
                  <g id="arrow-retry" transform="translate(4, 0)" fill="#fff" fill-rule="nonzero">
                    <path
                      d="M13.4918439,0 C7.75606199,-0.000796072417 3.07928399,4.5944661 2.98368767,10.325 L1.42497783,8.96875 C1.05989384,8.67492329 0.527988496,8.7205009 0.21829939,9.07214718 C-0.0913897156,9.42379347 -0.0690052759,9.95676748 0.269080645,10.28125 L3.29893236,12.90625 C3.62205979,13.1716525 4.08791813,13.1716525 4.41104556,12.90625 L7.79116915,10.28125 C8.07415324,9.9627877 8.08657068,9.48699187 7.82058256,9.15422457 C7.55459444,8.82145728 7.08746406,8.72837963 6.71408314,8.93375 L4.73504705,10.5 C4.73504705,5.66750844 8.65559855,1.75 13.4918439,1.75 C18.3280893,1.75 22.2486408,5.66750844 22.2486408,10.5 C22.2486408,15.3324916 18.3280893,19.25 13.4918439,19.25 C13.0082194,19.25 12.6161642,19.6417508 12.6161642,20.125 C12.6161642,20.6082492 13.0082194,21 13.4918439,21 C19.2953383,21 24,16.2989898 24,10.5 C24,4.70101019 19.2953383,0 13.4918439,0 Z"
                      id="Path"></path>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </a>
      </div>
    </div>

  </div>
</template>

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
    s.slideNext();
  } else if (currentCard.value.type === 'reveal') {
    if (isRevealCardFlipped.value) {
      await transitionToNextScenario();
    } else {
      flipRevealCard(currentCardIndex.value);
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
  console.log('Initializing swiper...');
  if (swiperRef.value && isDataReady.value) {
    console.log('Swiper initialized');
    const swiperParams = {
      modules: [EffectTinder],
      effect: 'tinder',
      slidesPerView: 1,
      allowTouchMove: true,
      on: {
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
      swiper.value.slideNext();

    }
  }
};

const swipeLeft = async () => {
  if (swiper.value && !isTransitioning.value) {
    if (canNavigateBack.value) {
      await previousCard();
      swiper.value.slidePrev();
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

<style>
.swiper-tinder-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.floating-text-container {
  @apply flex flex-col h-1/5 relative z-10 items-center justify-center pointer-events-none px-6 py-0 m-0;


}

.card-text {
  @apply text-xl text-white leading-snug;
}

.swiper-wrapper {
  overflow: visible !important;
}

swiper-container {
  overflow: visible !important;
}

swiper-slide {
  overflow: visible !important;
}

.card-container {

  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s;
}

.card-face {
  @apply h-3/5;
  position: absolute;

  backface-visibility: hidden;
  border-radius: 10px;
  overflow: hidden;
}

.card-front {
  background-color: #f0f0f0;
}

.card-back {
  transform: rotateY(180deg);
}

.is-flipped {
  transform: rotateY(180deg);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}



.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.swiper-tinder-label {
  @apply px-6 py-8 leading-snug text-xl;
  position: absolute;
  top: 0;
  font-weight: bold;

  opacity: 0;
  color: var(--swiper-tinder-label-text-color);
  z-index: 10;
  transition: opacity 0.3s;
  width: 100%;
}

.swiper-tinder-label-yes {

  background-color: var(--swiper-tinder-yes-color);
}

.swiper-tinder-label-no {
  text-align: right;
  background-color: var(--swiper-tinder-no-color);
}

.swiper-slide {
  overflow: hidden;
}

.card-container {
  position: relative;
  width: 100%;
  height: 100%;

  z-index: 1;
}


.swiper-slide-active .swiper-tinder-label {
  z-index: 11;
}

.swiper-tinder-container {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.swiper-slide {
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiper-tinder-button {
  transition: opacity 0.3s ease;
}

.swiper-tinder-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.safe-area-padding {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}

.bottom-safe {
  bottom: calc(env(safe-area-inset-bottom, 20px) + 0.5rem);
}

.bottom-panel-open {
  bottom: calc(env(safe-area-inset-bottom, 20px) + 8rem);
  /* Adjust this value as needed */
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}

.fixed-bottom-buttons {
  position: fixed;
  bottom: max(env(safe-area-inset-bottom), 20px);
  left: 0;
  right: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px 0;
}
</style>