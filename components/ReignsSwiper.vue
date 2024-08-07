<template>
  <StartGameScreen v-if="!gameStarted" />
  <EndingScenarioSwiper v-else-if="isPlayingEndingScenario" />
  <RecapSwiper v-else-if="isRecapMode" />
  <GameOverScreen v-else-if="gameOver" :finalScore="playerState.score" @restart-game="resetGame" />


  <div v-else class="bg-black flex flex-col h-dvh justify-between">
    <!-- Floating Text Container -->
    <div class="flex-none h-1/6 flex items-center justify-center pointer-events-none px-6">
      <Transition name="fade" mode="out-in">
        <div v-if="currentCard && currentCard.type !== 'reveal'" :key="currentCardIndex"
          class="card-text text-sm text-white leading-snug text-center" v-html="parseCardText(currentCard.text)">
        </div>
        <div v-else-if="lastDecisionText" :key="'last-decision'"
          class="card-text text-sm text-white leading-snug text-center" v-html="parseCardText(lastDecisionText)">
        </div>
      </Transition>
    </div>

    <!-- Slides/Cards Container -->
    <div class="flex-grow absolute h-full w-full flex items-center justify-center overflow-hidden">
      <swiper-container v-if="isDataReady" ref="swiperRef" :modules="modules" effect="tinder" :slides-per-view="1"
        :allow-touch-move="true" observer observer-parents :init="false" class="w-full h-full">
        <swiper-slide v-for="(card, index) in currentScenario.cards" :key="index"
          class="flex items-center justify-center">
          <div :ref="el => { if (el) cardRefs[index] = el }" class="card-container relative">
            <div
              :class="['card-face absolute inset-0 rounded-xl overflow-hidden transition-transform duration-600', { 'rotate-y-180': cardFlipStates[card.id] }]">
              <div class="absolute inset-0 bg-cover bg-center rounded-xl border-8 border-white aspect-[11/19] "
                :style="{ backgroundImage: `url(${card.image})` }">
                <Transition name="pop-fade">
                  <div v-if="card.type === 'decision' && showDecisionIcon && !isCardSwiping"
                    class="absolute top-4 right-4 bg-yellow-200 leading-none rounded-full p-2 shadow-lg icon-pop z-30">
                    <button @click.stop="toggleOverlay(card)" class="focus:outline-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
                        <path fill="currentColor"
                          d="M196 96c0 29.47-24.21 54.05-56 59.06v.94a12 12 0 0 1-24 0v-12a12 12 0 0 1 12-12c24.26 0 44-16.15 44-36s-19.74-36-44-36s-44 16.15-44 36a12 12 0 0 1-24 0c0-33.08 30.5-60 68-60s68 26.92 68 60m-68 92a20 20 0 1 0 20 20a20 20 0 0 0-20-20" />
                      </svg>
                    </button>
                  </div>
                </Transition>
                <!-- Overlay -->
                <Transition :name="overlayTransitionName">
                  <div v-if="card.showOverlay"
                    class="absolute inset-0 bg-gray-800 bg-opacity-90 flex flex-col text-gray-200 p-4 z-50">
                    <div class="flex justify-between items-center mb-4">

                      <div
                        class="absolute top-4 right-4 bg-yellow-200 text-black leading-none rounded-full p-2 shadow-lg icon-pop z-30">
                        <button @click.stop="toggleOverlay(card)" class="focus:outline-none">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div class="flex-grow overflow-y-auto">
                      <div v-if="card.loadedOverlayContent" v-html="card.loadedOverlayContent" class="overlay-content">
                      </div>
                      <p v-else>Loading content...</p>
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
                  data-swiper-parallax="-300" data-swiper-parallax-duration="600" v-html="card.trustLabel || 'Trust'" />
              </div>
            </div>
          </div>
          <div v-if="card.type === 'reveal'"
            :class="['card-back absolute inset-0 rounded-xl overflow-hidden bg-gray-800 flex items-center justify-center transition-transform duration-600 backface-hidden reveal border-8 border-white', { 'rotate-y-180': !cardFlipStates[card.id] }]">
            <div v-if="decisionFeedback" class="p-4 text-white">
              <p class="text-xl px-8" v-html="parseCardText(decisionFeedback)" />
            </div>
          </div>

        </swiper-slide>
      </swiper-container>
      <div v-else class="h-full flex items-center justify-center text-white">
        Loading scenarios...
      </div>
    </div>

    <!-- Controls Container -->
    <div class="flex-none h-1/6 flex flex-col align-middle items-center justify-end w-full">
      <div class="flex space-x-12 justify-between z-10">
        <a href="/" @click.prevent="returnToStartScreen" class="p-2 self self-center">
          <HomeButton />
        </a>
        <div class="flex justify-center gap-5 z-10 py-2 mb-4">
          <button @click="isDecisionCard ? handleDistrustClick() : handlePreviousClick()"
            :disabled="(!canNavigateBack && !isDecisionCard) || isFlipping" :class="['flex items-center justify-center shadow-md cursor-pointer transition-transform duration-200 hover:scale-110',
              { 'opacity-50 cursor-not-allowed': (!canNavigateBack && !isDecisionCard) || isFlipping }]"
            style="width: var(--swiper-tinder-button-size); height: var(--swiper-tinder-button-size);">
            <BackButton v-if="!isDecisionCard" />
            <ThumbsDown v-else />
          </button>
          <button @click="isDecisionCard ? handleTrustClick() : handleNextClick()"
            :disabled="!canNavigateForward || isFlipping" :class="['flex items-center justify-center shadow-md cursor-pointer transition-transform duration-200 hover:scale-110',
              { 'opacity-50 cursor-not-allowed': !canNavigateForward || isFlipping }]"
            style="width: var(--swiper-tinder-button-size); height: var(--swiper-tinder-button-size);">
            <NextButton v-if="!isDecisionCard" />
            <ThumbsUp v-else />
          </button>
        </div>
        <button @click="retryScenario" :disabled="isRetryDisabled" class="p-2 bg-transparent border-none"
          :class="{ 'opacity-50': isRetryDisabled }" :style="{ cursor: isRetryDisabled ? 'not-allowed' : 'pointer' }">
          <RetryButton />
        </button>
      </div>
    </div>

    <!-- Debug Panel and Button -->
    <div class="fixed top-4 right-4 flex flex-col items-end z-50">
      <button @click="showDebugPanel = !showDebugPanel"
        class="bg-red-500 text-white px-4 py-2 rounded-full uppercase text-xs hover:bg-red-600 transition-colors mb-2">
        {{ showDebugPanel ? 'Hide' : 'Show' }} Debug
      </button>

      <div v-if="showDebugPanel" class="bg-red-500 bg-opacity-80 text-white p-3 rounded text-xs max-w-xs w-full mt-2">
        <p class="mb-1">Current card: {{ currentCardIndex + 1 }}</p>
        <p class="mb-1">Card type: {{ currentCard?.type || 'N/A' }}</p>
        <p class="mb-1">Scenario ID: {{ currentScenario?.id || 'N/A' }}</p>
        <p class="mb-1">Score: {{ currentScore }}</p>
        <p class="mb-1">Scenario type: {{ currentScenario?.scenarioType || "N/A" }}</p>
        <p class="mb-1">Regular Scenarios: {{ regularScenarios.length }}</p>


        <!-- Dynamic Debug Buttons -->


        <p class="mb-1">Scenarios in current order:</p>
        <div class="flex flex-wrap gap-1">
          <a v-for="scenario in regularScenarios" :key="scenario.id" @click.prevent="jumpToScenario(scenario.id)"
            href="#" class="text-white text-2xl px-2 hover:text-yellow-200 underline">
            {{ scenario.id }}
          </a>
        </div>
        <div class="mt-4">
          <button v-if="isInMainScenarios" @click="skipToEndingScenario"
            class="bg-black px-4 py-2 rounded-full mb-2 w-full">
            Skip to Ending Scenario
          </button>
          <button v-if="isInEndingScenario" @click="skipToRecap" class="bg-black px-4 py-2 rounded-full mb-2 w-full">
            Skip to Recap
          </button>
          <button v-if="isInRecap" @click="skipToGameOver" class="bg-black px-4 py-2 rounded-full mb-2 w-full">
            Skip to Game Over
          </button>
        </div>
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
import { useMarkdownContent } from '~/composables/useMarkdownContent';

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
const currentScore = computed(() => playerState.value.score);

