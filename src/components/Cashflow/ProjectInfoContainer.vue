<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import ProjectInfoModal from '@/components/Cashflow/ProjectInfoModal.vue'
import { dateToHuman, formatCurrency } from '@/services/utils/formatter'
import { useCashflowStore } from '@/stores/cashflow'
import { mdiPencil } from '@mdi/js'
import { ref } from 'vue'

const cashflowStore = useCashflowStore()

const showEditModal = ref(false)

const editProject = () => {
  showEditModal.value = true
}
</script>

<template>
  <ProjectInfoModal v-if="showEditModal" @close="() => (showEditModal = false)" />
  <div class="flex flex-col w-full mb-8">
    <div class="flex justify-between w-full">
      <p class="font-bold">{{ cashflowStore.currentProject.name }}</p>
      <BaseButton :icon="mdiPencil" @click.prevent="editProject" />
    </div>
    <div class="flex flex-col gap-2">
      <p class="text-sm italic">{{ cashflowStore.currentProject.description }}</p>
      <div class="flex flex-col md:flex-row justify-between w-full">
        <p>
          <span>{{ dateToHuman(cashflowStore.currentProject.start) }}</span
          >&nbsp;&mdash;&nbsp;
          <span>{{ dateToHuman(cashflowStore.currentProject.end) }}</span>
        </p>
        <p>Starting amount: {{ formatCurrency(cashflowStore.currentProject.startingAmount) }}</p>
      </div>
    </div>
  </div>
</template>
