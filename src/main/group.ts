import { ascending, descending } from 'd3-array'
import { nest } from 'd3-collection'

import { GroupingMode, SortingMode } from '../@enums/enum'
import { IDataWorker, IDataWorkerBase } from '../@interfaces/data-worker-interface'
import { IGroupOnlyMode, IGroupSortingMode } from '../@interfaces/group-interface'
import { IAttrSortingMode } from '../@interfaces/sorting-interface'
import { IGroupInnerInterface } from '../@types/types'

let _group: IGroupInnerInterface

/**
 * Should group elements also apply sorting based on parameter given
 * Input Options described below
 * IGroupOnlyMode = {
 *  mode<GroupingMode> -> Grouping Mode used
 *  flat<boolean> -> Flatten the resultant structure
 *  groupOn<string[]> -> Group on these attributes while maintaining order
 * }
 *
 * IGroupSortingMode = {
 *  mode<GroupingMode> -> Grouping Mode used
 *  flat<boolean> -> Flatten the resultant structure
 *  groupingOptions<{ attribute: string,sortMode: SortingMode}[]> -> Array of Json with
 *    special sorting order on every grouping attribute
 * }
 * @param options All grouping options
 * @returns this
 */
_group = (_this: IDataWorkerBase, options: IGroupOnlyMode | IGroupSortingMode): IDataWorkerBase => {
  if (_this.result.length === 0) {
    throw new EvalError('Empty data to group not allowed')
  }
  if (options.mode === GroupingMode.ONLY_GROUP) {
    _this.result = _groupOnlyMode(_this, options as IGroupOnlyMode)
  } else if (options.mode === GroupingMode.GROUP_SORT) {
    _this.result = _groupSortMode(_this, options as IGroupSortingMode)
  } else {
    throw EvalError('InValid Grouping Mode')
  }
  _this.misc['groupApplied'] = true
  _this.misc['nestingApplied'] = !options.flat
  return _this
}

function _groupOnlyMode(_this: IDataWorkerBase, options: IGroupOnlyMode): any[] {
  // Validations in case Group only mode is used
  if (options.groupOn.length === 0) {
    throw EvalError('Empty parameter to group not allowed')
  }

  return _putGroupingOnInput(
    options.flat,
    options.groupOn.map(item => {
      return { sortMode: SortingMode.NONE, attribute: item }
    }),
    _this.result
  )
}

function _groupSortMode(_this: IDataWorkerBase, options: IGroupSortingMode): any[] {
  // Validations in case Group-Sort mode is used
  if (options.groupingOptions.length === 0) {
    throw EvalError('Empty parameter to group not allowed')
  }
  return _putGroupingOnInput(options.flat, options.groupingOptions, _this.result)
}

function _putGroupingOnInput(flat: boolean, groupOnMapping: IAttrSortingMode[], input: any[]) {
  let tempResult = []
  const nestObject = nest()
  const groupOn: string[] = []
  groupOnMapping.forEach(oneKey => {
    groupOn.push(oneKey.attribute)
    nestObject.key((d: any) => {
      return d[oneKey.attribute]
    })
    if (oneKey.sortMode === SortingMode.ASC) {
      nestObject.sortKeys(ascending)
    } else if (oneKey.sortMode === SortingMode.DSC) {
      nestObject.sortKeys(descending)
    }
  })

  tempResult = nestObject.entries(input)
  return flat ? _flattenObjects(tempResult, groupOn) : tempResult
}

function _flattenObjects(input: any[], keys: string[]): any[] {
  keys.push('values')
  return _parseOneArray(input, keys)
}

function _parseOneArray(
  input: any[],
  keys: string[],
  currentDepth: number = 0,
  currentElement: any = {},
  returnArray: any[] = []
): any {
  for (const singleElement of input) {
    if (singleElement.hasOwnProperty('key') && singleElement.hasOwnProperty('values')) {
      currentElement[keys[currentDepth]] = singleElement['key']
      _parseOneArray(singleElement['values'], keys, currentDepth + 1, currentElement, returnArray)
    } else {
      currentElement[keys[currentDepth]] = input
      returnArray.push(JSON.parse(JSON.stringify(currentElement)))
      return returnArray
    }
  }
  return returnArray
}

export default _group
