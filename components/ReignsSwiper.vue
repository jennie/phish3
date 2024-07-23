<template>
  <div class="swiper-tinder-container h-full bg-black flex flex-col">
    <div class="container-start text-white text-center mx-auto py-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="M12 6a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V19a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1.8c-1.79-1.04-3-2.98-3-5.2a6 6 0 0 1 6-6m2 15v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1zm6-10h3v2h-3zM1 11h3v2H1zM13 1v3h-2V1zM4.92 3.5l2.13 2.14l-1.42 1.41L3.5 4.93zm12.03 2.13l2.12-2.13l1.43 1.43l-2.13 2.12z" />
      </svg>
    </div>
    <div v-if="currentScenario && currentScenario.cards" class="swiper-wrapper flex-grow overflow-hidden relative">
      <swiper-container ref="swiperRef" :modules="modules" effect="tinder" :slides-per-view="1" :allow-touch-move="true"
        observer observer-parents :init="false" class="h-full">
        <swiper-slide v-for="(card, index) in currentScenario.cards" :key="index">
          <div :ref="el => { if (el) cardRefs[index] = el }"
            :class="['card-container', { 'is-flipped': cardFlipStates[card.id] }]">
            <div class="swiper-tinder-label swiper-tinder-label-yes">{{ card.trustLabel }}</div>
            <div class="swiper-tinder-label swiper-tinder-label-no">{{ card.distrustLabel }}</div>

            <div :class="`swiper-slide card-face card-front ${card.type}`"
              :style="{ backgroundImage: `url(${card.image})` }">
              <div class="absolute top-0 left-0 bg-black bg-opacity-50 text-white p-2">
                Type: {{ card.type }}<br>
                Flipped: {{ cardFlipStates[card.id] }}
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
                <!-- <div class="p-2 bg-gradient-to-b from-transparent to-black to-90%" v-html="card.text" /> -->
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
      <button class="swiper-tinder-button swiper-tinder-button-no" @click="swipeLeft">
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
      <button class="swiper-tinder-button swiper-tinder-button-yes" @click="swipeRight">
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
import { ref, onMounted, watch, nextTick } from 'vue';
import { register } from 'swiper/element/bundle';
import EffectTinder from '~/effect-tinder.esm';
import { useGameState } from '../composables/gameState';

register();

const modules = [EffectTinder];
const swiperRef = ref(null);
const swiper = ref(null);
const cardRefs = ref([]);
const cardFlipStates = ref({});

const { currentScenario, currentCard, makeChoice, nextCard, previousCard, gameOver, playerState, scenarios } = useGameState();

const decisionFeedback = ref('');
const currentCardIndex = ref(0);
const lastDecisionDirection = ref(null);
const lastDecisionCard = ref(null);

const flipRevealCard = (index) => {
  console.log('Flipping reveal card at index:', index);
  const card = currentScenario.value.cards[index];
  if (card && card.type === 'reveal') {
    cardFlipStates.value[card.id] = true;
    if (lastDecisionCard.value) {
      console.log('Previous decision direction:', lastDecisionDirection.value);
      decisionFeedback.value = lastDecisionDirection.value === 'right'
        ? lastDecisionCard.value.trustChoice.feedback
        : lastDecisionCard.value.distrustChoice.feedback;
      console.log('Set decision feedback:', decisionFeedback.value);
    } else {
      console.log('No previous decision card found');
      decisionFeedback.value = 'No decision has been made yet.';
    }
  } else {
    console.log('Card is not a reveal card:', card);
  }
};

const handleTinderSwipe = (direction) => {
  const currentCard = currentScenario.value.cards[currentCardIndex.value];

  if (currentCard.type === 'decision') {
    console.log('Decision made on card:', currentCard);
    lastDecisionDirection.value = direction;
    lastDecisionCard.value = currentCard;
    const isTrust = direction === 'right';
    makeChoice(isTrust);
    console.log(`Choice made: ${isTrust ? 'trust' : 'distrust'}`);
  }
};

const handleSlideChange = (swiper) => {
  const newIndex = swiper.activeIndex;
  console.log(`Slide changed to ${newIndex}`);

  currentCardIndex.value = newIndex;
  const currentCard = currentScenario.value.cards[newIndex];
  console.log('Current card:', currentCard);

  if (currentCard && currentCard.type === 'reveal') {
    console.log('Current card is a reveal card, flipping');
    flipRevealCard(newIndex);
  }
};

