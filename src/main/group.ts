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
  // Check Data Input
  let result: any[] = []
  if (_this.result.length === 0) {
    throw new EvalError('Empty data to group not allowed')
  }

  // Check Mode for grouping
  const mode = options.mode
  if (mode === GroupingMode.ONLY_GROUP) {
    options = options as IGroupOnlyMode

    // Validations in case Group only mode is used
    if (options.groupOn.length === 0) {
      throw EvalError('Empty parameter to group not allowed')
    }

    result = _putGroupingOnInput(
      options.flat,
      options.groupOn.map(item => {
        return { sortMode: SortingMode.NONE, attribute: item }
      }),
      _this.result
    )
  } else if (mode === GroupingMode.GROUP_SORT) {
    options = options as IGroupSortingMode

    // Validations in case Group-Sort mode is used
    if (options.groupingOptions.length === 0) {
      throw EvalError('Empty parameter to group not allowed')
    }
    result = _putGroupingOnInput(options.flat, options.groupingOptions, _this.result)
  } else {
    // Throw error if invalid option is used
    throw EvalError('InValid Grouping Mode')
  }
  _this.misc['groupApplied'] = true
  _this.misc['nestingApplied'] = !options.flat
  _this.result = result
  return _this
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
  if (flat) {
    return _flattenObjects(tempResult, groupOn)
  } else {
    return tempResult
  }
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
