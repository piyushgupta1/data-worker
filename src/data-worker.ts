import {
  IAggregatorArrayModeInput,
  IAggregatorMapModeInput
} from './@interfaces/aggregator-interface'
import { IDataWorker, IDataWorkerBase } from './@interfaces/data-worker-interface'
import { IGroupOnlyMode, IGroupSortingMode } from './@interfaces/group-interface'
import { IAggregateInterface, IExecute, IGroupInterface } from './@types/types'
import _aggregate from './main/aggregate'
import _group from './main/group'

let groupBy: IGroupInterface
let aggregateBy: IAggregateInterface
let complete: IExecute
const functionArray: Map<any, any> = new Map()

groupBy = (options: IGroupOnlyMode | IGroupSortingMode): IDataWorker => {
  functionArray.set(_group, [options])
  return dw
}

aggregateBy = (
  aggregatorOptions: IAggregatorArrayModeInput | IAggregatorMapModeInput
): IDataWorker => {
  functionArray.set(_aggregate, [aggregatorOptions])
  return dw
}

complete = (inputData: any[]) => {
  let baseData: IDataWorkerBase = { result: inputData, misc: {} }
  functionArray.forEach((param, func) => {
    baseData = func(baseData, ...param)
  })
  return baseData.result
}
const dw: IDataWorker = { group: groupBy, aggregate: aggregateBy, execute: complete }

export { dw }
