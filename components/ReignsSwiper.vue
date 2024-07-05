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
        observer observer-parents init="false" class="h-full">
        <swiper-slide v-for="(card, index) in currentScenario.cards" :key="index">
          <div :ref="el => { if (el) cardRefs[index] = el }"
            :class="['card-container', { 'is-flipped': card.isFlipped }]">
            <div class="swiper-tinder-label swiper-tinder-label-yes">{{ card.trustLabel }}</div>
            <div class="swiper-tinder-label swiper-tinder-label-no">{{ card.distrustLabel }}</div>

            <div :class="`swiper-slide card-face card-front ${card.type}`"
              :style="{ backgroundImage: `url(${card.image})` }">

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
              <div class="slide-inner h-full flex flex-col">
                <div class="demo-slide-name p-2 bg-gradient-to-b from-transparent to-black to-90%" v-html="card.text">
                </div>
                <div class="feedback-text p-2" v-if="decisionFeedback">
                  {{ decisionFeedback }}
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

import 'swiper/scss';
import '~/assets/css/effect-tinder.scss';
import '~/assets/css/demo-tinder.scss';

const modules = [EffectTinder];
const swiperRef = ref(null);
const swiper = ref(null);
const cardRefs = ref([]);

const { currentScenario, currentCard, makeChoice, nextCard, previousCard, gameOver, playerState, scenarios } = useGameState();

// New ref to store the feedback
const decisionFeedback = ref('');

const flipRevealCard = (index) => {
  if (currentScenario.value.cards[index] && currentScenario.value.cards[index].type === 'reveal') {
    console.log('Flipping reveal card at index:', index);
    setTimeout(() => {
      currentScenario.value.cards[index].isFlipped = true;
      console.log('Reveal card flipped');
    }, 1000);  // 1 second delay
  }
};

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

onMounted(async () => {
  console.log("Component mounted. Current scenario:", currentScenario.value);
  await nextTick();
  const swiperContainer = swiperRef.value;
  if (swiperContainer) {
    console.log('Swiper container found');
    const swiperParams = {
      modules: [EffectTinder],
      effect: 'tinder',
      slidesPerView: 1,
      allowTouchMove: true,
    };
    Object.assign(swiperContainer, swiperParams);
    swiperContainer.initialize();
    swiper.value = swiperContainer.swiper;

    if (swiper.value) {
      console.log('Swiper initialized');
      swiper.value.on('sliderFirstMove', () => {
        const activeSlide = swiper.value.slides[swiper.value.activeIndex];
        activeSlide.classList.add('swiper-slide-swiping');
      });

      swiper.value.on('touchEnd', () => {
        swiper.value.slides.forEach(slide => {
          slide.classList.remove('swiper-slide-swiping');
        });
      });
      swiper.value.on('tinderSwipe', (s, direction) => {
        const currentIndex = swiper.value.activeIndex;
        const currentCard = currentScenario.value.cards[currentIndex];
        console.log('Tinder swipe:', direction, 'on card type:', currentCard.type);

        if (currentCard.type === 'decision') {
          const isTrust = direction === 'right';
          makeChoice(isTrust, currentCard);
          // Immediately store the feedback after making a choice
          decisionFeedback.value = isTrust ? currentCard.trustChoice.feedback : currentCard.distrustChoice.feedback;
        } else if (currentCard.type === 'reveal') {
          flipRevealCard(currentIndex);
          // Code for automatically moving to the next card after a delay can be placed here
        }
        setFeedbackAfterSwipe(direction);

        // Prepare for the next swipe
        nextTick(() => {
          swiper.value.allowSlideNext = true;
          swiper.value.allowSlidePrev = true;
        });
      });

      swiper.value.on('slideChangeTransitionStart', () => {
        const currentIndex = swiper.value.activeIndex;
        const currentCard = currentScenario.value.cards[currentIndex];

        // Show labels
        showTrustLabel.value = true;
        showDistrustLabel.value = true;
      });

      swiper.value.on('slideChangeTransitionEnd', () => {
        const currentIndex = swiper.value.activeIndex;
        const currentCard = currentScenario.value.cards[currentIndex];

        if (currentCard.type === 'reveal') {
          flipRevealCard(currentIndex);
        }
      });
    }
  };
});
function setFeedbackAfterSwipe(direction) {
  const currentIndex = swiper.value.activeIndex;
  const currentCard = currentScenario.value.cards[currentIndex];
  if (currentCard.type === 'decision') {
    const isTrust = direction === 'right';
    decisionFeedback.value = isTrust ? currentCard.trustChoice.feedback : currentCard.distrustChoice.feedback;
    console.log('Feedback set to:', decisionFeedback.value); // For debugging
  }
}
// Add this watch to log playerState changes
watch(playerState, (newState) => {
  console.log('Player state updated:', newState);
}, { deep: true });