const onSwiperInitialized = (swiperInstance) => {
  swiper.value = swiperInstance;
  swiper.value.on('slideChange', handleSlideChange);
  swiper.value.on('tinderSwipe', (s, direction) => {
    console.log('🐯 Swipe detected:', direction);
    // handleTinderSwipe(direction)
  });
};

const initializeSwiper = async () => {
  if (swiperRef.value) {
    const swiperParams = {
      modules: [EffectTinder],
      effect: 'tinder',
      slidesPerView: 1,
      allowTouchMove: true,
      on: {
        slideChange: handleSlideChange,
        tinderSwipe: (s, direction) => handleTinderSwipe(direction),
      },
    };
    Object.assign(swiperRef.value, swiperParams);
    await swiperRef.value.initialize();
    swiper.value = swiperRef.value.swiper;
    console.log('Swiper initialized');
  }
};

onMounted(async () => {
  await nextTick();
  await initializeSwiper();
});

watch(currentScenario, async (newScenario) => {
  console.log('Current scenario changed:', newScenario);
  if (newScenario) {
    newScenario.cards.forEach((card, index) => {
      if (!card.id) {
        card.id = `card-${index}`;
      }
      cardFlipStates.value[card.id] = false;
    });
    decisionFeedback.value = '';
    lastDecisionDirection.value = null;
    lastDecisionCard.value = null;
    currentCardIndex.value = 0;
    console.log('Reset scenario state');

    // Re-initialize Swiper when scenario changes
    await nextTick();
    await initializeSwiper();
  }
}, { deep: true });

watch(decisionFeedback, (newFeedback) => {
  console.log('Decision feedback changed:', newFeedback);
});

watch(playerState, (newState) => {
  console.log('Player state updated:', newState);
}, { deep: true });


const currentCardLabel = (type) => {
  const activeIndex = swiper.value?.activeIndex || 0;
  const currentCard = currentScenario.value.cards[activeIndex];
  return type === 'trust' ? currentCard.trustLabel : currentCard.distrustLabel;
};

const swipeLeft = () => {
  if (swiper.value) {
    swiper.value.slidePrev();
  }
};

const swipeRight = () => {
  if (swiper.value) {
    swiper.value.slideNext();
  }
};

// Add this watch to log playerState changes
watch(playerState, (newState) => {
  console.log('Player state updated:', newState);
}, { deep: true });

// Debug: Log card refs when they change
watch(() => cardRefs.value, (newRefs) => {
  console.log('Card refs updated:', newRefs.length);
}, { deep: true });

watch(currentCardIndex, (newIndex) => {
  if (newIndex < currentScenario.value.cards.length) {
    const currentCard = currentScenario.value.cards[newIndex];
    if (currentCard.type === 'reveal') {
      flipRevealCard(newIndex);
    }
  }
});
watch(() => swiper.value?.activeIndex, (newIndex) => {
  if (newIndex !== undefined) {
    const currentCard = currentScenario.value.cards[newIndex];
    if (currentCard.type === 'reveal') {
      // Find the previous decision card
      const previousDecisionCard = currentScenario.value.cards
        .slice(0, newIndex)
        .reverse()
        .find(card => card.type === 'decision');

      if (previousDecisionCard) {
        // Assume the last decision was "trust" if feedback is not set
        const lastDecisionWasTrust = decisionFeedback.value === previousDecisionCard.trustChoice.feedback;
        decisionFeedback.value = lastDecisionWasTrust
          ? previousDecisionCard.trustChoice.feedback
          : previousDecisionCard.distrustChoice.feedback;
      }
    }
  }
});
</script>


<style lang="scss">
:root {
  --swiper-tinder-no-color: red;
  --swiper-tinder-yes-color: green;
  --swiper-tinder-label-text-color: #fff;
  --swiper-tinder-label-font-size: 32px;
  --swiper-tinder-button-size: 56px;
  --swiper-tinder-button-icon-size: 32px;
}

html,
body {
  @apply relative h-full m-0 p-0;
}

body {
  @apply bg-black leading-normal font-sans antialiased px-4;
}

