<script setup>
import { borderColors } from '@/colors'
import { computed } from 'vue'

const props = defineProps({
  severity: String
})

const componentClass = computed(() => {
  const base = ['mt-4', 'p-4', 'rounded', 'border-4']

  if (borderColors[props.severity]) {
    base.push(borderColors[props.severity])
  } else {
    base.push(borderColors.danger)
  }

  return base
})
</script>

<template>
  <div :class="componentClass">
    <slot></slot>
  </div>
</template>
