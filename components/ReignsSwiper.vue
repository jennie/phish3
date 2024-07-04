<template>
  <div class="swiper-tinder-container h-full bg-black flex flex-col">

    <div class="flex flex-row justify-between scores-container text-white p-4 bg-gray-800 rounded-xl">
      <div>Trust: {{ playerState.trust }}</div>
      <div>Security: {{ playerState.security }}</div>
      <div>Goose Infiltration: {{ playerState.gooseInfiltration }}</div>
    </div>
    <div class="container-start text-green-300 text-center mx-auto py-2"><svg xmlns="http://www.w3.org/2000/svg"
        width="32" height="32" viewBox="0 0 24 24">
        <g fill="currentColor">
          <path
            d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06z" />
          <path
            d="m12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086z" />
        </g>
      </svg></div>
    <div v-if="currentScenario && currentScenario.cards" class="swiper-wrapper flex-grow overflow-hidden relative">
      <swiper-container ref="swiperRef" :modules="modules" effect="tinder" :slides-per-view="1" :allow-touch-move="true"
        observer observer-parents init="false" class="h-full">
        <swiper-slide v-for="(card, index) in currentScenario.cards" :key="index">
          <div :ref="el => { if (el) cardRefs[index] = el }"
            :class="['card-container', { 'is-flipped': card.isFlipped }]">
            <template v-if="card.type === 'decision'">
              <div class="swiper-tinder-label swiper-tinder-label-yes">Trust</div>
              <div class="swiper-tinder-label swiper-tinder-label-no">Distrust</div>
            </template>
            <div :class="`card-face card-front ${card.type}`">
              <p v-if="card.type === 'reveal'"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                  viewBox="0 0 24 24">
                  <path fill="currentColor"
                    d="M14.6 8.075q0-1.075-.712-1.725T12 5.7q-.725 0-1.312.313t-1.013.912q-.4.575-1.088.663T7.4 7.225q-.35-.325-.387-.8t.237-.9q.8-1.2 2.038-1.862T12 3q2.425 0 3.938 1.375t1.512 3.6q0 1.125-.475 2.025t-1.75 2.125q-.925.875-1.25 1.363T13.55 14.6q-.1.6-.513 1t-.987.4t-.987-.387t-.413-.963q0-.975.425-1.787T12.5 11.15q1.275-1.125 1.688-1.737t.412-1.338M12 22q-.825 0-1.412-.587T10 20t.588-1.412T12 18t1.413.588T14 20t-.587 1.413T12 22" />
                </svg></p>
              <p v-else>{{ card.text }}</p>
            </div>
            <div class="card-face card-back" v-if="card.type === 'reveal'">
              <div class="slide-inner h-full flex flex-col">
                <img :src="card.image" :alt="'Reveal image'" class="rounded-lg bg-cover object-cover flex-grow w-full">
                <div class="demo-slide-name p-2 bg-gradient-to-b from-transparent to-black to-90%" v-html="card.text">
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
      <button class="swiper-tinder-button swiper-tinder-button-no">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
          <path fill="red"
            d="m239.82 157l-12-96A24 24 0 0 0 204 40H32a16 16 0 0 0-16 16v88a16 16 0 0 0 16 16h43.06l37.78 75.58A8 8 0 0 0 120 240a40 40 0 0 0 40-40v-16h56a24 24 0 0 0 23.82-27M72 144H32V56h40Z" />
        </svg>
      </button>
      <button class="swiper-tinder-button swiper-tinder-button-yes">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
          <path fill="green"
            d="M234 80.12A24 24 0 0 0 216 72h-56V56a40 40 0 0 0-40-40a8 8 0 0 0-7.16 4.42L75.06 96H32a16 16 0 0 0-16 16v88a16 16 0 0 0 16 16h172a24 24 0 0 0 23.82-21l12-96A24 24 0 0 0 234 80.12M32 112h40v88H32Z" />
        </svg>
      </button>
    </div>
    <div class="container-end text-blue-200 text-center py-2 flex flex-row justify-between"><svg
        xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16">
        <path fill="currentColor"
          d="M11.983 1.364a.75.75 0 0 0-1.281.78c.096.158.184.321.264.489a5.48 5.48 0 0 1-.713.386A2.993 2.993 0 0 0 8 2a2.99 2.99 0 0 0-2.253 1.02a5.485 5.485 0 0 1-.713-.387c.08-.168.168-.33.264-.489a.75.75 0 1 0-1.28-.78c-.245.401-.45.83-.61 1.278a.75.75 0 0 0 .239.84a7 7 0 0 0 1.422.876A3.01 3.01 0 0 0 5 5c0 .126.072.24.183.3c.386.205.797.37 1.227.487c-.126.165-.227.35-.297.549A10.418 10.418 0 0 1 3.51 5.5a10.686 10.686 0 0 1-.008-.733a.75.75 0 0 0-1.5-.033a12.222 12.222 0 0 0 .041 1.31a.75.75 0 0 0 .4.6A11.922 11.922 0 0 0 6.199 7.87c.04.084.088.166.14.243l-.214.031l-.027.005A11.913 11.913 0 0 0 2.444 9.36a.75.75 0 0 0-.4.6a12.148 12.148 0 0 0 .197 3.443a.75.75 0 0 0 1.47-.299a10.551 10.551 0 0 1-.2-2.6a10.35 10.35 0 0 1 1.085-.441c-.063.3-.096.614-.096.936c0 2.21 1.567 4 3.5 4s3.5-1.79 3.5-4c0-.322-.034-.636-.097-.937c.372.128.734.275 1.085.442a10.703 10.703 0 0 1-.199 2.6a.75.75 0 1 0 1.47.3a12.049 12.049 0 0 0 .197-3.443a.75.75 0 0 0-.4-.6a11.921 11.921 0 0 0-3.671-1.215l-.011-.002a11.95 11.95 0 0 0-.213-.03c.052-.078.1-.16.14-.244c1.336-.202 2.6-.623 3.755-1.227a.75.75 0 0 0 .4-.6a12.178 12.178 0 0 0 .041-1.31a.75.75 0 0 0-1.5.033a11.061 11.061 0 0 1-.008.733a10.43 10.43 0 0 1-2.602.836c-.07-.2-.17-.384-.297-.55a5.9 5.9 0 0 0 1.228-.488A.34.34 0 0 0 11 5c0-.22-.024-.435-.069-.642a7 7 0 0 0 1.422-.876a.75.75 0 0 0 .24-.84a6.97 6.97 0 0 0-.61-1.278" />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16">
        <path fill="currentColor" fill-rule="evenodd"
          d="M7.47 12.78a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 0 0-1.06-1.06L8 11.19L5.28 8.47a.75.75 0 0 0-1.06 1.06zM4.22 4.53l3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 0 0-1.06-1.06L8 6.19L5.28 3.47a.75.75 0 0 0-1.06 1.06"
          clip-rule="evenodd" />
      </svg>

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

