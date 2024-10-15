<script setup>
import { colorsText } from '@/colors'
import { buildCashflowTableData } from '@/services/chart/cashflow'
import { dateToHuman, financialNumber } from '@/services/utils/formatter'
import { useCashflowStore } from '@/stores/cashflow'
import { computed } from 'vue'

const cashflowStore = useCashflowStore()

const tableData = computed(() => {
  return buildCashflowTableData(cashflowStore.currentProject)
})
</script>

<template>
  <div class="flex cashflow-table overflow-y-auto">
    <table>
      <thead class="bg-gray-500 text-gray-100 sticky top-0 z-10">
        <tr>
          <th class="text-center">Date</th>
          <th class="text-center">Item</th>
          <th class="text-center">Amount</th>
          <th class="text-center">Cumulative Amount</th>
          <th class="text-center">Description</th>
        </tr>
      </thead>
      <tbody class="overflow-y-auto">
        <tr v-for="(data, index) of tableData" :key="`cashflow-row-${index}`">
          <td>{{ dateToHuman(data.date, true) }}</td>
          <td>{{ data.entry.name }}</td>
          <td :class="data.entry.isExpense ? colorsText.warning : colorsText.success">
            {{ data.entry.amount ? financialNumber(data.entry.amount, data.entry.isExpense) : '' }}
          </td>
          <td :class="data.amount < 0 ? colorsText.danger : ''">
            {{ financialNumber(data.amount, data.amount < 0) }}
          </td>
          <td>{{ data.entry.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.cashflow-table {
  height: 32rem;
}
</style>
