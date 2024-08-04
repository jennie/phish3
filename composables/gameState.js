import { ref, computed } from "vue";
import scenariosData from "../data/scenarios";

const gameStarted = ref(false);
const currentScenarioIndex = ref(0);
const currentCardIndex = ref(0);
const playerState = ref({
  trust: 50,
  security: 50,
  gooseInfiltration: 0,
});

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

const resetGame = () => {
  gameStarted.value = false;
  currentScenarioIndex.value = 0;
  currentCardIndex.value = 0;
  playerState.value = {
    trust: 50,
    security: 50,
    gooseInfiltration: 0,
  };
  scenarios.value = randomizeScenarios();
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

const gameOver = computed(() => {
  const state = playerState.value;
  return (
    state.trust <= 0 ||
    state.trust >= 100 ||
    state.security <= 0 ||
    state.security >= 100 ||
    currentScenarioIndex.value >= scenarios.value.length - 1
  );
});

function makeChoice(isTrust) {
  const decisionCard = currentScenario.value.cards.find(
    (card) => card.type === "decision"
  );
  if (decisionCard) {
    const choice = isTrust
      ? decisionCard.trustChoice
      : decisionCard.distrustChoice;
    const newState = { ...playerState.value };
    Object.keys(choice.consequences).forEach((key) => {
      newState[key] += choice.consequences[key];
      newState[key] = Math.max(0, Math.min(100, newState[key]));
    });
    playerState.value = newState;
  }
}

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
    nextScenario,
    previousCard,
    gameOver,
    playerState,
    scenarios: computed(() => scenarios.value),
    startGame,
    resetGame,
    currentScenarioIndex,
    jumpToScenarioById,
  };
}
