import { numericColors } from '@/colors'
import { generateEntryOccurrences } from '../date/rule'
import { dateToYmd } from '../utils/formatter'

export const buildCashflowEntriesData = (project) => {
  const entries = [...project.entries]
  const data = {}

  for (const entry of entries) {
    if (entry.isActive === false) continue
    if (entry.isOneOff && new Date(entry.start) < new Date(project.start)) continue

    const dates = generateEntryOccurrences(entry, project.start, project.end)

    for (const date of dates) {
      if (!data[dateToYmd(date)]) {
        data[dateToYmd(date)] = []
      }

      data[dateToYmd(date)].push(entry)
    }
  }

  return data
}

export const buildCashflowChartData = (project) => {
  const entriesData = buildCashflowEntriesData(project)
  const sortedDates = Object.keys(entriesData).sort()
  const data = [project.startingAmount ?? 0]
  const labels = [dateToYmd(project.start)]
  let currentAmount = project.startingAmount ?? 0

  for (const date of sortedDates) {
    currentAmount = entriesData[date].reduce((acc, entry) => {
      const amount = entry.isExpense ? entry.amount * -1 : entry.amount
      return acc + amount
    }, currentAmount)
    labels.push(date)
    data.push(currentAmount)
  }
  labels.push(dateToYmd(project.end))

  const colors = data.map((value) => (value < 0 ? numericColors.NEGATIVE : numericColors.POSITIVE))

  return {
    entriesData,
    labels,
    datasets: [
      {
        data,
        fill: false,
        tension: 0.1,
        borderJoinStyle: 'round',
        pointBorderColor: colors,
        pointHoverRadius: 8,
        segment: {
          borderColor: (ctx) => {
            if (ctx.p0.parsed.y < 0 && ctx.p1.parsed.y < 0) {
              return numericColors.NEGATIVE
            }
            return numericColors.POSITIVE
          }
        }
      }
    ]
  }
}

export const buildCashflowTableData = (project) => {
  const entriesData = buildCashflowEntriesData(project)
  const sortedDates = Object.keys(entriesData).sort()
  const data = [
    {
      date: dateToYmd(project.start),
      amount: project.startingAmount ?? 0,
      entry: { name: 'Initial', description: '', amount: null, isExpense: false }
    }
  ]
  let currentAmount = project.startingAmount ?? 0

  for (const date of sortedDates) {
    for (const entry of entriesData[date]) {
      const amount = entry.isExpense ? entry.amount * -1 : entry.amount
      currentAmount += amount

      data.push({
        date: dateToYmd(date),
        amount: currentAmount,
        entry
      })
    }
  }

  return data
}
