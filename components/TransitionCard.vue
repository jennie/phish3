<template>
  <div class="absolute inset-0 bg-gray-800 bg-opacity-90 flex flex-col items-center justify-center text-white p-4 z-50">
    <h2 class="text-2xl font-bold mb-4">{{ title }}</h2>
    <p class="mb-6 text-center">{{ message }}</p>
    <button @click="$emit('proceed')"
      class="bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors">
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  gameStage: {
    type: String,
    required: true
  },
  isLastRegularScenario: {
    type: Boolean,
    required: true
  }
});

const title = computed(() => {
  if (props.gameStage === 'main' && !props.isLastRegularScenario) return "Scenario Complete";
  if (props.gameStage === 'main' && props.isLastRegularScenario) return "Main Scenarios Complete";
  if (props.gameStage === 'ending') return "Ending Scenario Complete";
  return "Stage Complete";
});

const message = computed(() => {
  if (props.gameStage === 'main' && !props.isLastRegularScenario) return "You've completed this scenario. Ready to move to the next one?";
  if (props.gameStage === 'main' && props.isLastRegularScenario) return "You've completed all main scenarios. Ready to see your ending?";
  if (props.gameStage === 'ending') return "You've completed the ending scenario. Ready to review your choices?";
  return "You've completed this stage. Ready to move to the next one?";
});

const buttonText = computed(() => {
  if (props.gameStage === 'main' && !props.isLastRegularScenario) return "Next Scenario";
  if (props.gameStage === 'main' && props.isLastRegularScenario) return "Proceed to Ending";
  if (props.gameStage === 'ending') return "Proceed to Recap";
  return "Next Stage";
});

defineEmits(['proceed']);
</script>