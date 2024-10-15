import { SCHEDULE_WEEKDAY } from '@/const/schedule'

export const dateToYmd = (date) => {
  if (Object.hasOwn(date, 'seconds')) return timestampToYmd(date)

  const dt = new Date(date)
  return [
    dt.getFullYear(),
    ('0' + (dt.getMonth() + 1)).slice(-2),
    ('0' + dt.getDate()).slice(-2)
  ].join('-')
}

export const timestampToYmd = (ts) => {
  return dateToYmd(new Date(ts.seconds * 1000))
}

export const dateToHuman = (date, showWeekday = false, hideYear = false) => {
  return new Date(date).toLocaleString('en-NZ', {
    month: 'short',
    day: 'numeric',
    ...(!hideYear && { year: 'numeric' }),
    ...(showWeekday && { weekday: 'short' })
  })
}

export const formatScheduleWeekday = (day) => {
  switch (day) {
    case SCHEDULE_WEEKDAY.SUNDAY:
      return 'Sunday'
    case SCHEDULE_WEEKDAY.MONDAY:
      return 'Monday'
    case SCHEDULE_WEEKDAY.TUESDAY:
      return 'Tuesday'
    case SCHEDULE_WEEKDAY.WEDNESDAY:
      return 'Wednesday'
    case SCHEDULE_WEEKDAY.THURSDAY:
      return 'Thursday'
    case SCHEDULE_WEEKDAY.FRIDAY:
      return 'Friday'
    case SCHEDULE_WEEKDAY.SATURDAY:
      return 'Saturday'
  }
}

export const formatScheduleMonthDay = (day) => {
  if ([1, 21, 31].includes(day)) return `${day}st`
  if ([2, 22].includes(day)) return `${day}nd`
  if (day === 3) return '3rd'
  return `${day}th`
}

export const financialNumber = (val, isNegative) => {
  if (isNegative) {
    return `(${formatCurrency(val)})`
  }
  return formatCurrency(val)
}

export const formatCurrency = (val, decimal = 2) => {
  return val
    .toLocaleString('en-NZ', {
      style: 'currency',
      currency: 'NZD',
      minimumFractionDigits: decimal,
      maximumFractionDigits: decimal
    })
    .replace('$', '$ ')
}
