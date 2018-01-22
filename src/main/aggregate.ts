import { deviation, max, mean, median, min, quantile, sum, variance } from 'd3-array'

import { AggregatorMode, Operation } from '../@enums/enum'
import {
  IAggregatorArrayModeInput,
  IAggregatorMapModeInput
} from '../@interfaces/aggregator-interface'
import { IDataWorker, IDataWorkerBase } from '../@interfaces/data-worker-interface'
import { IAggregateInnerInterface } from '../@types/types'
import { operationDictionary } from './operationMap'
let _aggregate: IAggregateInnerInterface

_aggregate = (
  _this: IDataWorkerBase,
  aggregatorOptions: IAggregatorArrayModeInput | IAggregatorMapModeInput
): IDataWorkerBase => {
  if (_this.result.length === 0) {
    throw EvalError('Empty data to aggregate not allowed')
  }

  let finalAttrToAggrMap = new Map<string, Operation[]>()
  if (aggregatorOptions.mode === AggregatorMode.ARRAY_MODE) {
    finalAttrToAggrMap = _aggregatorArrayMode(aggregatorOptions as IAggregatorArrayModeInput)
  } else {
    aggregatorOptions = aggregatorOptions as IAggregatorMapModeInput
    finalAttrToAggrMap = aggregatorOptions.attrToAggrMap
  }
  _this.result = _this.misc.groupApplied
    ? _handleNestingAggregation(_this.misc.nestingApplied, _this.result, finalAttrToAggrMap)
    : _createTempAggregationObject(finalAttrToAggrMap, _this.result)
  return _this
}

function _aggregatorArrayMode(aggregatorOptions: IAggregatorArrayModeInput) {
  const finalAttrToAggrMap = new Map<string, Operation[]>()
  if (aggregatorOptions.attrs.length === 0) {
    throw EvalError('Must give one attribute when using Array mode')
  }

  if (aggregatorOptions.aggr.length === 0) {
    throw EvalError('Must give one aggregator when using Array mode')
  }
  for (const attr of aggregatorOptions.attrs) {
    finalAttrToAggrMap.set(attr, aggregatorOptions.aggr)
  }
  return finalAttrToAggrMap
}

function _handleNestingAggregation(
  nestingApplied: boolean,
  inputData: any[],
  finalAttrToAggrMap: Map<string, Operation[]>
): any[] {
  if (nestingApplied) {
    _putAggregationOnNestedResult(inputData, finalAttrToAggrMap)
  } else {
    for (const singleElement of inputData) {
      Object.assign(
        singleElement,
        _createTempAggregationObject(finalAttrToAggrMap, singleElement.values)
      )
      delete singleElement.values
    }
  }
  return inputData
}

function _putAggregationOnNestedResult(
  inputData: any[],
  finalAttrToAggrMap: Map<string, Operation[]>
) {
  for (const singleElement of inputData) {
    if (!singleElement.values[0].hasOwnProperty('values')) {
      Object.assign(
        singleElement,
        _createTempAggregationObject(finalAttrToAggrMap, singleElement.values)
      )
      delete singleElement.values
    } else {
      _putAggregationOnNestedResult(singleElement.values, finalAttrToAggrMap)
    }
  }
}

function _createTempAggregationObject(
  finalAttrToAggrMap: Map<string, Operation[]>,
  inputData: any[]
) {
  const tempObject: any = {}
  finalAttrToAggrMap.forEach((aggr, attr) => {
    aggr.forEach(singleAgg => {
      tempObject[Operation[singleAgg] + '_' + attr] = _oneAttrOneAggr(inputData, attr, singleAgg)
    })
  })
  return tempObject
}

function _oneAttrOneAggr(input: any[], attr: string, aggr: Operation): number {
  input = input.map(item => item[attr])
  let result: number | undefined
  if (operationDictionary.has(aggr)) {
    result = operationDictionary.get(aggr)(input)
  } else {
    throw TypeError('Unsupported Operation')
  }

  result = result as number
  return result
}

export default _aggregate