#app {
  @apply h-screen w-full flex items-center justify-center box-border bg-black;
}

.swiper-tinder {
  @apply p-4 w-full h-full;
}

.swiper-slide {
  @apply rounded-2xl overflow-hidden;
}

.swiper-slide::before {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50%;
  pointer-events: none;
  content: '';
  z-index: 10;
}

.swiper-slide img {
  @apply w-full h-full object-cover;
}

.answer-slide {
  transform-origin: center center;
  background-color: #bbeeee;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='1600' viewBox='0 0 50 4000'%3E%3Cg fill='%23FFF'%3E%3Ccircle cx='25' cy='2226' r='24'/%3E%3Ccircle cx='25' cy='2176' r='23'/%3E%3Ccircle cx='25' cy='2126' r='22'/%3E%3Ccircle cx='25' cy='2076' r='21'/%3E%3Ccircle cx='25' cy='2026' r='20'/%3E%3Ccircle cx='25' cy='1976' r='19'/%3E%3Ccircle cx='25' cy='1926' r='18'/%3E%3Ccircle cx='25' cy='1876' r='17'/%3E%3Ccircle cx='25' cy='1826' r='16'/%3E%3Ccircle cx='25' cy='1776' r='15'/%3E%3Ccircle cx='25' cy='1726' r='14'/%3E%3Ccircle cx='25' cy='1676' r='13'/%3E%3Ccircle cx='25' cy='1626' r='12'/%3E%3Ccircle cx='25' cy='1576' r='11'/%3E%3Ccircle cx='25' cy='1526' r='10'/%3E%3Ccircle cx='25' cy='1476' r='9'/%3E%3Ccircle cx='25' cy='1426' r='8'/%3E%3Ccircle cx='25' cy='1376' r='7'/%3E%3Ccircle cx='25' cy='1326' r='6'/%3E%3Ccircle cx='25' cy='1276' r='5'/%3E%3Ccircle cx='25' cy='1226' r='4'/%3E%3Ccircle cx='25' cy='1176' r='3'/%3E%3Ccircle cx='25' cy='1126' r='2'/%3E%3Ccircle cx='25' cy='1076' r='1'/%3E%3Ccircle cx='50' cy='2201' r='24'/%3E%3Ccircle cx='50' cy='2151' r='23'/%3E%3Ccircle cx='50' cy='2101' r='22'/%3E%3Ccircle cx='50' cy='2051' r='21'/%3E%3Ccircle cx='50' cy='2001' r='20'/%3E%3Ccircle cx='50' cy='1951' r='19'/%3E%3Ccircle cx='50' cy='1901' r='18'/%3E%3Ccircle cx='50' cy='1851' r='17'/%3E%3Ccircle cx='50' cy='1801' r='16'/%3E%3Ccircle cx='50' cy='1751' r='15'/%3E%3Ccircle cx='50' cy='1701' r='14'/%3E%3Ccircle cx='50' cy='1651' r='13'/%3E%3Ccircle cx='50' cy='1601' r='12'/%3E%3Ccircle cx='50' cy='1551' r='11'/%3E%3Ccircle cx='50' cy='1501' r='10'/%3E%3Ccircle cx='50' cy='1451' r='9'/%3E%3Ccircle cx='50' cy='1401' r='8'/%3E%3Ccircle cx='50' cy='1351' r='7'/%3E%3Ccircle cx='50' cy='1301' r='6'/%3E%3Ccircle cx='50' cy='1251' r='5'/%3E%3Ccircle cx='50' cy='1201' r='4'/%3E%3Ccircle cx='50' cy='1151' r='3'/%3E%3Ccircle cx='50' cy='1101' r='2'/%3E%3Ccircle cx='50' cy='1051' r='1'/%3E%3Ccircle cx='0' cy='2201' r='24'/%3E%3Ccircle cx='0' cy='2151' r='23'/%3E%3Ccircle cx='0' cy='2101' r='22'/%3E%3Ccircle cx='0' cy='2051' r='21'/%3E%3Ccircle cx='0' cy='2001' r='20'/%3E%3Ccircle cx='0' cy='1951' r='19'/%3E%3Ccircle cx='0' cy='1901' r='18'/%3E%3Ccircle cx='0' cy='1851' r='17'/%3E%3Ccircle cx='0' cy='1801' r='16'/%3E%3Ccircle cx='0' cy='1751' r='15'/%3E%3Ccircle cx='0' cy='1701' r='14'/%3E%3Ccircle cx='0' cy='1651' r='13'/%3E%3Ccircle cx='0' cy='1601' r='12'/%3E%3Ccircle cx='0' cy='1551' r='11'/%3E%3Ccircle cx='0' cy='1501' r='10'/%3E%3Ccircle cx='0' cy='1451' r='9'/%3E%3Ccircle cx='0' cy='1401' r='8'/%3E%3Ccircle cx='0' cy='1351' r='7'/%3E%3Ccircle cx='0' cy='1301' r='6'/%3E%3Ccircle cx='0' cy='1251' r='5'/%3E%3Ccircle cx='0' cy='1201' r='4'/%3E%3Ccircle cx='0' cy='1151' r='3'/%3E%3Ccircle cx='0' cy='1101' r='2'/%3E%3Ccircle cx='0' cy='1051' r='1'/%3E%3Crect x='-10' y='2212' width='70' height='1788'/%3E%3C/g%3E%3C/svg%3E");
  background-attachment: fixed;
  background-repeat: repeat-x;
}