const flipRevealCard = (index) => {
  if (currentScenario.value.cards[index] && currentScenario.value.cards[index].type === 'reveal') {
    console.log('Flipping reveal card at index:', index);
    setTimeout(() => {
      currentScenario.value.cards[index].isFlipped = true;
      console.log('Reveal card flipped');
    }, 1000);  // 1 second delay
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

      swiper.value.on('tinderSwipe', (direction) => {
        const currentIndex = swiper.value.activeIndex;
        console.log('Slide changed to index:', currentIndex);
        flipRevealCard(currentIndex);

        // If it's not a reveal card, prepare for the next swipe
        if (currentScenario.value.cards[currentIndex].type !== 'reveal') {
          swiper.value.allowSlideNext = true;
          swiper.value.allowSlidePrev = true;
        } else {
          // For reveal cards, disable swiping
          swiper.value.allowSlideNext = false;
          swiper.value.allowSlidePrev = false;

          // Automatically move to the next card after a delay
          setTimeout(() => {
            swiper.value.slideNext();
          }, 3000);  // 3 seconds delay, adjust as needed
        }
      });

      swiper.value.on('tinderSwipe', (direction) => {
        const currentIndex = swiper.value.activeIndex;
        const currentCard = currentScenario.value.cards[currentIndex];
        console.log('Tinder swipe:', direction, 'on card type:', currentCard.type);

        if (currentCard.type === 'decision') {
          makeChoice(direction === 'right');
        }
      });
    }
  }
});

