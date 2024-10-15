<script setup>
import CashflowEntryContainer from '@/components/Cashflow/CashflowEntryContainer.vue'
import ProjectInfoContainer from '@/components/Cashflow/ProjectInfoContainer.vue'
import CashflowChart from '@/components/Charts/CashflowChart.vue'
import CashflowTable from '@/components/Charts/CashflowTable.vue'
import ErrorCard from '@/components/ErrorCard.vue'
import FormCheckRadio from '@/components/FormCheckRadio.vue'
import SectionMain from '@/components/SectionMain.vue'
import LoadingBackdrop from '@/components/utils/LoadingBackdrop.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { useDb } from '@/services/firebase/project'
import { useCashflowStore } from '@/stores/cashflow'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const cashflowStore = useCashflowStore()
const route = useRoute()

const { getProject } = useDb()

const isChartView = ref(true) // false to show table
let unsub

onMounted(async () => {
  unsub = await getProject(route.params.id)
})

onUnmounted(() => {
  if (unsub) {
    unsub()
  }
})
</script>

<template>
  <LayoutAuthenticated>
    <LoadingBackdrop v-model="cashflowStore.isLoading" />

    <SectionMain v-if="cashflowStore.currentProject">
      <ErrorCard v-if="cashflowStore.error">{{ cashflowStore.error }}</ErrorCard>
      <div class="flex flex-col md:flex-row gap-4 w-full md:max-h-screen">
        <div class="flex flex-col w-full">
          <ProjectInfoContainer />
          <div class="flex flex-col max-h-max">
            <FormCheckRadio
              v-model="isChartView"
              :input-value="isChartView"
              name="chartToggle"
              type="switch"
              :label="isChartView ? 'View table' : 'View chart'"
              class="self-end mb-4"
            />
            <CashflowChart
              v-if="isChartView"
              class="min-h-fit max-h-96 w-full md:max-w-xl lg:max-w-4xl xl:max-w-6xl"
            />
            <CashflowTable v-else />
          </div>
        </div>
        <CashflowEntryContainer />
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
