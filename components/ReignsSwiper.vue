<template>
  <StartGameScreen v-if="!gameStarted" />
  <div v-else class="swiper-tinder-container h-full bg-black flex flex-col">

    <div v-if="isDataReady" class="debug-panel absolute bottom-0 left-0 bg-white bg-opacity-75 p-4 text-black">
      <h3 class="font-bold">Debug Info</h3>
      <p>Current Card Index: {{ currentCardIndex }}</p>
      <p>Current Card Type: {{ currentScenario.cards[currentCardIndex]?.type }}</p>
      <p>Current Scenario: {{ currentScenario.id }}</p>
      <p>All Scenarios IDs: {{ scenarioIds.join(', ') }}</p>
    </div>
    <div v-if="isTransitioning" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <p class="text-white text-2xl">Loading next scenario...</p>
    </div>
    <div class="container-start text-white text-center mx-auto py-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="M12 6a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V19a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1.8c-1.79-1.04-3-2.98-3-5.2a6 6 0 0 1 6-6m2 15v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1zm6-10h3v2h-3zM1 11h3v2H1zM13 1v3h-2V1zM4.92 3.5l2.13 2.14-1.42 1.41L3.5 4.93zm12.03 2.13l2.12-2.13 1.43 1.43-2.13 2.12z" />
      </svg>
    </div>
    <div v-if="isDataReady" class="swiper-tinder-container h-full bg-black flex flex-col">
      <swiper-container ref="swiperRef" :modules="modules" effect="tinder" :slides-per-view="1" :allow-touch-move="true"
        observer observer-parents :init="false" class="h-full">
        <swiper-slide v-for="(card, index) in currentScenario.cards" :key="index">
          <div :ref="el => { if (el) cardRefs[index] = el }"
            :class="['card-container', { 'is-flipped': cardFlipStates[card.id] }]">
            <div class="swiper-tinder-label swiper-tinder-label-yes" v-html="card.trustLabel || 'Trust'" />
            <div class="swiper-tinder-label swiper-tinder-label-no" v-html="card.distrustLabel || 'Distrust'" />
            <div :class="`swiper-slide card-face card-front ${card.type}`"
              :style="{ backgroundImage: `url(${card.image})` }">
              <div class="absolute top-0 left-0 bg-red-400 bg-opacity-50 text-white p-2">
                type: {{ card.type }}
              </div>
              <div class="card-content">
                <p v-if="card.type === 'reveal'" class="reveal-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                    <path fill="currentColor"
                      d="M14.6 8.075q0-1.075-.712-1.725T12 5.7q-.725 0-1.312.313t-1.013.912q-.4.575-1.088.663T7.4 7.225q-.35-.325-.387-.8t.237-.9q.8-1.2 2.038-1.862T12 3q2.425 0 3.938 1.375t1.512 3.6q0 1.125-.475 2.025t-1.75 2.125q-.925.875-1.25 1.363T13.55 14.6q-.1.6-.513 1t-.987.4t-.987-.387t-.413-.963q0-.975.425-1.787T12.5 11.15q1.275-1.125 1.688-1.737t.412-1.338M12 22q-.825 0-1.412-.587T10 20t.588-1.412T12 18t1.413.588T14 20t-.587 1.413T12 22" />
                  </svg>
                </p>
                <p v-else class="card-text">{{ card.text }}</p>
              </div>
            </div>
            <div class="card-face card-back" v-if="card.type === 'reveal'">
              <div class="slide-inner h-full flex flex-col justify-between bg-gray-800">
                <div v-if="decisionFeedback" class="feedback-text p-4 bg-black bg-opacity-70">
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
    <div class="swiper-tinder-buttons py-2">
      <button class="swiper-tinder-button swiper-tinder-button-no" @click="swipeLeft" :disabled="!canNavigateBack">
        <svg width="56px" height="70px" viewBox="0 0 56 70" version="1.1" xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink">
          <title>icon-back</title>
          <g id="UX-Flow" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Scenerio-00---00" transform="translate(-102, -580)">
              <g id="icon-back" transform="translate(102, 580)">
                <text id="BACK" font-family="Roboto-Medium, Roboto" font-size="10" font-weight="400" fill="#fff">
                  <tspan x="15.1020508" y="68">BACK</tspan>
                </text>
                <g id="button">
                  <circle id="button-back" stroke="#000000" stroke-width="3" fill="#FFFFFF" cx="28" cy="28" r="26.5">
                  </circle>
                  <path
                    d="M13,27.726715 C13,26.9935424 13.5980123,26.393674 14.3289163,26.393674 L38.1663523,26.393674 L32.3025091,20.5116306 C31.7875541,19.9950772 31.7875541,19.1452635 32.3025091,18.6287102 C32.8174642,18.1121568 33.6646483,18.1121568 34.1796034,18.6287102 L42.3192157,26.7935863 C42.5683875,27.0435315 42.7012791,27.3767917 42.7012791,27.743378 C42.7012791,28.1099643 42.5683875,28.4432245 42.3192157,28.6931697 L34.1796034,36.8580458 C33.9138201,37.124654 33.5815911,37.2412951 33.2327505,37.2412951 C32.88391,37.2412951 32.5516809,37.107991 32.2858977,36.8580458 C31.7709426,36.3414924 31.7709426,35.4916788 32.2858977,34.9751254 L38.1497408,29.093082 L14.3289163,29.093082 C13.5980123,29.043093 13,28.4598875 13,27.726715 Z"
                    id="arrow-left" fill="#000"
                    transform="translate(27.8506, 27.7413) scale(-1, 1) translate(-27.8506, -27.7413)"></path>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </button>
      <button class="swiper-tinder-button swiper-tinder-button-yes" @click="swipeRight" :disabled="!canNavigate">
        <svg width="56px" height="70px" viewBox="0 0 56 70" version="1.1" xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink">
          <title>icon-next</title>
          <g id="UX-Flow" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Scenerio-00---00" transform="translate(-202, -580)">
              <g id="icon-next" transform="translate(202, 580)">
                <text id="NEXT" font-family="Roboto-Medium, Roboto" font-size="10" font-weight="400" fill="#fff">
                  <tspan x="15.4243164" y="68">NEXT</tspan>
                </text>
                <g id="button" transform="translate(28, 28) scale(-1, 1) translate(-28, -28)">
                  <circle id="button-back" stroke="#000000" stroke-width="3" fill="#FFFFFF" cx="28" cy="28" r="26.5">
                  </circle>
                  <path
                    d="M13,27.726715 C13,26.9935424 13.5980123,26.393674 14.3289163,26.393674 L38.1663523,26.393674 L32.3025091,20.5116306 C31.7875541,19.9950772 31.7875541,19.1452635 32.3025091,18.6287102 C32.8174642,18.1121568 33.6646483,18.1121568 34.1796034,18.6287102 L42.3192157,26.7935863 C42.5683875,27.0435315 42.7012791,27.3767917 42.7012791,27.743378 C42.7012791,28.1099643 42.5683875,28.4432245 42.3192157,28.6931697 L34.1796034,36.8580458 C33.9138201,37.124654 33.5815911,37.2412951 33.2327505,37.2412951 C32.88391,37.2412951 32.5516809,37.107991 32.2858977,36.8580458 C31.7709426,36.3414924 31.7709426,35.4916788 32.2858977,34.9751254 L38.1497408,29.093082 L14.3289163,29.093082 C13.5980123,29.043093 13,28.4598875 13,27.726715 Z"
                    id="arrow-right" fill="#000000"
                    transform="translate(27.8506, 27.7413) scale(-1, 1) translate(-27.8506, -27.7413)"></path>
                </g>
              </g>
            </g>
          </g>
        </svg>
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
      <a href="/" class="cursor-pointer">
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
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { register } from 'swiper/element/bundle';
import EffectTinder from '~/effect-tinder.esm';
import { useGameState } from '@/composables/gameState';
import '/assets/css/styles.css';

