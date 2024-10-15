<script setup>
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import FormControl from '@/components/FormControl.vue'
import FormField from '@/components/FormField.vue'
import FullscreenModal from '@/components/utils/FullscreenModal.vue'
import { useDb } from '@/services/firebase/project'
import { useCashflowStore } from '@/stores/cashflow'
import { onMounted, onUnmounted, reactive } from 'vue'

const emit = defineEmits(['close'])

const cashflowStore = useCashflowStore()

const { updateProject } = useDb()

const form = reactive({
  name: cashflowStore.currentProject.name,
  description: cashflowStore.currentProject.description,
  startingAmount: cashflowStore.currentProject.startingAmount,
  start: cashflowStore.currentProject.start ?? new Date(),
  end: cashflowStore.currentProject.end ?? new Date()
})

onMounted(async () => {
  window.addEventListener('keydown', closeModalOnEsc)
})

onUnmounted(() => {
  window.removeEventListener('keydown', closeModalOnEsc)
})

const closeModalOnEsc = (ev) => {
  if (ev.key === 'Escape') {
    onClose(ev)
  }
}

const onClose = (event) => {
  emit('close', event)
}

const onSave = async (event) => {
  await updateProject(cashflowStore.currentProject.id, form)
  onClose(event)
}
</script>

<template>
  <FullscreenModal title="Cashflow project" :on-close="onClose">
    <FormField label="Name">
      <FormControl v-model="form.name" type="text" />
    </FormField>
    <FormField label="Description">
      <FormControl v-model="form.description" type="text" />
    </FormField>

    <div class="flex flex-col md:flex-row gap-4">
      <FormField label="Starting Amount" class="w-full">
        <FormControl v-model="form.startingAmount" type="number" :min="0"
      /></FormField>
    </div>
    <div class="flex flex-col md:flex-row gap-4">
      <FormField label="Start Date" class="w-full">
        <FormControl v-model="form.start" type="date" />
      </FormField>
      <FormField label="End Date" class="w-full">
        <FormControl v-model="form.end" type="date" />
      </FormField>
    </div>

    <BaseButtons class="mt-4">
      <BaseButton type="submit" color="info" label="Submit" @click.prevent="onSave" />
      <BaseButton color="contrast" outline label="Cancel" @click.prevent="onClose" />
    </BaseButtons>
  </FullscreenModal>
</template>
