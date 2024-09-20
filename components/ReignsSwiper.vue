<template>

  <StartGameScreen v-if="!gameStarted" />
  <EndingScenarioSwiper v-else-if="isPlayingEndingScenario" />
  <RecapSwiper v-else-if="isRecapMode" />
  <GameOverScreen v-else-if="gameOver" :finalScore="playerState.score" @restart-game="resetGame" />

  <TransitionCard v-if="isTransitionCardVisible" :title="getTransitionCardTitle" :message="getTransitionCardMessage"
    :button-text="getTransitionCardButtonText" @proceed="handleMoveToNextStage" />

  <div v-if="currentScenario && currentCard" class="bg-black flex flex-col h-dvh justify-between">
    <!-- Floating Text Container -->
    <div class="flex-none h-1/6 flex items-center justify-center pointer-events-none p-6">
      <Transition name="fade" mode="out-in">
        <div v-if="currentCard && currentCard.text" :key="currentCardIndex"
          class="card-text text-sm text-white leading-snug text-center" v-html="parseCardText(currentCard.text)">
        </div>
        <div v-else-if="lastDecisionText" :key="'last-decision'"
          class="card-text text-sm text-white leading-snug text-center" v-html="parseCardText(lastDecisionText)">
        </div>
        <div v-else key="no-text" class="text-sm text-white leading-snug text-center">
          <!-- You can add a loading message or leave it empty -->
        </div>
      </Transition>
    </div>

    <!-- Slides/Cards Container -->
    <div class="flex-grow absolute h-full w-full flex items-center justify-center overflow-hidden">
      <swiper-container v-if="isDataReady" ref="swiperRef" :modules="modules" effect="tinder" :slides-per-view="1"
        :allow-touch-move="true" observer observer-parents :init="false" class="w-full h-full">
        <swiper-slide v-for="(card, index) in filteredCards" :key="index" class="flex items-center justify-center">
          <div :ref="el => { if (el) cardRefs[index] = el }" class="card-container relative"
            :class="{ 'is-flipped': isRevealCardFlipped }">

            <div
              :class="['card-face front absolute inset-0 rounded-xl overflow-hidden transition-transform duration-600', { 'rotate-y-180': cardFlipStates[card.id] }]">
              <div class="absolute inset-0 bg-cover bg-center rounded-xl border-8 border-white aspect-[11/19] "
                :style="{ backgroundImage: `url(${getCardImage(card, true)})` }">
                <Transition name="pop-fade">
                  <div v-if="card.type === 'decision' && showDecisionIcon && !isCardSwiping">

                    <button @click.stop="toggleOverlay(card)"
                      class="focus:outline-none absolute top-4 right-4 bg-yellow-200 text-black leading-none rounded-full p-2 shadow-lg icon-pop z-30">
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
                    class="absolute inset-0 bg-zinc-800 bg-opacity-90 flex flex-col text-gray-200 p-4 z-50">

                    <div>
                      <button @click.stop="toggleOverlay(card)" class="focus:outline-none absolute top-4 right-4
                          bg-yellow-200 text-black leading-none rounded-full p-2 shadow-lg icon-pop z-30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div class="flex-grow overflow-y-auto overlay">
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
            <!-- Back face (reveal card) -->
            <div v-if="card.type === 'reveal'" :class="['card-face back absolute inset-0 rounded-xl overflow-hidden transition-transform duration-600 border-8 border-white',
              {
                'rotate-y-180': !cardFlipStates[card.id],
                'mfa-reveal-card': currentScenario.scenarioType === 'mfa',
                'regular-reveal-card': currentScenario.scenarioType !== 'mfa'
              }]" :style="{ backgroundImage: `url(${getCardImage(card, false)})` }" class="w-full h-full">
              <!-- MFA-specific reveal card content -->
              <template v-if="currentScenario.scenarioType === 'mfa'">
                <div class="absolute inset-0 bg-cover bg-center"
                  :style="{ backgroundImage: `url(${getScenarioImage(currentScenario)})` }">
                  <div class="absolute inset-0 bg-opacity-90 flex flex-col overflow-y-auto justify-between"
                    :class="card.isCorrect ? 'bg-green-400' : 'bg-red-300'">
                    <div class="flex flex-col">
                      <!-- Sash container -->
                      <div class=" top-0 left-0  w-full overflow-hidden ">
                        <!-- Sash -->
                        <div :class="[
                          'w-full text-center py-4 text-white text-2xl font-bold font-sans uppercase',
                          card.isCorrect ? 'bg-green-500' : 'bg-red-500'
                        ]">
                          {{ card.isCorrect ? 'Correct!' : 'Incorrect!' }}
                        </div>
                      </div>
                      <div>
                        <div class="pt-6 px-3">
                          <p class="font-display font-black text-black mb-2 text-center text-lg">
                            {{ card.userAction }}
                          </p>
                        </div>
                        <div class="p-3">
                          <p class="text-center text-xs text-white mb-1 flex flex-col items-center justify-center">
                            <span class="text-sm rounded-md text-black">
                              <div>{{ card.outcome }}</div>
                            </span>
                          </p>
                        </div>
                      </div>
                      <div class="learning-objective text-black p-3">
                        <p class="font-display text-base text-black text-center leading-snug">
                          {{ currentScenario.learningObjectives }}
                        </p>
                      </div>
                    </div>



                  </div>
                </div>
              </template>

              <!-- Regular reveal card content -->
              <template v-else>
                <div class="regular-reveal-content h-full flex items-center justify-center">
                  <div class="p-4 text-white">
                    <p v-if="card.feedback" class="text-lg text-center font-display embossed-text text-blue-100"
                      v-html="parseCardText(card.feedback)" />
                    <p v-else class="text-xl px-8">No feedback available</p>
                  </div>
                </div>
              </template>

            </div>
            <div v-if="isTransitionCard"
              class="absolute inset-0 bg-gray-800 bg-opacity-90 flex flex-col items-center justify-center text-white p-4 z-50">
              <h2 class="text-2xl font-bold mb-4">Scenario Complete</h2>
              <p class="mb-6 text-center">You've completed this scenario. Ready to move to the next one?</p>
              <button @click="moveToNextScenario"
                class="bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors">
                Proceed to Next Scenario
              </button>
            </div>
          </div>
        </swiper-slide>
      </swiper-container>
      <div v-else class="h-full flex items-center justify-center text-white">
        Loading scenarios...
      </div>
    </div>

    <!-- Controls Container -->
    <div class="h-1/6 flex flex-col align-middle items-center justify-start w-full">

      <div class="px-6 w-full flex space-x-12 justify-between z-10 ">
        <a href="/" @click.prevent="returnToStartScreen" class="p-2 self self-center">
          <HomeButton />
        </a>
        <div class="flex -mt-8 justify-center gap-5 z-10 py-2 mb-4 space-x-4 w-full ">
          <button @click="isDecisionCard ? handleDistrustClick() : handlePreviousClick()"
            :disabled="(!canNavigateBack && !isDecisionCard) || isFlipping" :class="['flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110',
              { 'opacity-50 cursor-not-allowed': (!canNavigateBack && !isDecisionCard) || isFlipping }]">
            <BackButton v-if="!isDecisionCard" />
            <div v-else-if="currentScenario?.scenarioType === 'mfa'"
              class="bg-red-400 rounded-full py-2 px-4 font-bold text-base">DENY</div>
            <ThumbsDown v-else />
          </button>

          <button @click="isDecisionCard ? handleTrustClick() : handleNextClick()"
            :disabled="!canNavigateForward || isFlipping" :class="['flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110',
              { 'opacity-50 cursor-not-allowed': !canNavigateForward || isFlipping }]">
            <NextButton v-if="!isDecisionCard" />
            <span v-else-if="currentScenario?.scenarioType === 'mfa'"
              class="bg-green-400 rounded-full py-2 px-4 font-bold text-base">APPROVE</span>
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
    <DebugPanel :current-scenario="currentScenario" :current-scenario-index="currentScenarioIndex"
      :current-card-index="currentCardIndex" :current-card="currentCard" :game-sequence="gameSequence"
      :game-stage="gameStage" :is-ready-for-ending="isReadyForEnding" :score="playerState.score"
      :regular-scenarios-count="regularScenarios.length" @jump-to-scenario="handleJumpToScenario"
      @complete-scenario="handleCompleteScenario" @skip-to-ending="skipToEndingScenario"
      @move-to-next-stage="handleMoveToNextStage" @skip-to-recap="skipToRecap" @skip-to-game-over="skipToGameOver" />
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