// Debug: Log card refs when they change
watch(() => cardRefs.value, (newRefs) => {
  console.log('Card refs updated:', newRefs.length);
}, { deep: true });
watch(decisionFeedback, (newFeedback, oldFeedback) => {
  console.log('Feedback changed from:', oldFeedback, 'to:', newFeedback);
  // You can add any additional logic here to handle the feedback change
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

.swiper-tinder-container {
  @apply relative w-full;
}

.swiper-wrapper {
  @apply relative;
}

swiper-container {
  @apply w-full;
}

.slide-inner {
  @apply w-full relative;
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




/* Assuming .cards-wrapper is the parent of .card-container */
swiper-slide {
  perspective: 1000px;
  /* Adjust as needed for more/less depth */
}

.swiper-tinder {
  box-sizing: border-box;
}

.swiper-tinder .swiper-slide {
  overflow: hidden;
}

.swiper-tinder .swiper-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-face.decision {
  @apply bg-green-300
}

.card-container {
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  position: relative;
  perspective: 1000px;
}

.card-container.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex;
  align-items: center;
  font-size: 24px;
  color: white;
  padding: 20px;
  box-sizing: border-box;
}

.card-front {
  background-color: #2196F3;
  z-index: 2;
}

.card-back {
  background-color: #000;
  transform: rotateY(180deg);
}



.swiper-tinder-label.visible {
  opacity: 1;
}




.swiper-tinder-button-hidden {
  display: none;
}


.card-container {
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  position: relative;
  perspective: 1000px;
}

.card-container.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  /* Ensure children are stacked vertically */
  justify-content: flex-start;
  /* Align content to the top */
  font-size: 24px;
  color: white;
  padding: 20px;
  box-sizing: border-box;
}

.card-front {
  background-color: #2196F3;
  z-index: 2;
}




// Add this new rule
.swiper-slide-active.swiper-slide-swiping .swiper-tinder-label {
  opacity: 1;
}

.card-container {
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  position: relative;
  perspective: 1000px;
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  font-size: 24px;
  color: white;
  padding: 20px;
  box-sizing: border-box;
  background-size: cover;
  background-position: center;
}

.card-content {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 5px;
  max-width: 80%;
  text-align: center;
}

.card-text {
  margin: 0;
}

.reveal-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.swiper-tinder-label {
  @apply absolute top-20 font-bold transition-opacity pointer-events-none bg-black bg-opacity-70 p-2 z-10;
}

.swiper-tinder-label-no {
  @apply left-0 text-red-500 text-right;
  color: red !important;
}

.swiper-tinder-label-yes {
  @apply right-0 text-green-500 text-left;
  color: green !important;
}

.swiper-slide-active.swiper-slide-swiping .swiper-tinder-label {
  opacity: 1;
}

:root {
  --swiper-tinder-no-color: red;
  --swiper-tinder-yes-color: green;
  --swiper-tinder-label-text-color: #fff;
  --swiper-tinder-label-font-size: 32px;
  --swiper-tinder-button-size: 56px;
  --swiper-tinder-button-icon-size: 32px;
}

.swiper-tinder-container {
  @apply relative w-full;
}

.swiper-wrapper {
  @apply relative;
}

swiper-container {
  @apply w-full;
}

.slide-inner {
  @apply w-full relative;
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

.swiper-tinder-label {
  position: absolute;
  top: 20px;
  font-weight: bold;
  transition: opacity 0.3s;
  z-index: 10;
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
}

.swiper-tinder-label-yes {
  right: 20px;
  /* Adjust position as needed */
  background-color: green;
}


.swiper-tinder {
  box-sizing: border-box;
}

.swiper-tinder .swiper-slide {
  overflow: hidden;
}

.swiper-tinder .swiper-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-face.decision {
  @apply bg-green-300
}

.card-container {
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  position: relative;
  perspective: 1000px;
}

.card-container.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex;
  align-items: center;
  font-size: 24px;
  color: white;
  padding: 20px;
  box-sizing: border-box;
}

.card-front {
  background-color: #2196F3;
  z-index: 2;
}

.card-back {
  background-color: #000;
  transform: rotateY(180deg);
}

.swiper-tinder-label.visible {
  opacity: 1;
}

.swiper-slide-active.swiper-slide-swiping .swiper-tinder-label {
  opacity: 1;
}

.card-content {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 5px;
  max-width: 80%;
  text-align: center;
}

.card-text {
  margin: 0;
}

.reveal-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>