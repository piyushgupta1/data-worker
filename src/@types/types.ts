import {
  IAggregatorArrayModeInput,
  IAggregatorMapModeInput
} from '../@interfaces/aggregator-interface'
import { IDataWorker, IDataWorkerBase } from '../@interfaces/data-worker-interface'
import { IGroupOnlyMode, IGroupSortingMode } from '../@interfaces/group-interface'

export type IGroupInterface = (options: IGroupOnlyMode | IGroupSortingMode) => IDataWorker
export type IAggregateInterface = (
  aggregatorOptions: IAggregatorArrayModeInput | IAggregatorMapModeInput
) => IDataWorker
export type IExecute = (inputData: any[]) => any[]

export type IGroupInnerInterface = (
  _this: IDataWorkerBase,
  options: IGroupOnlyMode | IGroupSortingMode
) => IDataWorkerBase
export type IAggregateInnerInterface = (
  _this: IDataWorkerBase,
  aggregatorOptions: IAggregatorArrayModeInput | IAggregatorMapModeInput
) => IDataWorkerBase
