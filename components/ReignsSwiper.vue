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


    <div v-if="isDataReady" class="swiper-wrapper h-3/5 relative overflow-visible px-6">
      <swiper-container ref="swiperRef" :modules="modules" effect="tinder" :slides-per-view="1" :allow-touch-move="true"
        observer observer-parents :init="false" class="overflow-visible">
        <swiper-slide v-for="(card, index) in currentScenario.cards" :key="index" class="overflow-visible">
          <div :ref="el => { if (el) cardRefs[index] = el }"
            :class="['card-container', { 'is-flipped': cardFlipStates[card.id] }]">
            <div :class="`card-face card-front ${card.type} aspect-[11/19] mx-auto rounded-xl`">
              <div class="card-image h-full w-full aspect-[11/19] mx-auto rounded-xl"
                :style="{ backgroundImage: `url(${card.image})` }">
                <div class="swiper-tinder-label swiper-tinder-label-no" data-swiper-parallax="-300"
                  data-swiper-parallax-duration="600" v-html="card.distrustLabel || 'Distrust'" />
                <div class="swiper-tinder-label swiper-tinder-label-yes" data-swiper-parallax="-300"
                  data-swiper-parallax-duration="600" v-html="card.trustLabel || 'Trust'" />
              </div>
            </div>
            <div v-if="card.type === 'reveal'"
              :class="`card-face card-back ${card.type} aspect-[11/19] mx-auto rounded-xl`">
              <div class="h-full w-full flex items-center justify-center bg-gray-800 rounded-xl">
                <div v-if="decisionFeedback" class="feedback-text p-4 text-white">
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
    <div class="">
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
        <HomeButton />
        <a href="/" class="cursor-pointer" @click.prevent="retryScenario">
          <RetryButton />
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

.swiper-tinder-label,
.card-content {
  position: absolute;
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
  transition-property: transform, opacity;
}

.swiper-slide-shadow {
  background: rgba(0, 0, 0, 0.15);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
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
  padding: 10px 0;
}

.swiper-tinder-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px 0;
  /* Add some padding to prevent cutoff */
}

.swiper-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

swiper-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

swiper-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  height: auto !important;
}

.card-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-face {
  @apply aspect-[11/19] rounded-xl overflow-hidden;


}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  /* Match the rounded-xl class */
}

/* Ensure labels don't overflow */
.swiper-tinder-label {
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.swiper-tinder-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px 0;
}

.swiper-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

swiper-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

swiper-slide {
  align-items: center;
  justify-content: center;
  height: auto !important;
}

.card-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-face {
  position: relative;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.swiper-tinder-label {
  position: absolute;
  top: 10px;
  max-width: 45%;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.swiper-tinder-label-no {
  left: 10px;
  background-color: rgba(255, 0, 0, 0.7);
  color: white;
}

.swiper-tinder-label-yes {
  right: 10px;
  background-color: rgba(0, 255, 0, 0.7);
  color: white;
}

.swiper-slide-active.swiper-slide-swiping .swiper-tinder-label {
  opacity: 1;
}

.swiper-tinder-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px 0;
}

.floating-text-container {
  @apply flex flex-col h-1/5 relative z-10 items-center justify-center pointer-events-none px-6 py-0 m-0;
}

.card-text {
  @apply text-xl text-white leading-snug;
}

.swiper-wrapper,
swiper-container,
swiper-slide {
  overflow: visible !important;
}

.card-container {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.5s;
}

.card-face {
  backface-visibility: hidden;
  border-radius: 10px;
  overflow: hidden;
}

.card-back {
  /* transform: rotateY(180deg); */
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

.swiper-tinder-label {
  position: absolute;
  top: 10px;
  max-width: 45%;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.swiper-tinder-label-no {
  left: 10px;
  background-color: rgba(255, 0, 0, 0.7);
  color: white;
}

.swiper-tinder-label-yes {
  right: 10px;
  background-color: rgba(0, 255, 0, 0.7);
  color: white;
}

.swiper-slide-active.swiper-slide-swiping .swiper-tinder-label {
  opacity: 1;
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

.bottom-safe {
  bottom: calc(env(safe-area-inset-bottom, 20px) + 0.5rem);
}

.bottom-panel-open {
  bottom: calc(env(safe-area-inset-bottom, 20px) + 8rem);
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}

@media (max-height: 600px) {
  .floating-text-container {
    @apply h-1/5;
  }

  .card-text {
    @apply text-base;
  }

  .swiper-tinder-buttons {
    @apply py-1;
  }

  .container-end {
    @apply p-1;
  }
}

.card-container {
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 1000px;
}

.card-face {

  backface-visibility: hidden;
  transition: transform 0.6s;
}

.card-front {
  transform: rotateY(0deg);
  z-index: 2;
}

.card-back {
  transform: rotateY(180deg);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('/assets/images/card-back.png');
  /* Adjust the background as needed */
  color: white;
}

.is-flipped .card-front {
  transform: rotateY(-180deg);
}

.is-flipped .card-back {
  transform: rotateY(0deg);
}


.card-back {
  transform: rotateY(180deg);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #333;
  color: white;
}

.card-container {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card-face {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
}

.is-flipped .card-front {
  transform: rotateY(180deg);
}

.is-flipped .card-back {
  transform: rotateY(0deg);
}
</style>