const toggleDebugPanel = () => {
  showDebugPanel.value = !showDebugPanel.value;
};

const modules = [EffectTinder];
const swiperRef = ref(null);
const swiper = ref(null);
const cardRefs = ref([]);
const isTransitioning = ref(false);
const flipTimeout = ref(null);
const lastDecisionText = ref('');
const isDecisionCard = computed(() => {
  return currentCard.value?.type === 'decision';
});
const currentScore = computed(() => playerState.value.score);


const isRevealCardFlipped = ref(false);

const parseCardText = (text) => {
  if (!text) return ''; // Return an empty string if text is undefined or null
  console.log('Parsing card text:', text);
  return text.replace(/\n/g, '<br>');
};
const isFlipping = ref(false);

const selectedScenarioId = ref(null);

const {
  cardFlipStates,
  completeCurrentScenario,
  currentCard,
  currentCardIndex,
  currentScenario,
  currentScenarioIndex,
  filteredCards,
  gameOver,
  gameSequence,
  gameStage,
  gameStarted,
  initializeGame,
  isEndingScenario,
  isLastCardOfScenario,
  isLastRegularScenario,
  isRecapMode,
  jumpToScenario,
  jumpToScenarioById,
  makeChoice,
  moveToNextScenario,
  moveToNextStage,
  nextCard,
  nextScenario,

  playerState,
  previousCard,
  resetCardFlipStates,
  resetGame,
  setGameOver,
  scenarios,
  startRecap,
  userChoices,
  isTransitionCardVisible,


} = useGameState();


