import { isNumber } from 'util'

export function nanMean(
  accumulator: any,
  currentValue: any,
  currentIndex: number,
  inputArray: any[]
): number {
  if (!isNumber(currentValue)) {
    currentValue = Number(currentValue)
  }

  if (!isNumber(accumulator)) {
    accumulator = Number(accumulator)
  }

  if (!isNaN(accumulator) && !isNaN(currentValue)) {
    const re = accumulator + currentValue
    return re / 2
  }
  if (isNaN(accumulator) && isNaN(currentValue)) {
    return 0
  }
  return isNaN(accumulator) ? currentValue : accumulator
}

export function mean(
  accumulator: any,
  currentValue: any,
  currentIndex: number,
  inputArray: any[]
): number {
  if (!isNumber(currentValue)) {
    currentValue = Number(currentValue)
  }
  if (!isNumber(accumulator)) {
    accumulator = Number(accumulator)
  }
  const re = (isNaN(accumulator) ? 0 : accumulator) + (isNaN(currentValue) ? 0 : currentValue)
  return currentIndex === inputArray.length - 1 ? re / inputArray.length : re
}

export function sum(
  accumulator: any,
  currentValue: any,
  currentIndex: number,
  inputArray: any[]
): number {
  if (!isNumber(currentValue)) {
    currentValue = Number(currentValue)
  }
  if (!isNumber(accumulator)) {
    accumulator = Number(accumulator)
  }
  const re = (isNaN(accumulator) ? 0 : accumulator) + (isNaN(currentValue) ? 0 : currentValue)
  return re
}
