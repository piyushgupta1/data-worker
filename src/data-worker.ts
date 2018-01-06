import {
  ascending,
  descending,
  deviation,
  max,
  mean,
  median,
  min,
  quantile,
  sum,
  variance
} from 'd3-array'
import { nest } from 'd3-collection'

import { AggregatorMode, GroupingMode, Operation, SortingMode } from './enum'
import {
  IAggregatorArrayModeInput,
  IAggregatorMapModeInput,
  IAttrSortingMode,
  IGroupOnlyMode,
  IGroupSortingMode
} from './interface'

export class DataWorker {
  private _ipData: any[] = []
  private _result: any[] = []
  private _groupApplied: boolean = false
  private _nestingApplied: boolean = false

  constructor() {
    //
  }

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
  public group(options: IGroupOnlyMode | IGroupSortingMode): DataWorker {
    // Check Data Input
    if (this._ipData.length === 0) {
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

      this._result = this._putGroupingOnInput(
        options.flat,
        options.groupOn.map(item => {
          return { sortMode: SortingMode.NONE, attribute: item }
        }),
        this._ipData
      )
    } else if (mode === GroupingMode.GROUP_SORT) {
      options = options as IGroupSortingMode

      // Validations in case Group-Sort mode is used
      if (options.groupingOptions.length === 0) {
        throw EvalError('Empty parameter to group not allowed')
      }
      this._result = this._putGroupingOnInput(options.flat, options.groupingOptions, this._ipData)
    } else {
      // Throw error if invalid option is used
      throw EvalError('InValid Grouping Mode')
    }
    this._nestingApplied = !options.flat
    this._groupApplied = true
    return this
  }

  public aggregate(
    aggregatorOptions: IAggregatorArrayModeInput | IAggregatorMapModeInput
  ): DataWorker {
    if (this._ipData.length === 0) {
      throw TypeError('No Data Present')
    }

    const mode = aggregatorOptions.mode
    let finalAttrToAggrMap = new Map<string, Operation[]>()
    if (mode === AggregatorMode.ARRAY_MODE) {
      aggregatorOptions = aggregatorOptions as IAggregatorArrayModeInput
      if (aggregatorOptions.attrs.length === 0) {
        throw TypeError('Must give one attribute when using Array mode')
      }

      if (aggregatorOptions.aggr.length === 0) {
        throw TypeError('Must give one aggregator when using Array mode')
      }
      for (const attr of aggregatorOptions.attrs) {
        finalAttrToAggrMap.set(attr, aggregatorOptions.aggr)
      }
    } else {
      aggregatorOptions = aggregatorOptions as IAggregatorMapModeInput
      finalAttrToAggrMap = aggregatorOptions.attrToAggrMap
    }

    if (this._groupApplied) {
      if (this._nestingApplied) {
        this._putAggregationOnNestedResult(this._result, finalAttrToAggrMap)
      } else {
        for (const singleElement of this._result) {
          Object.assign(
            singleElement,
            this._createTempAggregationObject(finalAttrToAggrMap, singleElement.values)
          )
          delete singleElement.values
        }
      }
    } else {
      this._result.push(this._createTempAggregationObject(finalAttrToAggrMap, this._ipData))
    }

    return this
  }

  public input(entryData: any[]): DataWorker {
    this._ipData = Object.assign([], entryData)
    return this
  }

  public complete(): any[] {
    this._reset()
    return this._result
  }

  private _putGroupingOnInput(flat: boolean, groupOnMapping: IAttrSortingMode[], input: any[]) {
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
      return this._flattenObjects(tempResult, groupOn)
    } else {
      return tempResult
    }
  }

  private _putAggregationOnNestedResult(
    inputData: any[],
    finalAttrToAggrMap: Map<string, Operation[]>
  ) {
    for (const singleElement of inputData) {
      if (singleElement.hasOwnProperty('key') && singleElement.hasOwnProperty('values')) {
        if (singleElement.values.length > 0) {
          if (!singleElement.values[0].hasOwnProperty('values')) {
            Object.assign(
              singleElement,
              this._createTempAggregationObject(finalAttrToAggrMap, singleElement.values)
            )
            delete singleElement.values
          } else {
            this._putAggregationOnNestedResult(singleElement.values, finalAttrToAggrMap)
          }
        }
      }
    }
  }

  private _createTempAggregationObject(
    finalAttrToAggrMap: Map<string, Operation[]>,
    inputData: any[]
  ) {
    const tempObject: any = {}
    finalAttrToAggrMap.forEach((aggr, attr) => {
      aggr.forEach(singleAgg => {
        tempObject[Operation[singleAgg] + '_' + attr] = this._oneAttrOneAggr(
          inputData,
          attr,
          singleAgg
        )
      })
    })
    return tempObject
  }

  private _oneAttrOneAggr(input: any[], attr: string, aggr: Operation): number {
    input = input.map(item => item[attr])
    let result: number | undefined
    switch (aggr) {
      case Operation.NANMEAN:
        result = mean(input)
        break
      case Operation.MEAN:
        result = mean(input)
        break
      case Operation.AVERAGE:
        result = mean(input)
        break
      case Operation.SUM:
        result = sum(input)
        break
      case Operation.MINIMUN:
        result = min(input)
        break
      case Operation.MAXIMUM:
        result = max(input)
        break
      case Operation.MEDIAN:
        result = median(input)
        break
      case Operation.VARIANCE:
        result = variance(input)
        break
      case Operation.Q3:
        result = quantile(input, 0.75)
        break
      case Operation.Q1:
        result = quantile(input, 0.25)
        break
      case Operation.STDEV:
        result = deviation(input)
        break

      default:
        throw TypeError('Unsupported Operation')
    }

    if (result === undefined) {
      throw Error()
    }

    result = result as number
    return result
  }

  private _flattenObjects(input: any[], keys: string[]): any[] {
    keys.push('values')
    return this._parseOneArray(input, keys)
  }

  private _parseOneArray(
    input: any[],
    keys: string[],
    currentDepth: number = 0,
    currentElement: any = {},
    returnArray: any[] = []
  ): any {
    for (const singleElement of input) {
      if (singleElement.hasOwnProperty('key') && singleElement.hasOwnProperty('values')) {
        currentElement[keys[currentDepth]] = singleElement['key']
        this._parseOneArray(
          singleElement['values'],
          keys,
          currentDepth + 1,
          currentElement,
          returnArray
        )
      } else {
        currentElement[keys[currentDepth]] = input
        returnArray.push(JSON.parse(JSON.stringify(currentElement)))
        return returnArray
      }
    }
    return returnArray
  }

  private _reset() {
    this._ipData = []
    this._nestingApplied = false
    this._groupApplied = false
  }
}