const parseCardText = (text) => {
  return text.replace(/\\n/g, '<br>');
};
const isFlipping = ref(false);

const selectedScenarioId = ref(null);

const {
  gameStarted,
  makeChoice,
  nextCard,
  nextScenario,
  previousCard,
  gameOver,
  playerState,
  scenarios,
  resetGame,
  jumpToScenarioById,
  currentScenarioIndex,
  currentCardIndex,
  isRecapMode,
  startRecap,
  isEndingScenario,
  userChoices,
} = useGameState();



// Separate regular scenarios from ending scenarios
const regularScenarios = computed(() =>
  scenarios.value.filter(s => s.scenarioType !== 'ending' && s.id !== null)
);
const endingScenarios = computed(() => scenarios.value.filter(s => s.scenarioType === 'ending'));

const currentScenario = computed(() => {
  if (isEndingScenario.value) {
    return endingScenarios.value[0]; // Assume we're showing the first (and only) ending scenario
  }
  return regularScenarios.value[currentScenarioIndex.value] || null;
});


const unplayedRegularScenarios = computed(() => {
  return regularScenarios.value.filter(scenario => !userChoices.value[scenario.id]);
});


const simulateRandomChoices = () => {
  let totalScoreChange = 0;
  unplayedRegularScenarios.value.forEach((scenario) => {
    const decisionCard = scenario.cards.find(card => card.type === 'decision');
    if (decisionCard) {
      const isTrust = Math.random() < 0.5; // This ensures a roughly 50/50 split between trust and distrust
      const choice = isTrust ? decisionCard.trustChoice : decisionCard.distrustChoice;

      let consequences = { trust: 0 };
      if (choice && choice.consequences) {
        try {
          consequences = JSON.parse(choice.consequences);
        } catch (error) {
          console.error(`Error parsing consequences for scenario ${scenario.id}:`, error);
        }
      }

      totalScoreChange += consequences.trust || 0;
      makeChoice(isTrust, scenario.id);
    }
  });
  return totalScoreChange;
};


