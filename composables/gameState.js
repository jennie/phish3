import { ref, computed } from "vue";
import scenariosData from "../data/scenarios";

const gameStarted = ref(false);
const isRecapMode = ref(false);
const gameOver = ref(false);
const allScenarios = ref(scenariosData);
const gameSequence = ref([]);
const currentScenarioIndex = ref(0);
const currentCardIndex = ref(0);
const gameStage = ref("main");

const isTransitionCardVisible = ref(false);

const playerState = ref({
  score: 0,
});
const tutorialScenario = computed(() =>
  allScenarios.value.find((s) => s.scenarioType === "tutorial")
);
const regularScenarios = computed(() =>
  allScenarios.value.filter((s) => s.scenarioType === "regular")
);
const endingScenarios = computed(() =>
  allScenarios.value.filter((s) => s.scenarioType === "ending")
);

const resetGame = () => {
  gameStarted.value = false;
  currentScenarioIndex.value = 0;
  currentCardIndex.value = 0;
  playerState.value = {
    score: 0,
  };
  scenarios.value = randomizeScenarios();
  isRecapMode.value = false;
  gameOver.value = false;
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = resolve;
    img.onerror = reject;
  });
};

const initializeGame = async () => {
  if (!tutorialScenario.value) {
    console.error("No tutorial scenario found!");
    return;
  }

  // Preload images for all scenarios
  const allScenarios = [
    ...regularScenarios.value,
    ...endingScenarios.value,
    tutorialScenario.value,
  ];
  await preloadAllScenarios(allScenarios);

  const shuffledRegularScenarios = shuffleArray(regularScenarios.value);
  gameSequence.value = [tutorialScenario.value, ...shuffledRegularScenarios];
  // currentScenarioIndex.value = 0;
  // currentCardIndex.value = 0;
  // gameStage.value = "main";

  // Do not start the game yet, wait for the user to press start
  console.log(
    "Game initialized with tutorial and shuffled regular scenarios:",
    gameSequence.value.map((s) => s.id)
  );
};

const preloadAllScenarios = async (scenarios) => {
  try {
    for (const scenario of scenarios) {
      for (const card of scenario.cards) {
        if (card.image) {
          await preloadImage(card.image); // Preload each card image
        }
      }
    }
    console.log("All images preloaded successfully.");
  } catch (error) {
    console.error("Error preloading images:", error);
  }
};

const randomizeScenarios = () => {
  const [firstScenario, ...restScenarios] = scenariosData;
  const shuffledScenarios = shuffleArray(restScenarios);
  return [firstScenario, ...shuffledScenarios];
};

const scenarios = ref(randomizeScenarios());

const jumpToScenarioById = async (targetId) => {
  const targetIndex = scenarios.value.findIndex(
    (scenario) => scenario.id === parseInt(targetId)
  );
  if (targetIndex !== -1) {
    currentScenarioIndex.value = targetIndex;
    currentCardIndex.value = 0;
    return true;
  }
  return false;
};

const nextScenario = async (targetIndex = null) => {
  console.log("nextScenario called with targetIndex:", targetIndex);
  let nextIndex;

  if (targetIndex !== null) {
    nextIndex = targetIndex;
  } else {
    nextIndex = currentScenarioIndex.value + 1;
  }

  if (nextIndex < scenarios.value.length) {
    console.log("Setting currentScenario to index:", nextIndex);
    currentScenarioIndex.value = nextIndex;
    currentCardIndex.value = 0;
    console.log("New currentScenario:", currentScenario.value);
    return true;
  } else {
    console.log("No more scenarios available");
    return false;
  }
};

const currentScenario = computed(() => {
  if (!gameSequence.value || !gameSequence.value[currentScenarioIndex.value]) {
    console.warn("currentScenario is undefined or null");
    return null;
  }
  return gameSequence.value[currentScenarioIndex.value];
});

const filteredCards = computed(() => {
  return (
    currentScenario.value?.cards.filter((card) => card.type !== "scenario") ||
    []
  );
});

const currentCard = computed(() => {
  if (!currentScenario.value || !currentScenario.value.cards) {
    console.warn("currentCard is undefined or null");
    return null;
  }
  return currentScenario.value.cards[currentCardIndex.value] || null;
});

const userChoices = ref({});

const isEndingScenario = ref(false);

const startRecap = () => {
  isEndingScenario.value = false;
  isRecapMode.value = true;
  setGameStage("recap");
};

const isLastCardOfScenario = computed(() => {
  return (
    currentScenario.value &&
    currentCardIndex.value === currentScenario.value.cards.length - 1
  );
});

const isLastRegularScenario = computed(() => {
  return currentScenarioIndex.value === gameSequence.value.length - 1;
});

const jumpToScenario = (scenarioId) => {
  const index = gameSequence.value.findIndex((s) => s.id === scenarioId);
  if (index !== -1) {
    currentScenarioIndex.value = index;
    currentCardIndex.value = 0;
    console.log(`Jumped to scenario ${scenarioId} at index ${index}`);
  } else {
    console.error(`Scenario with id ${scenarioId} not found`);
  }
};
const setGameOver = (value) => {
  gameOver.value = value;
  isRecapMode.value = false;
  isEndingScenario.value = false;
  isTransitionCardVisible.value = false;
  if (value) {
    setGameStage("gameOver");
  }
};

