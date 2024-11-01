<script setup>
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import CardBox from '@/components/CardBox.vue'
import CardBoxComponentTitle from '@/components/CardBoxComponentTitle.vue'
import OverlayLayer from '@/components/OverlayLayer.vue'
import { mdiClose } from '@mdi/js'
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  doneButtonColor: {
    type: String,
    default: 'info'
  },
  doneButtonLabel: {
    type: String,
    default: 'Done'
  },
  doneButtonDisabled: Boolean,
  cancelButtonColor: {
    type: String,
    default: 'contrast'
  },
  cancelButtonLabel: {
    type: String,
    default: 'Cancel'
  },
  interactive: {
    type: Boolean,
    default: true
  },
  closeOnConfirm: {
    type: Boolean,
    default: true
  },
  hasDone: {
    type: Boolean,
    default: true
  },
  hasCancel: Boolean,
  zIndex: {
    type: String,
    default: 'z-50'
  },
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const confirmCancel = (mode) => {
  value.value = false
  emit(mode)
}

const confirm = () => {
  if (props.interactive) {
    if (props.closeOnConfirm) {
      confirmCancel('confirm')
    } else {
      emit('confirm')
    }
  }
}

const cancel = () => {
  if (props.interactive) {
    confirmCancel('cancel')
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && value.value) {
    cancel()
  }
})
</script>

<template>
  <OverlayLayer v-show="value" @overlay-click="cancel" :z-index="props.zIndex">
    <CardBox v-show="value" class="shadow-lg w-11/12 md:w-3/5 lg:w-2/5 xl:w-4/12 z-50" is-modal>
      <CardBoxComponentTitle :title="title">
        <BaseButton
          v-if="interactive && hasCancel"
          :icon="mdiClose"
          color="whiteDark"
          small
          rounded="rounded-full"
          @click.prevent="cancel"
        />
      </CardBoxComponentTitle>

      <div class="space-y-3 mt-4">
        <slot></slot>
      </div>

      <template v-if="interactive" #footer>
        <BaseButtons>
          <BaseButton
            v-if="hasDone"
            :label="doneButtonLabel"
            :color="doneButtonColor"
            type="submit"
            :disabled="doneButtonDisabled"
            @click.prevent="confirm"
          />
          <BaseButton
            v-if="hasCancel"
            :label="cancelButtonLabel"
            :color="cancelButtonColor"
            outline
            @click.prevent="cancel"
          />
        </BaseButtons>
      </template>
    </CardBox>
  </OverlayLayer>
</template>
