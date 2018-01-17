import { IAggregateInterface, IExecute, IGroupInterface } from '../@types/types'

export interface IDataWorkerBase {
  result: any[]
  misc?: any
}

export interface IDataWorker {
  group: IGroupInterface
  aggregate: IAggregateInterface
  execute: IExecute
}

export interface IFunctionWithArgs {
  func: any
  args: any[]
}