const skipToEndingScenario = () => {
  try {
    const scoreChange = simulateRandomChoices();

    playerState.value.score += scoreChange;

    const score = playerState.value.score;
    console.log('Updated score after simulation:', score);

    const matchingEndingScenario = endingScenarios.value.find(scenario =>
      score >= scenario.cards[0].minScore && score <= scenario.cards[0].maxScore
    );

    if (matchingEndingScenario) {
      isEndingScenario.value = true;
      currentScenarioIndex.value = regularScenarios.value.length; // Set to the index after regular scenarios
      currentCardIndex.value = 0;
    } else {
      console.error('No matching ending scenario found for score:', score);
      // Fallback to the first ending scenario if no match is found
      isEndingScenario.value = true;
      currentScenarioIndex.value = regularScenarios.value.length;
      currentCardIndex.value = 0;
    }

    // Force a re-render of the current scenario and update the debug panel
    nextTick(() => {
      if (swiper.value) {
        swiper.value.update();
      }
    });
  } catch (error) {
    console.error('Error in skipToEndingScenario:', error);
  }
};

// Update transitionToNextScenario
const transitionToNextScenario = async () => {
  // console.log('Transitioning to next scenario');
  isTransitioning.value = true;

  if (currentScenarioIndex.value < regularScenarios.value.length - 1) {
    // Move to the next regular scenario
    currentScenarioIndex.value++;
  } else if (!isEndingScenario.value) {
    // We've reached the end of regular scenarios, transition to ending scenario
    isEndingScenario.value = true;
    currentScenarioIndex.value = 0;
  } else {
    // We're at the end of the ending scenario, start recap
    startRecap();
    isTransitioning.value = false;
    return;
  }

  currentCardIndex.value = 0;
  isRevealCardFlipped.value = false;
  decisionFeedback.value = '';
  cardFlipStates.value = {};
  lastDecisionText.value = '';

  if (currentScenario.value.cards) {
    currentScenario.value.cards.forEach(card => {
      if (!card.id) {
        card.id = `card-${Date.now()}-${Math.random()}`;
      }
      cardFlipStates.value[card.id] = false;
      card.showOverlay = false;
      card.overlayContent = null;
    });
  }

  await nextTick();
  if (swiper.value) {
    swiper.value.slideTo(0, 0);
    await swiper.value.update();
  }

  isTransitioning.value = false;
};


const decisionFeedback = ref('');
const isRevealCardFlipped = ref(false);
let swipingTimeout = null;


const allScenariosComplete = computed(() => {
  return currentScenarioIndex.value >= scenarios.value.length - 1 &&
    Object.keys(userChoices.value).length === scenarios.value.length;
});

const setScore = (score) => {
  playerState.value.score = score;
  // Optionally, adjust other playerState properties here
};

const completeAllScenarios = () => {
  if (scenarios.value.length > 0) {
    currentScenarioIndex.value = scenarios.value.length - 1;
    if (scenarios.value[currentScenarioIndex.value].cards.length > 0) {
      currentCardIndex.value = scenarios.value[currentScenarioIndex.value].cards.length - 1;
    } else {
      console.error('No cards found in the final scenario');
    }
  } else {
    console.error('No scenarios available');
  }
};

