<script setup>
import { getButtonColor } from '@/colors.js'
import BaseIcon from '@/components/BaseIcon.vue'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  label: {
    type: [String, Number],
    default: null
  },
  icon: {
    type: String,
    default: null
  },
  iconSize: {
    type: [String, Number],
    default: null
  },
  href: {
    type: String,
    default: null
  },
  target: {
    type: String,
    default: null
  },
  to: {
    type: [String, Object],
    default: null
  },
  type: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: 'white'
  },
  as: {
    type: String,
    default: null
  },
  tabindex: { type: Number, default: null },
  iconAlign: String,
  tooltip: String,
  small: Boolean,
  outline: Boolean,
  active: Boolean,
  disabled: Boolean,
  roundedFull: Boolean,
  noBorder: Boolean
})

const is = computed(() => {
  if (props.as) {
    return props.as
  }

  if (props.to) {
    return RouterLink
  }

  if (props.href) {
    return 'a'
  }

  return 'button'
})

const computedType = computed(() => {
  if (is.value === 'button') {
    return props.type ?? 'button'
  }

  return null
})

const labelClass = computed(() => (props.small && props.icon ? 'px-1' : 'px-2'))

const componentClass = computed(() => {
  const base = [
    'inline-flex',
    'justify-center',
    'items-center',
    'whitespace-nowrap',
    'focus:outline-none',
    'transition-colors',
    'focus:ring',
    'duration-150',
    props.noBorder ? 'border-none' : 'border',
    props.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    props.roundedFull ? 'rounded-full' : 'rounded',
    getButtonColor(props.color, props.outline, !props.disabled, props.active)
  ]

  if (!props.label && props.icon) {
    base.push('p-1')
  } else if (props.small) {
    base.push('text-sm', props.roundedFull ? 'px-3 py-1' : 'p-1')
  } else {
    base.push('py-2', props.roundedFull ? 'px-6' : 'px-3')
  }

  if (props.disabled) {
    base.push(props.outline ? 'opacity-50' : 'opacity-70')
  }

  if (props.tooltip) {
    base.push('tooltip')
  }

  return base
})

const customStyle = computed(() => {
  const base = {}

  if (props.color.startsWith('#')) {
    base.color = props.color
  }
  return base
})
</script>

<template>
  <component
    :is="is"
    :class="componentClass"
    :style="customStyle"
    :href="href"
    :type="computedType"
    :to="to"
    :target="target"
    :disabled="disabled"
    :tabindex="tabindex"
  >
    <BaseIcon v-if="icon" :path="icon" :size="iconSize" :align="iconAlign" />
    <span v-if="label" :class="labelClass">{{ label }}</span>
    <span v-if="props.tooltip" class="tooltip-text">{{ props.tooltip }}</span>
  </component>
</template>

<style scoped>
/* Tooltip container */
.tooltip {
  position: relative;
  display: flex;
  z-index: 999;
}

/* Tooltip text */
.tooltip .tooltip-text {
  visibility: hidden;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  width: 180px;
  top: 110%;
  left: 50%;
  margin-left: -90px; /* Use half of the width to center the tooltip */
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltip-text {
  visibility: visible;
}
</style>
