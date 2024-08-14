<template>
  <div class="fixed top-4 right-4 flex flex-col items-end z-50">
    <button @click="toggleDebugPanel"
      class="bg-red-500 text-white px-4 py-2 rounded-full uppercase text-xs hover:bg-red-600 transition-colors mb-2">
      {{ showDebugPanel ? 'Hide' : 'Show' }} Debug
    </button>

    <div v-if="showDebugPanel" class="bg-red-500 bg-opacity-80 text-white p-3 rounded text-xs max-w-xs w-full mt-2">
      <template v-if="gameStage !== 'recap'">
        <p v-if="currentScenario && gameSequence">Current Scenario: {{ currentScenarioIndex + 1 }} / {{
          gameSequence.length }}</p>
        <p v-if="currentScenario">Scenario ID: {{ currentScenario.id }}</p>
        <p v-if="currentScenario && filteredCards">Current Card: {{ currentCardIndex + 1 }} / {{
          filteredCards.length }}</p>
        <p v-if="currentScenario">Scenario Type: {{ currentScenario.scenarioType }}</p>
        <p v-if="currentCard">Card type: {{ currentCard.type }}</p>
      </template>
      <p v-if="score !== undefined">Score: {{ score }}</p>
      <p v-if="regularScenariosCount !== undefined">Regular Scenarios: {{ regularScenariosCount }}</p>
      <div v-if="gameStage === 'recap'" class="mt-4">
        <button @click="$emit('show-transition-card')"
          class="bg-yellow-500 text-black px-4 py-2 rounded-full mb-2 w-full">
          Show Transition Card
        </button>
        <button @click="$emit('skip-to-game-over')" class="bg-black text-white px-4 py-2 rounded-full mb-2 w-full">
          Skip to Game Over
        </button>
      </div>

      <template v-if="gameStage !== 'recap' && gameSequence">
        <p v-if="gameSequence.length > 0" class="mb-1">Scenarios in current order:</p>
        <div v-if="gameSequence.length > 0" class="flex flex-wrap gap-1">
          <a v-for="scenario in gameSequence" :key="scenario.id" @click.prevent="$emit('jump-to-scenario', scenario.id)"
            href="#"
            :class="['text-2xl px-2 hover:text-yellow-200 underline', { 'text-yellow-300 font-bold': scenario.id === currentScenario.id }]">
            {{ scenario.id }}
          </a>
        </div>
      </template>

      <div class="mt-4">
        <button v-if="gameStage === 'main'" @click="$emit('complete-scenario')"
          class="bg-yellow-500 text-black px-4 py-2 rounded-full mb-2 w-full">
          Complete Current Scenario
        </button>
        <button v-if="gameStage === 'main' && !isReadyForEnding" @click="$emit('skip-to-ending')"
          class="bg-black px-4 py-2 rounded-full mb-2 w-full">
          Skip to Ending Scenario
        </button>
        <button v-if="gameStage === 'ending'" @click="$emit('complete-scenario')"
          class="bg-yellow-500 text-black px-4 py-2 rounded-full mb-2 w-full">
          Complete Ending Scenario
        </button>
        <button v-if="gameStage === 'ending'" @click="$emit('skip-to-recap')"
          class="bg-black px-4 py-2 rounded-full mb-2 w-full">
          Skip to Recap
        </button>
        <button v-if="gameStage === 'recap'" @click="$emit('show-transition-card')"
          class="bg-yellow-500 text-black px-4 py-2 rounded-full mb-2 w-full">
          Show Transition Card
        </button>
        <button v-if="gameStage === 'recap'" @click="$emit('skip-to-game-over')"
          class="bg-black px-4 py-2 rounded-full mb-2 w-full">
          Skip to Game Over
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useGameState } from '@/composables/gameState';
const { filteredCards } = useGameState();
const props = defineProps({
  currentScenario: Object,
  currentScenarioIndex: Number,
  currentCardIndex: Number,
  currentCard: Object,
  gameSequence: Array,
  gameStage: String,
  isReadyForEnding: Boolean,
  score: Number,
  regularScenariosCount: Number,
});

const emit = defineEmits([
  'jump-to-scenario',
  'complete-scenario',
  'skip-to-ending',
  'move-to-next-stage',
  'skip-to-recap',
  'skip-to-game-over',
  'show-transition-card'
]);

const showDebugPanel = ref(false);

const toggleDebugPanel = () => {
  showDebugPanel.value = !showDebugPanel.value;
};
</script>
