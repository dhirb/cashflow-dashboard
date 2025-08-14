<script setup>
import BaseButton from '@/components/BaseButton.vue'
import CardBox from '@/components/CardBox.vue'
import { SCHEDULE_FREQUENCY } from '@/const/schedule'
import { dateToHuman, financialNumber, formatScheduleMonthDay, formatScheduleWeekday } from '@/services/utils/formatter'
import { pluralize } from '@/services/utils/string'
import { mdiPencil, mdiTrashCan } from '@mdi/js'
import FormToggleCheckbox from '@/components/form/FormToggleCheckbox.vue'

const emit = defineEmits(['edit', 'update', 'delete'])
const props = defineProps({
  entry: { type: Object, required: true }
})

const editEntry = (event) => {
  emit('edit', event)
}

const deleteEntry = (event) => {
  emit('delete', event)
}

const formatRule = () => {
  switch (props.entry.frequency) {
    case SCHEDULE_FREQUENCY.DAILY:
      return 'Every day'
    case SCHEDULE_FREQUENCY.WEEKLY:
      return `Every ${pluralize(props.entry.interval, 'week', true)} on ${formatScheduleWeekday(props.entry.byDayOfWeek)}`
    case SCHEDULE_FREQUENCY.MONTHLY:
      return `Every ${pluralize(props.entry.interval, 'month', true)} on the ${formatScheduleMonthDay(props.entry.byDayOfMonth)}`
    case SCHEDULE_FREQUENCY.YEARLY:
      return `Every ${pluralize(props.entry.interval, 'year', true)} on ${dateToHuman(`2024-${props.entry.byMonthOfYear}-${props.entry.byDayOfMonth}`, false, true)}`
  }
}

const onActiveToggle = (event) => {
  emit('update', event)
}
</script>

<template>
  <CardBox
    has-component-layout
    class="w-full h-full p-2"
    rounded="rounded-sm"
    thin-border
    :border-color="props.entry.isExpense ? 'warning' : 'success'"
  >
    <div class="flex flex-col">
      <div class="flex justify-between">
        <p class="self-center">{{ props.entry.name }}</p>
        <div class="flex">
          <FormToggleCheckbox
            :checked="props.entry.isActive"
            class="self-center"
            @toggle="onActiveToggle"
            label=""
          />
          <BaseButton
            :icon="mdiPencil"
            outline
            :icon-size="20"
            no-border
            color="contrast"
            @click.prevent="editEntry"
          />
          <BaseButton
            :icon="mdiTrashCan"
            outline
            :icon-size="20"
            no-border
            color="danger"
            @click.prevent="deleteEntry"
          />
        </div>
      </div>
      <p class="text-sm italic">{{ props.entry.description }}</p>
      <div class="flex justify-between mt-2">
        <p>{{ financialNumber(props.entry.amount, props.entry.isExpense) }}</p>
        <p>
          <span>{{ dateToHuman(props.entry.start) }}</span>
          <span v-if="!props.entry.noEndDate"
            >&nbsp;&mdash;&nbsp;{{ dateToHuman(props.entry.end) }}</span
          ><span v-else-if="!props.entry.isOneOff">&nbsp;&mdash;&nbsp;No end date</span>
        </p>
      </div>
      <p v-if="!props.entry.isOneOff" class="text-sm italic">{{ formatRule() }}</p>
    </div>
  </CardBox>
</template>
