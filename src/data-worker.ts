import { nest } from 'd3-collection'

import { AggregatorMode } from './enum'
import { IAggregatorArrayModeInput, IAggregatorMapModeInput } from './interface'
import { mean, nanMean, sum } from './operators'

export class DataWorker {
  private ipData: any[] = []
  private result: any[] = []
  private groupApplied: boolean = false
  private nestingApplied: boolean = false

  constructor() {
    //
  }

  public group(groupOn: string[], flat: boolean = false): DataWorker {
    if (this.ipData.length === 0) {
      throw EvalError('Empty data to group not allowed')
    }

    if (groupOn.length === 0) {
      throw EvalError('Empty parameter to group not allowed')
    }

    let tempResult = []
    const nestObject = nest()
    for (const key of groupOn) {
      nestObject.key((d: any) => {
        return d[key]
      })
    }
    tempResult = nestObject.entries(this.ipData)
    if (flat) {
      this.result = this.flattenObjects(tempResult, groupOn)
    } else {
      this.nestingApplied = true
      this.result = tempResult
    }
    this.groupApplied = true
    return this
  }

  public aggregate(
    aggregatorOptions: IAggregatorArrayModeInput | IAggregatorMapModeInput
  ): DataWorker {
    if (this.ipData.length === 0) {
      throw TypeError('No Data Present')
    }

    const mode = aggregatorOptions.mode
    let finalAttrToAggrMap = new Map<string, string[]>()
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

    if (this.groupApplied) {
      if (this.nestingApplied) {
        this.putAggregationOnNestedResult(this.result, finalAttrToAggrMap)
      } else {
        for (const singleElement of this.result) {
          Object.assign(
            singleElement,
            this.createTempAggregationObject(finalAttrToAggrMap, singleElement.values)
          )
          delete singleElement.values
        }
      }
    } else {
      this.result.push(this.createTempAggregationObject(finalAttrToAggrMap, this.ipData))
    }

    return this
  }

  public input(entryData: any[]): DataWorker {
    this.ipData = Object.assign([], entryData)
    return this
  }

  public complete(): any[] {
    this.reset()
    return this.result
  }

  private putAggregationOnNestedResult(
    inputData: any[],
    finalAttrToAggrMap: Map<string, string[]>
  ) {
    for (const singleElement of inputData) {
      if (singleElement.hasOwnProperty('key') && singleElement.hasOwnProperty('values')) {
        if (singleElement.values.length > 0) {
          if (!singleElement.values[0].hasOwnProperty('values')) {
            Object.assign(
              singleElement,
              this.createTempAggregationObject(finalAttrToAggrMap, singleElement.values)
            )
            delete singleElement.values
          } else {
            this.putAggregationOnNestedResult(singleElement.values, finalAttrToAggrMap)
          }
        }
      }
    }
  }

  private createTempAggregationObject(finalAttrToAggrMap: Map<string, string[]>, inputData: any[]) {
    const tempObject: any = {}
    finalAttrToAggrMap.forEach((aggr, attr) => {
      aggr.forEach(singleAgg => {
        tempObject[singleAgg + '_' + attr] = this.oneAttrOneAggr(inputData, attr, singleAgg)
      })
    })
    return tempObject
  }

  private oneAttrOneAggr(input: any[], attr: string, aggr: string) {
    let functionToPut
    switch (aggr) {
      case 'nanmean':
        functionToPut = nanMean
        break
      case 'mean':
        functionToPut = mean
        break
      case 'average':
        functionToPut = mean
        break
      case 'sum':
        functionToPut = sum
        break

      default:
        throw TypeError('Unsupported Operation')
    }
    return +input
      .map(item => item[attr])
      .reduce(functionToPut)
      .toFixed(2)
  }

  private flattenObjects(input: any[], keys: string[]): any[] {
    keys.push('values')
    return this.parseOneArray(input, keys)
  }

  private parseOneArray(
    input: any[],
    keys: string[],
    currentDepth: number = 0,
    currentElement: any = {},
    returnArray: any[] = []
  ): any {
    for (const singleElement of input) {
      if (singleElement.hasOwnProperty('key') && singleElement.hasOwnProperty('values')) {
        currentElement[keys[currentDepth]] = singleElement['key']
        this.parseOneArray(
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

  private reset() {
    this.ipData = []
    this.nestingApplied = false
    this.groupApplied = false
  }
}
