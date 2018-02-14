import {
  IAggregatorArrayModeInput,
  IAggregatorMapModeInput
} from './@interfaces/aggregator-interface'
import {
  IDataWorker,
  IDataWorkerBase,
  IFunctionWithArgs
} from './@interfaces/data-worker-interface'
import { IGroupOnlyMode, IGroupSortingMode } from './@interfaces/group-interface'
import { IAggregateInterface, IExecute, IGroupInterface } from './@types/types'
import _aggregate from './main/aggregate'
import _group from './main/group'

let groupBy: IGroupInterface
let aggregateBy: IAggregateInterface
let complete: IExecute
let functionArray: IFunctionWithArgs[] = []

groupBy = (options: IGroupOnlyMode | IGroupSortingMode): IDataWorker => {
  functionArray.push({ func: _group, args: [options] })
  return dw
}

aggregateBy = (
  aggregatorOptions: IAggregatorArrayModeInput | IAggregatorMapModeInput
): IDataWorker => {
  functionArray.push({ func: _aggregate, args: [aggregatorOptions] })
  return dw
}

complete = (inputData: any[]) => {
  let baseData: IDataWorkerBase = { result: inputData, misc: {} }
  try {
    functionArray.forEach(oneFunc => {
      baseData = oneFunc.func(baseData, ...oneFunc.args)
    })
  } catch (error) {
    throw error
  } finally {
    functionArray = []
  }
  return baseData.result
}
const dw: IDataWorker = { group: groupBy, aggregate: aggregateBy, execute: complete }

export default dw
