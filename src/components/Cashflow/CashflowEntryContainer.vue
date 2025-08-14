<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import CashflowEntryCard from '@/components/Cashflow/CashflowEntryCard.vue'
import CashflowEntryModal from '@/components/Cashflow/CashflowEntryModal.vue'
import { DEFAULT_CASHFLOW_ENTRY } from '@/const/project'
import { useDb } from '@/services/firebase/project'
import { useCashflowStore } from '@/stores/cashflow'
import { mdiPlus } from '@mdi/js'
import { computed, ref } from 'vue'

const cashflowStore = useCashflowStore()

const { deleteCashflowEntry, updateCashflowEntry } = useDb()

const showEntryModal = ref(false)
const currentEntry = ref(null)

const entries = computed(() => {
  const e = [...cashflowStore.currentProject.entries]
  // Sort by start date
  e.sort((a, b) => Date.parse(a.start) - Date.parse(b.start))
  // Sort entries by income first
  e.sort((a, b) => (a.isExpense === b.isExpense ? 0 : a.isExpense ? 1 : -1))

  return e
})

const addEntry = () => {
  currentEntry.value = DEFAULT_CASHFLOW_ENTRY
  showEntryModal.value = true
}

const editEntry = (entry) => {
  currentEntry.value = entry
  showEntryModal.value = true
}

const updateEntryActiveToggle = async (entry) => {
  const newEntry = { ...entry, isActive: !entry.isActive }
  await updateCashflowEntry(cashflowStore.currentProject?.id, newEntry, entry)
  currentEntry.value = newEntry
}

const deleteEntry = async (entry) => {
  await deleteCashflowEntry(cashflowStore.currentProject?.id, entry)
}
</script>

<template>
  <CashflowEntryModal
    v-if="showEntryModal"
    :entry="currentEntry"
    :as-new="JSON.stringify(currentEntry) === JSON.stringify(DEFAULT_CASHFLOW_ENTRY)"
    @close="() => (showEntryModal = false)"
  />
  <div class="flex flex-col w-full md:w-1/3 gap-4 container overflow-y-auto">
    <div class="flex justify-between w-full">
      <p>Entries</p>
      <BaseButton :icon="mdiPlus" @click.prevent="addEntry" />
    </div>
    <div class="flex flex-col w-full gap-2">
      <CashflowEntryCard
        v-for="(entry, index) in entries"
        :key="`entry-${index}`"
        :entry="entry"
        @edit="() => editEntry(entry)"
        @update="() => updateEntryActiveToggle(entry)"
        @delete="() => deleteEntry(entry)"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 48rem;
}
</style>