register();

const modules = [EffectTinder];
const swiperRef = ref(null);
const swiper = ref(null);
const cardRefs = ref([]);
const cardFlipStates = ref({});
const isTransitioning = ref(false);
const flipTimeout = ref(null);


const {
  gameStarted,
  startGame,
  currentScenario,
  currentCard,
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

const handleTinderSwipe = (s, direction) => {
  if (!isDataReady.value) return;

  const currentCard = currentScenario.value.cards[currentCardIndex.value];
  if (!currentCard) return;

  if (currentCard.type === 'decision') {
    const isTrust = direction === 'right';
    makeChoice(isTrust);
    decisionFeedback.value = isTrust
      ? currentCard.trustChoice?.feedback
      : currentCard.distrustChoice?.feedback;
    s.slideNext();
  } else if (currentCard.type === 'reveal') {
    if (isRevealCardFlipped.value) {
      // Transition to the next scenario if the reveal card is flipped and user swipes
      transitionToNextScenario();
    } else {
      // If the reveal card is not flipped, flip it
      flipRevealCard(currentCardIndex.value);
    }
  }
};
const handleSlideChange = (s) => {
  if (!isDataReady.value) return;

  currentCardIndex.value = s.activeIndex;
  const currentCard = currentScenario.value.cards[currentCardIndex.value];

  if (currentCard?.type === 'reveal') {
    // Clear any existing timeout
    if (flipTimeout.value) {
      clearTimeout(flipTimeout.value);
    }
    // Set a new timeout to flip the card after 1 second
    flipTimeout.value = setTimeout(() => {
      if (!isRevealCardFlipped.value) {
        isRevealCardFlipped.value = true;
        cardFlipStates.value[currentCard.id] = true;
        s.allowSlideNext = true;
      }
    }, 1000);
  } else {
    isRevealCardFlipped.value = false;
  }
};
const flipRevealCard = (index) => {
  const card = currentScenario.value.cards[index];
  if (card && card.type === 'reveal' && !isRevealCardFlipped.value) {
    // Clear any existing timeout
    if (flipTimeout.value) {
      clearTimeout(flipTimeout.value);
    }
    // Set a new timeout to flip the card after 1 second
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
      await handleTinderSwipe(swiper.value, 'right');
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
</script>
<style>
:root {
  --swiper-tinder-no-color: #F44336;
  --swiper-tinder-yes-color: #4CAF50;
  --swiper-tinder-label-text-color: #fff;
  --swiper-tinder-label-font-size: 42px;
}

.swiper-tinder-label {
  position: absolute;
  font-size: var(--swiper-tinder-label-font-size);
  font-weight: bold;
  padding: 4px 12px;
  text-transform: uppercase;
  border-radius: 4px;
  opacity: 0;
  color: var(--swiper-tinder-label-text-color);
  z-index: 10;
  transition: opacity 0.3s;
}

.swiper-tinder-label-yes {
  left: 5%;
  top: 5%;
  transform: rotate(-20deg);
  background-color: var(--swiper-tinder-yes-color);
}

.swiper-tinder-label-no {
  right: 5%;
  top: 5%;
  transform: rotate(20deg);
  background-color: var(--swiper-tinder-no-color);
}

.swiper-slide {
  overflow: hidden;
}

.card-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Ensure the card container doesn't overlap the labels */
.card-container {
  z-index: 1;
}

.swiper-slide-active .swiper-tinder-label {
  z-index: 11;
}
</style>