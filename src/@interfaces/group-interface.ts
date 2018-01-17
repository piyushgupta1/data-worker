import { GroupingMode } from '../@enums/enum'
import { IAttrSortingMode } from './sorting-interface'

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
