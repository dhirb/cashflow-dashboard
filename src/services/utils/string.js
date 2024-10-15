import { formatCurrency } from './formatter'

export const isEmptyString = (str) => {
  return !str || str.toString().trim().length === 0
}

export const pluralize = (
  count,
  unit,
  hideCountIfSingular = false,
  asCurrency = false,
  currencyDecimal = 2,
  fixedUnit = false
) => {
  if (hideCountIfSingular && count === 1) return unit

  const countDisplay = asCurrency ? formatCurrency(count, currencyDecimal) : count.toString()

  if (!unit) return countDisplay
  if (fixedUnit) return `${countDisplay} ${unit}`
  return `${countDisplay} ${unit}${count > 1 ? 's' : ''}`
}

export const toTitleCase = (str) => {
  return str.replace(/^[a-z]|[A-Z]/g, (c, i) => (i ? ' ' : '') + c.toUpperCase())
}

export const capitalize = (str) => {
  if (isEmptyString(str)) return ''

  return `${str[0].toUpperCase()}${str.substring(1, str.length).toLowerCase()}`
}