.demo-slide-name {
  @apply absolute left-0 bottom-0 w-full p-4 pb-24 box-border text-white z-50 text-xl;
}

.demo-empty-slide {
  @apply bg-gray-400 flex items-center justify-center text-2xl leading-normal text-center font-bold text-gray-600;
  text-shadow: 0px 1px 0px #fff;
}

.demo-empty-slide::before {
  @apply hidden;
}

.flip-animate {
  animation: flip 1s forwards;
  animation-delay: 1s;
  opacity: 1;
}

@keyframes flip {
  from {
    transform: perspective(1000px) rotateY(90deg);
  }

  to {
    transform: perspective(1000px) rotateY(0deg);
  }
}

.swiper-tinder-container {
  @apply relative w-full h-full flex flex-col;
}

.swiper-wrapper,
.slide-inner {
  @apply flex-grow overflow-hidden;
}

swiper-container {
  @apply w-full h-full;
}

swiper-slide,
.card-container,
.card-face {
  @apply h-full;
}

.swiper-tinder-buttons {
  @apply flex justify-center gap-5 z-10;
}

.swiper-tinder-button {
  @apply flex items-center justify-center shadow-md cursor-pointer transition-transform duration-200;
}

.swiper-tinder-button:hover {
  @apply scale-110;
}

swiper-slide {
  perspective: 1000px;
}

.card-face.decision {
  background-color: #00bb77;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cpolygon fill='%23000' fill-opacity='.1' points='120 0 120 60 90 30 60 0 0 0 0 0 60 60 0 120 60 120 90 90 120 60 120 0'/%3E%3C/svg%3E");
}

.card-container {
  @apply w-full h-full relative;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  transform: rotateY(var(--is-flipped, 0deg));
}

.card-container.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  @apply absolute w-full h-full flex flex-col items-center justify-start text-2xl text-white p-5 box-border bg-cover bg-center;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-front {
  @apply z-10;
}

.card-back {
  @apply bg-gray-800 text-white;
  transform: rotateY(180deg);
}

.feedback-text {
  @apply bg-black bg-opacity-70 rounded-lg shadow-lg;
}

.card-container.is-flipped .card-front {
  z-index: 0;
}

.card-container.is-flipped .card-back {
  z-index: 1;

}

.card-content {
  @apply bg-black bg-opacity-70 p-3 rounded max-w-[80%] text-center;
}

.card-text {
  @apply m-0;
}

.reveal-icon {
  @apply flex justify-center items-center w-full h-full;
}

.swiper-tinder-label {
  @apply absolute top-20 font-bold transition-opacity pointer-events-none bg-black bg-opacity-70 p-2 z-10;
}

.swiper-tinder-label-no {
  @apply left-0 text-red-500 text-right;
}

.swiper-tinder-label-yes {
  @apply right-0 text-green-500 text-left;
}

.swiper-slide-active.swiper-slide-swiping .swiper-tinder-label {
  @apply opacity-100;
}
</style>