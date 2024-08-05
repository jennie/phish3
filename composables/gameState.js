import { ref, computed } from "vue";
import scenariosData from "../data/scenarios";

const gameStarted = ref(false);
const currentScenarioIndex = ref(0);
const currentCardIndex = ref(0);
const isRecapMode = ref(false);
const gameOver = ref(false);

const playerState = ref({
  score: 0,
});

const setGameOver = (value) => {
  gameOver.value = value;
  isRecapMode.value = false;
};

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

// Function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Create a randomized sequence of scenarios, keeping the first one (tutorial) in place
const randomizeScenarios = () => {
  const [firstScenario, ...restScenarios] = scenariosData;
  const shuffledScenarios = shuffleArray(restScenarios);
  return [firstScenario, ...shuffledScenarios];
};

const scenarios = ref(randomizeScenarios());

const startRecap = () => {
  isRecapMode.value = true;
};
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
  return scenarios.value[currentScenarioIndex.value] || null;
});

const currentCard = computed(() => {
  if (currentScenario.value && currentScenario.value.cards) {
    return currentScenario.value.cards[currentCardIndex.value];
  }
  return null;
});

const userChoices = ref({});

const makeChoice = (isTrust) => {
  const decisionCard = currentScenario.value.cards.find(
    (card) => card.type === "decision"
  );
  if (decisionCard) {
    const choice = isTrust
      ? decisionCard.trustChoice
      : decisionCard.distrustChoice;

    // Update user choices
    userChoices.value[currentScenario.value.id] = {
      choice: isTrust ? "trust" : "distrust",
      isCorrect: choice.consequences === 1,
      feedback: choice.feedback,
    };

    // Update player state and score
    playerState.value = {
      ...playerState.value,
      score: playerState.value.score + (choice.consequences === 1 ? 1 : 0),
    };
  }
};

function nextCard() {
  if (currentCardIndex.value < currentScenario.value.cards.length - 1) {
    currentCardIndex.value++;
    return true;
  } else {
    return nextScenario();
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
};

export function useGameState() {
  return {
    gameStarted,
    currentScenario,
    currentCard,
    makeChoice,
    nextCard,
    userChoices,
    nextScenario,
    previousCard,
    gameOver,
    playerState,
    setGameOver,
    scenarios: computed(() => scenarios.value),
    startGame,
    resetGame,
    isRecapMode,
    startRecap,
    currentScenarioIndex,
    currentCardIndex,
    jumpToScenarioById,
  };
}