const isTransitionCard = computed(() => {
  return currentCard.value && currentCard.value.type === 'transition';
});
const isReadyForEnding = computed(() => {
  if (!currentScenario.value || !currentScenario.value.cards) {
    // Handle the scenario where currentScenario or its cards are not yet defined
    console.log("Current scenario or its cards are undefined.");
    return false;
  }

  return currentScenarioIndex.value === gameSequence.value.length - 1 &&
    currentCardIndex.value === currentScenario.value.cards.length - 1;
});


const handleCompleteScenario = async () => {
  console.log("handleCompleteScenario called");
  await completeCurrentScenario();
};

const handleMoveToNextStage = () => {
  console.log("handleMoveToNextStage called");
  moveToNextStage();
};

const getTransitionCardTitle = computed(() => {
  if (isLastRegularScenario.value) return "Main Scenarios Complete";
  if (isEndingScenario.value) return "Ending Scenario Complete";
  return "Scenario Complete";
});

const getTransitionCardMessage = computed(() => {
  if (isLastRegularScenario.value) return "You've completed all main scenarios. Ready to see your ending?";
  if (isEndingScenario.value) return "You've completed the ending scenario. Ready to review your choices?";
  return "You've completed this scenario. Ready to move to the next one?";
});

const getTransitionCardButtonText = computed(() => {
  if (isLastRegularScenario.value) return "Proceed to Ending";
  if (isEndingScenario.value) return "Proceed to Recap";
  return "Next Scenario";
});

const regularScenarios = computed(() =>
  scenarios.value.filter(s => s.scenarioType !== 'ending' && s.id !== null)
);
const endingScenarios = computed(() => scenarios.value.filter(s => s.scenarioType === 'ending'));


const unplayedRegularScenarios = computed(() => {
  return regularScenarios.value.filter(scenario => !userChoices.value[scenario.id]);
});




const skipToEndingScenario = () => {
  moveToNextStage();
};

