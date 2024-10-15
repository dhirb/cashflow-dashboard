import { SCHEDULE_FREQUENCY, SCHEDULE_WEEKDAY } from '@/const/schedule'
import { Rule, Schedule } from './schedule'
import { dateToYmd } from '../utils/formatter'

export const parseRuleFromEntry = (entry) => {
  return new Rule({
    start: new Date(dateToYmd(entry.start)),
    end: entry.isOneOff || entry.noEndDate ? null : new Date(dateToYmd(entry.end)),
    frequency: entry.frequency,
    interval: entry.interval,
    weekStart: SCHEDULE_WEEKDAY.SUNDAY,
    byDayOfWeek: entry.byDayOfWeek ? [entry.byDayOfWeek] : undefined,
    byDayOfMonth: entry.byDayOfMonth ? [entry.byDayOfMonth] : undefined,
    byMonthOfYear: entry.byMonthOfYear ? [entry.byMonthOfYear] : undefined
  })
}

export const generateEntryOccurrences = (entry, start, end) => {
  if (entry.isOneOff) return [entry.start]

  const rule = parseRuleFromEntry(sanitizeRule(entry))

  const schedule = new Schedule({
    rrules: [rule]
  })

  const scheduleIterator = schedule.occurrences({
    start: new Date(dateToYmd(start)),
    end: new Date(dateToYmd(end))
  })
  const occurrences = []

  for (const { date } of scheduleIterator) {
    occurrences.push(date)
  }
  return occurrences
}

export const sanitizeRule = (rule) => {
  const result = { ...rule }

  if (SCHEDULE_FREQUENCY.DAILY === rule.frequency) {
    delete result.byDayOfMonth
    delete result.byDayOfWeek
    delete result.byMonthOfYear
  } else if (SCHEDULE_FREQUENCY.WEEKLY === rule.frequency) {
    delete result.byDayOfMonth
    delete result.byMonthOfYear
  } else if (SCHEDULE_FREQUENCY.MONTHLY === rule.frequency) {
    delete result.byDayOfWeek
    delete result.byMonthOfYear
  } else {
    delete result.byDayOfWeek
  }

  return result
}