const isInMainScenarios = computed(() => !isEndingScenario.value && !isRecapMode.value && currentScenarioIndex.value < scenarios.value.length - 1);
const isInEndingScenario = computed(() => isEndingScenario.value);
const isInRecap = computed(() => isRecapMode.value);




const simulateAllChoices = () => {
  // console.log("Starting simulation of all choices");
  // console.log(`Total regular scenarios: ${regularScenarios.value.length}`);

  regularScenarios.value.forEach((scenario, index) => {
    if (!scenario || scenario.id === null) {
      console.warn(`Invalid scenario found at index ${index}. Skipping.`);
      return;
    }

    // console.log(`Processing scenario ${scenario.id}`);
    const decisionCard = scenario.cards.find(card => card.type === 'decision');
    if (decisionCard) {
      const isTrust = Math.random() < 0.5;
      // console.log(`Scenario ${scenario.id}: Making ${isTrust ? 'trust' : 'distrust'} choice`);
      makeChoice(isTrust, scenario.id);
    } else {
      console.warn(`No decision card found for scenario ${scenario.id}. This shouldn't happen based on current data.`);
    }
  });

  // console.log("Finished simulating all choices");
  // console.log(`Final score: ${playerState.value.score}`);
};

const skipToRecap = () => {
  // console.log("Skipping to recap");
  simulateAllChoices();
  currentScenarioIndex.value = regularScenarios.value.length;
  startRecap();
};





const skipToGameOver = () => {
  setGameOver(true);
};



const jumpToScenario = async (scenarioId) => {
  const scenarioIndex = regularScenarios.value.findIndex(s => s.id === scenarioId);
  if (scenarioIndex !== -1) {
    currentScenarioIndex.value = scenarioIndex;
    currentCardIndex.value = 0; // Reset to the first card of the scenario
    isEndingScenario.value = false; // Ensure we're not in ending scenario mode

    // Reset any necessary state for the new scenario
    isRevealCardFlipped.value = false;
    decisionFeedback.value = '';
    lastDecisionText.value = '';
    cardFlipStates.value = {};

    await nextTick();
    if (swiper.value) {
      swiper.value.slideTo(0, 0);
      await swiper.value.update();
    }

    // console.log(`Jumped to scenario ${scenarioId} at index ${scenarioIndex}`);
  } else {
    console.error(`Scenario with id ${scenarioId} not found`);
  }
};

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

const canNavigateForward = computed(() => {
  if (isDecisionCard.value) return true;
  if (!currentCard.value) return false;
  if (currentCard.value.type === 'reveal' && !isRevealCardFlipped.value) return false;
  return true;
});

const canNavigateBack = computed(() => {
  if (isDecisionCard.value) return false;
  if (!currentCard.value) return false;
  if (currentCardIndex.value === 0) return false;
  if (currentCard.value.type === 'reveal' && isRevealCardFlipped.value) return false;
  return true;
});

const currentCard = computed(() => {
  if (currentScenario.value && currentScenario.value.cards) {
    // console.log('currentScenarioIndex:', currentScenarioIndex.value);
    // console.log('currentCardIndex:', currentCardIndex.value);
    // console.log('scenarios:', scenarios.value);

    const card = currentScenario.value.cards[currentCardIndex.value];
    // console.log('Current card:', card);
    // console.log('Current card overlayContent:', card.overlayContent);
    return card;
  }
  return null;
});

const handleTinderSwipe = async (s, direction) => {
  if (!isDataReady.value || !currentCard.value) return;

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
            }, 300);
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

watch(currentScenario, async (newScenario, oldScenario) => {
  if (newScenario && newScenario !== oldScenario) {
    // console.log('Current scenario changed to:', newScenario.id);
    // console.log('New scenario data:', JSON.stringify(newScenario, null, 2));
    cardFlipStates.value = {};
    newScenario.cards.forEach((card, index) => {
      // console.log(`Card ${index} initial overlayContent:`, card.overlayContent);
      if (!card.id) {
        card.id = `card-${index}`;
      }
      cardFlipStates.value[card.id] = false;
      card.showOverlay = false;
      // Remove this line: card.overlayContent = null;
      // console.log(`Card ${index} final overlayContent:`, card.overlayContent);
    });

    // ... rest of the function
  }
}, { immediate: true });


const isPlayingMainScenarios = computed(() =>
  gameStarted && currentScenarioIndex < scenarios.length - 1
);

