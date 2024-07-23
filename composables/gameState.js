import { ref, computed } from "vue";
import scenariosData from "../data/scenarios";

export function useGameState() {
  console.log("Initializing gameState with scenarios:", scenariosData);

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

  const currentScenario = computed(() => {
    console.log(
      "Computing currentScenario. Index:",
      currentScenarioIndex.value,
      "Scenarios:",
      scenarios.value
    );
    return scenarios.value[currentScenarioIndex.value] || null;
  });

  const currentCard = computed(() => {
    console.log(
      "Computing currentCard. Scenario:",
      currentScenario.value,
      "CardIndex:",
      currentCardIndex.value
    );
    return currentScenario.value?.cards[currentCardIndex.value] || null;
  });

  const gameOver = computed(() => {
    const state = playerState.value;
    return (
      state.trust <= 0 ||
      state.trust >= 100 ||
      state.security <= 0 ||
      state.security >= 100 ||
      state.gooseInfiltration >= 100 ||
      currentScenarioIndex.value >= scenarios.value.length
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
    } else {
      // Move to next scenario
      if (currentScenarioIndex.value < scenarios.value.length - 1) {
        currentScenarioIndex.value++;
        currentCardIndex.value = 0;
        console.log("Moving to next scenario:", currentScenarioIndex.value);
      } else {
        // Game over logic here
        console.log("Game Over");
      }
    }
    console.log("Next card:", currentCard.value);
  }

  function nextScenario() {
    if (currentScenarioIndex.value < scenarios.value.length - 1) {
      currentScenarioIndex.value++;
      currentCardIndex.value = 0;
      console.log("Moving to next scenario:", currentScenarioIndex.value);
    } else {
      // Game over logic here
      console.log("Game Over");
    }
    console.log("Next scenario:", currentScenario.value);
  }

  function previousCard() {
    if (currentCardIndex.value > 0) {
      currentCardIndex.value--;
    }
  }

  return {
    currentScenario,
    currentCard,
    makeChoice,
    nextCard,
    nextScenario,
    previousCard,
    gameOver,
    playerState,
    scenarios: computed(() => scenarios.value),
  };
}