// Update transitionToNextScenario
const transitionToNextScenario = async () => {
  isTransitioning.value = true;
  isRevealCardFlipped.value = false; // Reset flip state

  if (currentScenarioIndex.value < regularScenarios.value.length - 1) {
    // Move to the next regular scenario
    currentScenarioIndex.value++;
    currentCardIndex.value = 0;

  } else {
    // We're at the end of the ending scenario, start recap
    moveToNextStage();

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
let swipingTimeout = null;


watch(() => currentCard.value, (newCard) => {
  console.log("Current card changed:", newCard);
  if (newCard?.type === 'reveal') {
    console.log("Reveal card detected, scheduling flip");
    setTimeout(flipRevealCard, 1000);
  } else {
    console.log("Resetting reveal card flip");
    isRevealCardFlipped.value = false;
  }
});

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



const isDataReady = computed(() => {
  const ready = !!currentScenario.value &&
    !!currentScenario.value.cards &&
    currentScenario.value.cards.length > 0;
  console.log('isDataReady:', ready);
  console.log('currentScenario:', currentScenario.value);
  return ready;
});

watch(() => currentScenario.value, (newScenario) => {
  console.log('currentScenario changed:', newScenario);
  if (newScenario && newScenario.cards && newScenario.cards.length > 0) {
    nextTick(() => {
      initializeSwiper();
    });
  }
}, { immediate: true });
watch(() => currentScenario.value, async (newScenario) => {
  if (newScenario) {
    currentCardIndex.value = 0;
    await nextTick();
    if (swiper.value) {
      swiper.value.slideTo(0, 0);
      await swiper.value.update();
    }
  }
}, { immediate: true });

watch(() => currentCardIndex.value, async (newIndex) => {
  console.log(`Card index changed to ${newIndex}`);
  if (swiper.value) {
    swiper.value.slideTo(newIndex, 0);
  }
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

const handleSlideChangeTransitionEnd = () => {
  if (currentCard.value?.type === 'decision') {
    showDecisionIcon.value = false;
    nextTick(() => {
      showDecisionIcon.value = true;
    });
  } else {
    showDecisionIcon.value = false;
  }
};
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

const flipRevealCard = () => {
  if (currentCard.value?.type === 'reveal' && !isRevealCardFlipped.value) {
    console.log("Flipping reveal card");
    isRevealCardFlipped.value = true;

    // Add a timeout or use the transitionend event to update the face after the flip is done
    setTimeout(() => {
      // Update the card face here
      currentCard.value = getNextCard();
    }, 600); // Match this time with your CSS transition time
  }
};

// const flipRevealCard = (index) => {
//   console.log("flipRevealCard called for index:", index);
//   const card = currentScenario.value.cards[index];
//   if (card && card.type === 'reveal' && !isRevealCardFlipped.value) {
//     if (flipTimeout.value) {
//       clearTimeout(flipTimeout.value);
//     }
//     isFlipping.value = true;
//     flipTimeout.value = setTimeout(() => {
//       console.log("Flipping card in flipRevealCard");
//       cardFlipStates.value[card.id] = true;
//       isRevealCardFlipped.value = true;
//       isFlipping.value = false;
//     }, 1000);
//   }
// };


const initializeSwiper = () => {
  if (swiperRef.value && isDataReady.value) {
    try {
      const swiperParams = {
        modules: [EffectTinder],
        effect: 'tinder',
        slidesPerView: 1,
        allowTouchMove: true,
        watchSlidesProgress: true,
        virtualTranslate: true,
        on: {
          slideChangeTransitionEnd: handleSlideChangeTransitionEnd,
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
          slideChange: (swiper) => {
            handleSlideChange(swiper);
            // Disable swiping on decision and reveal cards
            if (currentCard.value?.type === 'decision' || currentCard.value?.type === 'reveal') {
              swiper.allowTouchMove = false;
            } else {
              swiper.allowTouchMove = true;
            }
          },
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
      console.log('Swiper initialized successfully');
    } catch (error) {
      console.error('Error initializing Swiper:', error);
    }
  } else {
    console.log('Swiper not initialized: swiperRef or data not ready');
  }
};


onMounted(async () => {
  await initializeSwiper();
  if (gameStarted.value) {
    initializeGame();
  }
  if (flipTimeout.value) {
    clearTimeout(flipTimeout.value);
  }
});

watch(gameStarted, (newValue) => {
  if (newValue) {
    initializeGame();
  }
});

watch(isDataReady, async (ready) => {
  if (ready) {
    await initializeSwiper();
  }
});

watch(currentScenario, async (newScenario, oldScenario) => {
  if (newScenario && newScenario !== oldScenario) {
    console.log('Current scenario changed to:', newScenario.id);
    console.log('New scenario data:', JSON.stringify(newScenario, null, 2));
    resetCardFlipStates();
    cardFlipStates.value = {};
    newScenario.cards.forEach((card, index) => {
      if (!card.id) {
        card.id = `card-${index}`;
      }
      cardFlipStates.value[card.id] = false;
    });

    await nextTick();
    if (!swiper.value) { // Ensure Swiper isn't re-initialized unnecessarily
      initializeSwiper();
    }
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

watch(isReadyForEnding, (ready) => {
  console.log('isReadyForEnding changed:', ready);
});

watch(gameStage, (newStage) => {
  console.log('Game stage changed to:', newStage);
});

watch(currentScenarioIndex, (newIndex) => {
  console.log('Current scenario index:', newIndex, 'of', gameSequence.value.length);
});
watch(currentCardIndex, (newIndex, oldIndex) => {
  console.log(`Card index changed from ${oldIndex} to ${newIndex}`);
  console.log('Current card:', currentCard.value);

  isRevealCardFlipped.value = false; // Reset flip state

  if (currentCard.value?.type === 'reveal') {
    setTimeout(() => {
      isRevealCardFlipped.value = true;
    }, 1000);
  }
});


watch(cardFlipStates, (newStates) => {
  console.log("Updated card flip states:", newStates);
}, { deep: true });


const getScenarioImage = (scenario) => {
  const decisionCard = scenario.cards.find(card => card.type === 'decision');
  return decisionCard?.image || '/images/card-placeholder.png';
};

const getScoreChange = (scenario) => {
  const choice = userChoices.value[scenario.id];
  return choice ? choice.scoreChange : 0;
};

const handleChoice = async (isTrust) => {
  if (currentCard.value?.type === 'decision' && !isFlipping.value) {
    isFlipping.value = true;
    makeChoice(isTrust, currentScenario.value.id);

    const choice = isTrust ? currentCard.value.trustChoice : currentCard.value.distrustChoice;
    const revealCard = currentScenario.value.cards.find(card => card.type === 'reveal');

    if (revealCard && currentScenario.value.scenarioType === 'mfa') {
      revealCard.userAction = isTrust ? 'You approved the login attempt!' : 'You denied the login attempt!';
      revealCard.outcome = choice.feedback;
      revealCard.scoreChange = choice.consequences;
      revealCard.isCorrect = choice.consequences === 1;
    } else if (revealCard) {
      revealCard.feedback = choice.feedback;
    }

    // Move to the reveal card
    swiperRef.value.swiper.slideNext();

    // Ensure the reveal card is displayed before flipping
    await nextTick();

    // Flip the reveal card after a short delay
    setTimeout(() => {
      isRevealCardFlipped.value = true;
    }, 1000);

    isFlipping.value = false;
  }
};

const handleJumpToScenario = (scenarioId) => {
  jumpToScenario(scenarioId);
};
const handleTrustClick = () => handleChoice(true);
const handleDistrustClick = () => handleChoice(false);


const handleNextClick = async () => {
  console.log("handleNextClick called");
  if (!isFlipping.value) {
    if (currentCard.value?.type === 'reveal' && isRevealCardFlipped.value) {
      console.log("Reveal card flipped, moving to next scenario");
      isRevealCardFlipped.value = false;
      await moveToNextScenario();
      currentCardIndex.value = 0;
    } else if (!isLastCardOfScenario.value) {
      console.log("Moving to next card");
      swiperRef.value.swiper.slideNext();
    } else {
      console.log("Last card of scenario, moving to next scenario");
      isRevealCardFlipped.value = false; // Reset flip state
      await moveToNextScenario();
      currentCardIndex.value = 0;
    }
    await nextTick();
    if (swiper.value) {
      swiper.value.slideTo(currentCardIndex.value, 0);
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

const handleMoveToNextScenario = () => {
  isTransitionCardVisible.value = false;
  moveToNextScenario();
};


const isCorrect = (scenario) => {
  const choice = userChoices.value[scenario.id];
  if (!choice) return false;

  const decisionCard = scenario.cards.find(card => card.type === 'decision');
  if (!decisionCard) return false;

  // For MFA scenarios, we determine correctness based on the consequences value
  if (scenario.scenarioType === 'mfa') {
    const chosenConsequences = choice.choice === 'trust'
      ? decisionCard.trustChoice.consequences
      : decisionCard.distrustChoice.consequences;
    return chosenConsequences === 1;
  }

  // For non-MFA scenarios, we can use the existing logic
  return choice.scoreChange > 0;
};

function getCardImage(card, isFront) {
  if (card.type === 'reveal' && isFront) {
    return '/images/card-back.jpg';
  }
  return card.image;
}


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

/* 

.card-face.front {
  z-index: 2;
  transform: rotateY(0deg);
}

.card-face.back {
  z-index: 1;
  transform: rotateY(180deg);
}

.card-container.is-flipped .card-face.front {
  z-index: 1;
  transform: rotateY(180deg);
}

.card-container.is-flipped .card-face.back {
  z-index: 2;
  transform: rotateY(0deg);
}


 */

.card-container {
  @apply aspect-[11/19] h-4/6 relative;
  perspective: 2000px;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card-face {
  @apply z-10;
  backface-visibility: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.card-back {
  @apply z-20;
  transform: rotateY(180deg);
  /* Ensure the back starts flipped */
}

.card-face,
.card-back {
  transform-style: preserve-3d;
  width: 100%;
  height: 100%;
  position: absolute;
}

/* Apply backface-visibility only where needed */
.card-face {
  backface-visibility: hidden;
  /* Apply to front face */
}

.card-back {
  backface-visibility: hidden;
  /* Apply to back face */
  transform: rotateY(180deg);
  /* Start flipped */
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
  z-index: 0;
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

  70% {
    transform: scale(1.1);
    opacity: 1;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.icon-pop {
  animation: pop-in 0.3s ease-out;
}

.pop-fade-enter-active {
  animation: pop-in 0.3s ease-out;
}

.pop-fade-leave-active {
  animation: pop-out 0.2s ease-in;
}

@keyframes pop-out {
  from {
    transform: scale(1);
    opacity: 1;
  }

  to {
    transform: scale(0);
    opacity: 0;
  }
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

.card-container.is-flipped .card-face {
  z-index: 1;
  /* Keep front on top initially */
}

.card-container.is-flipped .card-back {
  z-index: 2;
  /* Ensure back face is on top after flip */
}

.card-text {


  br {
    @apply mb-2 block;
    content: "";
  }

  p {
    @apply mb-0
  }

}

.mfa-reveal-card {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform-style: preserve-3d;
}

.clip-diagonal {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, 85% 0, 100% 15%, 100% 100%, 0 100%);
}

.mfa-reveal-card .card-face {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

/* Swiper specific styles */
.swiper-slide-shadow {
  @apply absolute inset-0 bg-black bg-opacity-15 pointer-events-none z-10;
}

/* Safe area adjustment */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}

.mfa-reveal-card .learning-objective {
  br {
    @apply mb-2 block;
    content: "";
  }

  p {
    @apply mb-0;
  }
}

.regular-reveal-card,
.is-flipped .card-face.front {
  background-image: url('/images/card-back.jpg');
  background-size: cover;
  background-position: center center;
}

/* Ensure MFA styles don't bleed into regular cards */
.card-face.back:not(.mfa-reveal-card) .absolute.inset-0.bg-opacity-90 {
  display: none;
}

/* Add this to your CSS */
swiper-container {
  perspective: 1000px;
}
</style>