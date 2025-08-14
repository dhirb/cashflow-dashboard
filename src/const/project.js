import { SCHEDULE_FREQUENCY } from './schedule'

export const DEFAULT_CASHFLOW_PROJECT = {
  name: 'New cashflow',
  description: '',
  entries: [],
  isActive: true,
  start: new Date(),
  end: new Date(),
  startingAmount: 0
}

export const DEFAULT_CASHFLOW_ENTRY = {
  name: '',
  description: '',
  isExpense: true,
  amount: 0,
  isActive: true,
  isOneOff: false,
  noEndDate: true,
  start: new Date(),
  end: new Date(),
  frequency: SCHEDULE_FREQUENCY.MONTHLY,
  interval: 1 // e.g. every x days
}
