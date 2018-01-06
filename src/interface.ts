import { AggregatorMode, GroupingMode, Operation, SortingMode } from './enum'

export interface IAttrSortingMode {
  attribute: string
  sortMode: SortingMode
}
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

export interface IGroupBase {
  flat: boolean
  mode: GroupingMode.GROUP_SORT | GroupingMode.ONLY_GROUP
}

export interface IGroupOnlyMode extends IGroupBase {
  groupOn: string[]
}

export interface IGroupSortingMode extends IGroupBase {
  groupingOptions: IAttrSortingMode[]
}
