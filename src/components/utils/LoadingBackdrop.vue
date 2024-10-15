<script setup>
import CardBoxModal from '@/components/CardBoxModal.vue'
import ProgressSpin from '@/components/utils/ProgressSpin.vue'
import { computed } from 'vue'

const props = defineProps({
  text: { type: String, required: false, default: '' },
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<template>
  <CardBoxModal
    v-model="value"
    title=""
    done-button-label=""
    :interactive="false"
    z-index="z-1000"
    class="absolute h-screen opacity-80 inset-0"
  >
    <ProgressSpin />
    <p class="text-center dark:text-white pb-4">{{ props.text }}</p>
  </CardBoxModal>
</template>
