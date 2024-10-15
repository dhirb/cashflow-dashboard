<script setup>
import { colorsOutline, colorsText } from '@/colors'
import CardBoxComponentBody from '@/components/CardBoxComponentBody.vue'
import CardBoxComponentFooter from '@/components/CardBoxComponentFooter.vue'
import { computed, useSlots } from 'vue'

const props = defineProps({
  rounded: {
    type: String,
    default: 'rounded-2xl'
  },
  flex: {
    type: String,
    default: 'flex-col'
  },
  borderColor: { type: String, default: 'contrast' },
  hoverBorderColor: { type: String, default: 'info' },
  hasComponentLayout: Boolean,
  hasTable: Boolean,
  noBodyPadding: Boolean,
  thinBorder: Boolean,
  isForm: Boolean,
  isHoverable: Boolean,
  isModal: Boolean
})

const emit = defineEmits(['submit'])

const slots = useSlots()

const hasFooterSlot = computed(() => slots.footer && !!slots.footer())

const componentClass = computed(() => {
  const base = [
    props.rounded,
    props.flex,
    props.isModal ? 'dark:bg-slate-900' : 'dark:bg-slate-900/70'
  ]

  if (props.isHoverable) {
    base.push('hover:shadow-lg transition-shadow duration-500 hover:cursor-pointer')
  }
  if (colorsOutline[props.borderColor]) {
    base.push(`border ${colorsOutline[props.borderColor][1]}`)
    base.push(`border-${props.thinBorder ? '1' : '4'}`)

    if (props.isHoverable) {
      if (colorsText[props.hoverBorderColor]) {
        base.push(`hover:${colorsText[props.hoverBorderColor]}`)
      }
      if (colorsOutline[props.hoverBorderColor]) {
        base.push(`hover:${colorsOutline[props.hoverBorderColor][1]}`)
      }
    }
  }

  return base
})

const submit = (event) => {
  emit('submit', event)
}
</script>

<template>
  <component
    :is="isForm ? 'form' : 'div'"
    :class="componentClass"
    class="bg-white flex"
    @submit="submit"
  >
    <slot v-if="hasComponentLayout" />
    <template v-else>
      <CardBoxComponentBody :no-padding="hasTable || noBodyPadding">
        <slot></slot>
      </CardBoxComponentBody>
      <CardBoxComponentFooter v-if="hasFooterSlot">
        <slot name="footer" />
      </CardBoxComponentFooter>
    </template>
  </component>
</template>
