import { AggregatorMode, Operation } from '../@enums/enum'

export interface IAggregatorModeInput {
  mode: AggregatorMode
}
export interface IAggregatorArrayModeInput extends IAggregatorModeInput {
  attrs: string[]
  aggr: Operation[]
}

export interface IAggregatorMapModeInput extends IAggregatorModeInput {
  attrToAggrMap: Map<string, Operation[]>
}