const isPlayingEndingScenario = computed(() =>
  gameStarted && currentScenarioIndex === scenarios.length - 1 && !isRecapMode
);

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

    currentCardIndex.value = 0;

    cardFlipStates.value = {};
    currentScenario.value.cards.forEach((card, index) => {
      if (!card.id) {
        card.id = `card-${index}`;
      }
      cardFlipStates.value[card.id] = false;
      card.showOverlay = false;
      card.overlayContent = null;
    });

    isRevealCardFlipped.value = false;
    decisionFeedback.value = '';
    lastDecisionText.value = '';

    await nextTick();
    if (swiper.value) {
      swiper.value.slideTo(0, 0);
      await swiper.value.update();
    }

    isTransitioning.value = false;
  }
};

const { content: markdownContent, processInlineMarkdown, loadMarkdownFile } = useMarkdownContent();
const overlayTransitionName = ref('');


const toggleOverlay = async (card) => {
  console.log('Toggle overlay called for card:', card.id);

  card.showOverlay = !card.showOverlay;

  if (card.showOverlay && card.overlayContent && !card.loadedOverlayContent) {
    try {
      card.loadedOverlayContent = await loadMarkdownFile(card.overlayContent);
    } catch (error) {
      console.error('Error loading markdown:', error);
      card.loadedOverlayContent = "Failed to load content. Please try again.";
    }
  }
};

watch(currentCardIndex, () => {
  overlayTransitionName.value = '';

  // reset the overlay after switching scenarios
  // it is now replaying the same scenario instead of switching to the next one in the sequence
  if (currentCard.value?.showOverlay) {
    currentCard.value.showOverlay = false;
  }

});

watch(() => playerState.value, (newState, oldState) => {
  // console.log('PlayerState updated:', newState);
  // console.log('Score changed from', oldState.score, 'to', newState.score);
}, { deep: true });


const renderMarkdown = async (text, isFile = false) => {
  if (!text) return '';
  try {
    if (isFile) {
      return await loadMarkdownFile(text);
    } else {
      return processInlineMarkdown(text);
    }
  } catch (error) {
    console.error('Error rendering markdown:', error);
    return text; // Fallback to plain text if markdown rendering fails
  }
};
const renderedCardText = ref('');
const renderedLastDecisionText = ref('');

watch(() => currentCard.value?.text, async (newText) => {
  if (newText) {
    renderedCardText.value = await renderMarkdown(newText);
  }
});

watch(() => lastDecisionText.value, async (newText) => {
  if (newText) {
    renderedLastDecisionText.value = await renderMarkdown(newText);
  }
});


const handleChoice = async (isTrust) => {
  if (currentCard.value?.type === 'decision' && !isFlipping.value) {
    isFlipping.value = true;
    makeChoice(isTrust);
    const feedback = isTrust
      ? currentCard.value.trustChoice?.feedback
      : currentCard.value.distrustChoice?.feedback;
    decisionFeedback.value = await renderMarkdown(feedback);
    lastDecisionText.value = currentCard.value.text;
    await nextCard();
    if (swiper.value) {
      swiper.value.slideNext(300, true);
    }
    isFlipping.value = false;
  }
};


const handleTrustClick = () => handleChoice(true);
const handleDistrustClick = () => handleChoice(false);

const handleNextClick = async () => {
  if (!isFlipping.value) {
    if (currentCard.value?.type === 'reveal' && isRevealCardFlipped.value) {
      await transitionToNextScenario();
    } else if (swiper.value && canNavigateForward.value) {
      swiper.value.slideNext(300, true);
    }
  }
};

const handlePreviousClick = async () => {
  if (!isFlipping.value && canNavigateBack.value) {
    await previousCard();
    if (swiper.value) {
      swiper.value.slidePrev(300, true);
    }
  }
};


</script>


<style>
/* Root variables */
:root {
  --swiper-tinder-no-color: red;
  --swiper-tinder-yes-color: green;
  --swiper-tinder-label-text-color: #fff;
  --swiper-tinder-label-font-size: 32px;
  --swiper-tinder-button-size: 56px;
  --swiper-tinder-button-icon-size: 32px;
  --card-aspect-ratio: 1.2;
  /* Adjust this value to change the card's aspect ratio */
  --card-height: 90%;
  --card-aspect-ratio: 1.2;
  --card-max-height: 70vh;
  --card-horizontal-margin: 5vw;
}

.card-container {
  @apply aspect-[11/19] h-4/6 relative;
  perspective: 2000px;
}

@media (orientation: landscape) {
  .card-container {
    width: calc((100vh - 200px) / var(--card-aspect-ratio));
    height: calc(100vh - 200px);
    max-width: 90vw;
  }
}

.card-face,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transition: transform 0.6s;
  transform-style: preserve-3d;
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
  @apply aspect-[11/19];
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

.card-text {
  p {
    @apply mb-0
  }

}



.card-face,
.card-back {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>