// Add this watch to log playerState changes
watch(playerState, (newState) => {
  console.log('Player state updated:', newState);
}, { deep: true });

// Debug: Log card refs when they change
watch(() => cardRefs.value, (newRefs) => {
  console.log('Card refs updated:', newRefs.length);
}, { deep: true });
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
  @apply w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-md cursor-pointer transition-transform duration-200;
}

.swiper-tinder-button:hover {
  @apply scale-110;
}

.swiper-tinder-label {
  @apply absolute text-white text-2xl font-bold;
}

.swiper-tinder-label-yes {
  @apply top-4 right-4 text-green-500;
}

.swiper-tinder-label-no {
  @apply top-4 left-4 text-red-500;
}

/* Assuming .cards-wrapper is the parent of .card-container */
swiper-slide {
  perspective: 1000px;
  /* Adjust as needed for more/less depth */
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
  justify-content: center;
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
  background-color: #FF9800;
  transform: rotateY(180deg);
}

.swiper-tinder-label {
  position: absolute;
  top: 20px;
  font-size: 24px;
  font-weight: bold;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10;
}

.swiper-tinder-label.visible {
  opacity: 1;
}

.swiper-tinder-label-yes {
  right: 20px;
  color: green;
}

.swiper-tinder-label-no {
  left: 20px;
  color: red;
}

.swiper-tinder-label {
  position: absolute;
  font-weight: bold;
  padding: 4px 12px;
  text-transform: uppercase;
  border-radius: 4px;
  opacity: 0;
}

.swiper-tinder-label-yes {
  @apply bg-green-500;
  left: 3%;
  top: 5%;
  transform: rotate(-20deg);
  transform-origin: right top;
}

.swiper-tinder-label-no {
  @apply bg-red-500;
  right: 3%;
  top: 5%;
  transform: rotate(20deg);
  transform-origin: left top;
}

.swiper-tinder-label {
  position: absolute;
  font-weight: bold;
  padding: 4px 12px;
  text-transform: uppercase;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10;
}

.swiper-tinder-label-yes {
  background-color: green;
  right: 10px;
  top: 10px;
}

.swiper-tinder-label-no {
  background-color: red;
  left: 10px;
  top: 10px;
}

.swiper-tinder-button {
  // Add your button styles here
}

.swiper-tinder-button-active {
  // Add styles for active state
}

.swiper-tinder-button-hidden {
  display: none;
}

.swiper-tinder-label {
  position: absolute;
  top: 20px;
  font-size: var(--swiper-tinder-label-font-size, 32px);
  font-weight: bold;
  color: var(--swiper-tinder-label-text-color, #fff);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 1;
}

.swiper-tinder-label-yes {
  right: 20px;
  color: var(--swiper-tinder-yes-color, #4fca74);
}

.swiper-tinder-label-no {
  left: 20px;
  color: var(--swiper-tinder-no-color, #ff689f);
}

.swiper-tinder-label {
  position: absolute;
  top: 20px;
  font-size: var(--swiper-tinder-label-font-size, 32px);
  font-weight: bold;
  color: var(--swiper-tinder-label-text-color, #fff);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 10;
  /* Increased z-index */
  pointer-events: none;
  /* Ensure labels don't interfere with touch events */
}

.swiper-tinder-label-yes {
  right: 20px;
  color: var(--swiper-tinder-yes-color, #4fca74);
}

.swiper-tinder-label-no {
  left: 20px;
  color: var(--swiper-tinder-no-color, #ff689f);
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
  justify-content: center;
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
  background-color: #FF9800;
  transform: rotateY(180deg);
}
</style>
