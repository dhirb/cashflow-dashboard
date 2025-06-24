<script setup>
import { buildCashflowChartData } from '@/services/chart/cashflow'
import { useCashflowStore } from '@/stores/cashflow'
import {
  CategoryScale,
  Chart,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
} from 'chart.js'
import { computed } from 'vue'
import ChartJsPluginZoom from 'chartjs-plugin-zoom'
import { Line } from 'vue-chartjs'
import { dateToHuman, financialNumber } from '@/services/utils/formatter'
import { numericColors } from '@/colors'

const cashflowStore = useCashflowStore()

const chartData = computed(() => {
  return buildCashflowChartData(cashflowStore.currentProject)
})

const getOrCreateTooltip = (chart) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('div')

  if (!tooltipEl) {
    tooltipEl = document.createElement('div')
    tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)'
    tooltipEl.style.borderRadius = '3px'
    tooltipEl.style.color = 'white'
    tooltipEl.style.opacity = 1
    tooltipEl.style.pointerEvents = 'none'
    tooltipEl.style.position = 'absolute'
    tooltipEl.style.transform = 'translate(-50%, 0)'
    tooltipEl.style.transition = 'all .1s ease'

    const table = document.createElement('table')
    table.style.margin = '0px'

    tooltipEl.appendChild(table)
    chart.canvas.parentNode.appendChild(tooltipEl)
  }

  return tooltipEl
}

const createTooltipTitleLine = (title, color) => {
  const tr = document.createElement('tr')
  tr.style.borderWidth = 0

  const th = document.createElement('th')
  th.style.borderWidth = 0
  th.style.color = color
  const text = document.createTextNode(title)

  th.appendChild(text)
  tr.appendChild(th)

  return tr
}

const createTooltipBodyEntry = (entry) => {
  const td = document.createElement('td')
  td.style.border = 0
  const entryNode = document.createTextNode(entry)
  td.appendChild(entryNode)
  return td
}

const externalTooltipHandler = (context) => {
  // Tooltip Element
  const { chart, tooltip } = context
  const tooltipEl = getOrCreateTooltip(chart)

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0
    return
  }

  // Set Text
  if (tooltip.body) {
    const currentAmount = tooltip.body[0].lines[0]
    // Remove thousand separator before converting to number
    const isAmountNegative = Number(currentAmount.replace(/,/g, '')) < 0

    const tableHead = document.createElement('thead')
    tableHead.appendChild(createTooltipTitleLine(dateToHuman(tooltip.title[0], true)))
    tableHead.appendChild(
      createTooltipTitleLine(
        financialNumber(currentAmount, isAmountNegative),
        isAmountNegative ? numericColors.NEGATIVE : numericColors.POSITIVE
      )
    )

    const tableBody = document.createElement('tbody')
    const entries = chartData.value.entriesData[tooltip.title[0]]

    entries?.forEach((entry) => {
      const tr = document.createElement('tr')
      tr.style.backgroundColor = 'inherit'

      tr.appendChild(createTooltipBodyEntry(entry.name))
      tr.appendChild(createTooltipBodyEntry(financialNumber(entry.amount, entry.isExpense)))
      tableBody.appendChild(tr)
    })

    const tableRoot = tooltipEl.querySelector('table')

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove()
    }

    // Add new children
    tableRoot.appendChild(tableHead)
    tableRoot.appendChild(tableBody)
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1
  tooltipEl.style.left = `${positionX + tooltip.caretX + 50}px`
  tooltipEl.style.top = `${positionY + tooltip.caretY}px`
  tooltipEl.style.font = tooltip.options.bodyFont.string
  tooltipEl.style.padding = `${tooltip.options.padding}px ${tooltip.options.padding}px`
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: ({ tick }) => (tick.value === 0 ? numericColors.NEGATIVE : '')
      }
    },
    x: {
      display: true,
      grid: {
        lineWidth: 0
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: false,
      position: 'nearest',
      external: externalTooltipHandler
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: true
        },
        pinch: {
          enabled: true
        },
        mode: 'xy'
      },
      pan: {
        enabled: true
      }
    }
  }
}

const layoutPlugin = {
  afterLayout: (chart) => {
    let ctx = chart.ctx
    ctx.save()
    let yAxis = chart.scales.y
    let yThreshold = yAxis.getPixelForValue(0)
    let gradient = ctx.createLinearGradient(0, yAxis.top, 0, yAxis.bottom)
    gradient.addColorStop(0, numericColors.POSITIVE)

    let offset = (yThreshold - yAxis.top) / (yAxis.bottom - yAxis.top)
    if (offset > 1) return

    gradient.addColorStop(offset, numericColors.POSITIVE)
    gradient.addColorStop(offset, numericColors.NEGATIVE)
    gradient.addColorStop(1, numericColors.NEGATIVE)
    chart.data.datasets[0].borderColor = gradient
    ctx.restore()
  }
}

Chart.register(LineElement, PointElement, LineController, LinearScale, CategoryScale, Tooltip)
</script>

<template>
  <Line
    id="cashflow-chart"
    :data="chartData"
    :options="chartOptions"
    :plugins="[ChartJsPluginZoom, layoutPlugin]"
  />
</template>
