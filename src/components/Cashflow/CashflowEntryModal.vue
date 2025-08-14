<script setup>
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import FormToggleCheckbox from '@/components/form/FormToggleCheckbox.vue'
import FormCheckRadio from '@/components/FormCheckRadio.vue'
import FormControl from '@/components/FormControl.vue'
import FormField from '@/components/FormField.vue'
import FullscreenModal from '@/components/utils/FullscreenModal.vue'
import { DEFAULT_CASHFLOW_ENTRY } from '@/const/project'
import { SCHEDULE_FREQUENCY, SCHEDULE_MONTH, SCHEDULE_WEEKDAY } from '@/const/schedule'
import { sanitizeRule } from '@/services/date/rule'
import { useDb } from '@/services/firebase/project'
import { capitalize } from '@/services/utils/string'
import { useCashflowStore } from '@/stores/cashflow'
import { computed, onMounted, onUnmounted, reactive } from 'vue'

const emit = defineEmits(['close'])

const props = defineProps({
  entry: { type: Object, default: DEFAULT_CASHFLOW_ENTRY },
  asNew: { type: Boolean, default: true }
})

const cashflowStore = useCashflowStore()
const { addCashflowEntry, updateCashflowEntry } = useDb()

const form = reactive({
  id: props.entry.id,
  name: props.entry.name,
  description: props.entry.description,
  isExpense: props.entry.isExpense,
  amount: props.entry.amount,
  isActive: props.entry.isActive ?? true,
  isOneOff: props.entry.isOneOff,
  noEndDate: props.entry.noEndDate ?? true,
  start: props.entry.start ?? new Date(),
  end: props.entry.end ?? new Date(),
  frequency: props.entry.frequency ?? SCHEDULE_FREQUENCY.MONTHLY,
  interval: props.entry.interval ?? 1,
  byDayOfWeek: props.entry.byDayOfWeek ?? SCHEDULE_WEEKDAY.SUNDAY,
  byDayOfMonth: props.entry.byDayOfMonth ?? 1,
  byMonthOfYear: props.entry.byMonthOfYear ?? 1
})
// Used when updating Firestore array
const initialForm = reactive({
  id: props.entry.id,
  name: props.entry.name,
  description: props.entry.description,
  isExpense: props.entry.isExpense,
  amount: props.entry.amount,
  isActive: props.entry.isActive ?? true,
  isOneOff: props.entry.isOneOff,
  noEndDate: props.entry.noEndDate ?? true,
  start: props.entry.start ?? new Date(),
  end: props.entry.end ?? new Date(),
  frequency: props.entry.frequency ?? SCHEDULE_FREQUENCY.MONTHLY,
  interval: props.entry.interval ?? 1,
  byDayOfWeek: props.entry.byDayOfWeek ?? SCHEDULE_WEEKDAY.SUNDAY,
  byDayOfMonth: props.entry.byDayOfMonth ?? 1,
  byMonthOfYear: props.entry.byMonthOfYear ?? 1
})

const frequencyOptions = computed(() =>
  Object.keys(SCHEDULE_FREQUENCY).map((freq) => {
    return { id: freq, label: freq.toLowerCase() }
  })
)
const weekdayOptions = computed(() =>
  Object.keys(SCHEDULE_WEEKDAY).map((day) => {
    return { id: SCHEDULE_WEEKDAY[day], label: capitalize(day) }
  })
)
const monthDayOptions = computed(() =>
  Array.from(Array(31).keys()).map((day) => {
    return { id: day + 1, label: day + 1 }
  })
)
const monthOptions = computed(() =>
  Object.keys(SCHEDULE_MONTH).map((month) => {
    return { id: SCHEDULE_MONTH[month], label: capitalize(month) }
  })
)

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
  const data = { ...sanitizeRule(form) }
  const initialData = { ...sanitizeRule(initialForm) }

  if (props.asNew) {
    await addCashflowEntry(cashflowStore.currentProject?.id, data)
  } else {
    await updateCashflowEntry(cashflowStore.currentProject?.id, data, initialData)
  }
  onClose(event)
}
</script>

<template>
  <FullscreenModal title="Cashflow entry" :on-close="onClose">
    <FormField label="Name">
      <FormControl v-model="form.name" type="text" />
    </FormField>
    <FormField label="Description">
      <FormControl v-model="form.description" type="text" />
    </FormField>

    <div class="flex flex-col md:flex-row gap-4">
      <FormField label="Amount" class="w-full">
        <FormControl v-model="form.amount" type="number" :min="0"
      /></FormField>
      <FormField label="Options" class="w-full">
        <FormToggleCheckbox
          label="Is expense?"
          :checked="form.isExpense"
          class="self-center"
          @toggle="() => (form.isExpense = !form.isExpense)"
        />
        <FormToggleCheckbox
          label="Is one off?"
          :checked="form.isOneOff"
          class="self-center"
          @toggle="() => (form.isOneOff = !form.isOneOff)"
        />
        <FormToggleCheckbox
          label="Active?"
          :checked="form.isActive"
          class="self-center"
          @toggle="() => (form.isActive = !form.isActive)"
        />
      </FormField>
    </div>
    <div class="flex flex-col md:flex-row gap-4">
      <FormField label="Start Date" :class="form.isOneOff ? 'w-1/3' : 'w-full'">
        <FormControl v-model="form.start" type="date" />
      </FormField>
      <FormField v-if="!form.isOneOff" label="End Date" class="w-full">
        <FormControl v-if="!form.noEndDate" v-model="form.end" type="date" />
        <p v-else>No end date</p>
      </FormField>
      <FormField v-if="!form.isOneOff" label="" class="w-full">
        <FormCheckRadio
          v-model="form.noEndDate"
          :input-value="form.noEndDate"
          name="No end date"
          label="No end date"
        />
      </FormField>
    </div>
    <div v-if="!form.isOneOff" class="flex flex-col md:flex-row">
      <div class="flex">
        <span class="self-center mr-2">Recur every</span
        ><FormControl v-model="form.interval" type="number" :min="1" />
        <FormControl v-model="form.frequency" :options="frequencyOptions" class="w-32" />
      </div>
      <div class="flex">
        <span v-if="form.frequency !== SCHEDULE_FREQUENCY.DAILY" class="self-center mx-2">on</span
        ><FormControl
          v-if="form.frequency === SCHEDULE_FREQUENCY.WEEKLY"
          v-model="form.byDayOfWeek"
          :options="weekdayOptions"
          class="w-36"
        />
        <FormControl
          v-if="[SCHEDULE_FREQUENCY.MONTHLY, SCHEDULE_FREQUENCY.YEARLY].includes(form.frequency)"
          v-model="form.byDayOfMonth"
          :options="monthDayOptions"
          class="w-20"
        />
        <FormControl
          v-if="form.frequency === SCHEDULE_FREQUENCY.YEARLY"
          v-model="form.byMonthOfYear"
          :options="monthOptions"
          class="w-20"
        />
      </div>
    </div>

    <BaseButtons class="mt-4">
      <BaseButton type="submit" color="info" label="Submit" @click.prevent="onSave" />
      <BaseButton color="contrast" outline label="Cancel" @click.prevent="onClose" />
    </BaseButtons>
  </FullscreenModal>
</template>
