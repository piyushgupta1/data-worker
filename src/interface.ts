import { AggregatorMode } from './enum'

export interface IAggregatorModeInput {
  mode: AggregatorMode
}
export interface IAggregatorArrayModeInput extends IAggregatorModeInput {
  attrs: string[]
  aggr: string[]
}

export interface IAggregatorMapModeInput extends IAggregatorModeInput {
  attrToAggrMap: Map<string, string[]>
}
