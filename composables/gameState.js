// src/composables/gameState.js

import { ref, computed } from "vue";
import scenariosData from "../data/scenarios";

export function useGameState() {
  const currentScenarioIndex = ref(0);
  const scenarios = ref(
    scenariosData.map((scenario) => ({
      ...scenario,
      isFlipped: false,
    }))
  );
  const playerState = ref({
    trust: 50,
    security: 50,
    gooseInfiltration: 0,
  });

  const currentScenario = computed(
    () => scenarios.value[currentScenarioIndex.value]
  );

  const gameOver = computed(() => {
    const state = playerState.value;
    return (
      state.trust <= 0 ||
      state.trust >= 100 ||
      state.security <= 0 ||
      state.security >= 100 ||
      state.gooseInfiltration >= 100
    );
  });

  function makeChoice(isTrust) {
    if (currentScenario.value) {
      const choice = isTrust
        ? currentScenario.value.trustChoice
        : currentScenario.value.distrustChoice;
      const newState = { ...playerState.value };
      Object.keys(choice.consequences).forEach((key) => {
        newState[key] += choice.consequences[key];
        newState[key] = Math.max(0, Math.min(100, newState[key]));
      });
      playerState.value = newState; // This should trigger reactivity
      currentScenarioIndex.value++;
    }
  }

  function updateCurrentScenario(scenario) {
    console.log("updateCurrentScenario called with:", scenario);
    currentScenarioIndex.value = scenarios.value.findIndex(
      (s) => s.id === scenario.id
    );
    // console.log("New currentScenarioIndex:", currentScenarioIndex.value);
  }

  return {
    currentScenario,
    makeChoice,
    gameOver,
    playerState,
    scenarios: scenarios.value,
    updateCurrentScenario,
  };
}