const makeChoice = (isTrust, scenarioId) => {
  const scenario = scenarios.value.find((s) => s.id === scenarioId);
  if (scenario) {
    const decisionCard = scenario.cards.find(
      (card) => card.type === "decision"
    );
    if (decisionCard) {
      const choice = isTrust
        ? decisionCard.trustChoice
        : decisionCard.distrustChoice;
      let consequences = { trust: 0 };
      try {
        consequences = JSON.parse(choice.consequences);
      } catch (error) {
        console.error(
          `Error parsing consequences for scenario ${scenarioId}:`,
          error
        );
      }
      playerState.value.score += consequences || 0;
      console.log(
        `Score updated: ${playerState.value.score} (${
          isTrust ? "trust" : "distrust"
        } choice in scenario ${scenarioId})`
      );

      userChoices.value[scenarioId] = {
        choice: isTrust ? "trust" : "distrust",
        feedback: choice.feedback,
        isCorrect: true, // You may want to implement logic to determine if the choice was correct
        choiceText: isTrust
          ? decisionCard.trustLabel
          : decisionCard.distrustLabel,
        scoreChange: consequences || 0,
      };
    }
  }
};
function nextCard() {
  console.log("nextCard() called");
  if (!currentScenario.value || !currentCard.value) {
    console.warn("No current scenario or card available");
    return;
  }

  console.log("Current card type:", currentCard.value.type);

  if (currentCard.value.type === "decision") {
    console.log("Decision card reached, awaiting player choice");
    return; // Stop progression here
  }

  if (currentCardIndex.value < currentScenario.value.cards.length - 1) {
    currentCardIndex.value++;
    console.log("Moved to next card, new index:", currentCardIndex.value);
  } else {
    console.log("Last card reached");
    // Handle end of scenario
  }
}

function previousCard() {
  if (currentCardIndex.value > 0) {
    currentCardIndex.value--;
    return true;
  }
  return false;
}

const startGame = () => {
  gameStarted.value = true;
  currentScenarioIndex.value = 0;
  currentCardIndex.value = 0;
  // Additional logic to begin the first scenario, if needed
};

const setGameStage = (stage) => {
  gameStage.value = stage;
};

const completeCurrentScenario = async () => {
  console.log("completeCurrentScenario called");
  console.log("Current scenario before completion:", currentScenario.value);

  if (!currentScenario.value) {
    console.error("No current scenario found");
    return;
  }

  const scenarioId = currentScenario.value.id;
  console.log(`Completing scenario ${scenarioId}`);

  // Make a random choice if not already made
  if (!userChoices.value[scenarioId]) {
    const isTrust = Math.random() < 0.5;
    makeChoice(isTrust, scenarioId);
  }

  // Check if it's the last scenario in the main sequence
  const isLastMainScenario =
    currentScenarioIndex.value === gameSequence.value.length - 1;

  if (isLastMainScenario) {
    console.log("Last main scenario completed. Ready for ending.");
    isTransitionCardVisible.value = true;
  } else {
    // Move to the next scenario
    moveToNextScenario();
  }
};

const moveToNextScenario = () => {
  if (currentScenarioIndex.value < gameSequence.value.length - 1) {
    currentScenarioIndex.value++;
    currentCardIndex.value = 0; // Reset card index to the start of the new scenario
    console.log(`Moved to scenario ${currentScenario.value.id}`);
  } else {
    // Reached the last scenario, now move to the ending stage or next phase
    moveToNextStage();
  }
};

const moveToNextStage = () => {
  isTransitionCardVisible.value = false;
  if (gameStage.value === "main") {
    console.log("Moving to ending stage");
    gameStage.value = "ending";
    moveToEndingStage();
  } else if (gameStage.value === "ending") {
    console.log("Moving to recap stage");
    startRecap();
  } else if (gameStage.value === "recap") {
    console.log("Moving to game over");
    setGameOver(true);
  }
};

const moveToEndingStage = () => {
  const playerScore = playerState.value.score;
  const matchingEndingScenario = endingScenarios.value.find(
    (s) =>
      playerScore >= s.cards[0].minScore && playerScore <= s.cards[0].maxScore
  );

  if (matchingEndingScenario) {
    gameSequence.value = [matchingEndingScenario];
    currentScenarioIndex.value = 0;
    currentCardIndex.value = 0;
    setGameStage("ending");
    console.log(`Moved to ending scenario ${matchingEndingScenario.id}`);
  } else {
    console.error(`No matching ending scenario found for score ${playerScore}`);
  }
};

// ... rest of the code ...
export function useGameState() {
  return {
    scenarios: computed(() => scenarios.value),
    completeCurrentScenario,
    currentCard,
    currentCardIndex,
    currentScenario,
    currentScenarioIndex,
    endingScenarios,
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
    moveToEndingStage,
    moveToNextScenario,
    moveToNextStage,
    nextCard,
    nextScenario,
    playerState,
    previousCard,
    regularScenarios,
    resetGame,
    scenarios,
    setGameOver,
    setGameStage,
    startGame,
    startRecap,
    tutorialScenario,
    userChoices,
    isTransitionCardVisible,
  };
}
