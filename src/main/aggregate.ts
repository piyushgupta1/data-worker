import { deviation, max, mean, median, min, quantile, sum, variance } from 'd3-array'

import { AggregatorMode, Operation } from '../@enums/enum'
import {
  IAggregatorArrayModeInput,
  IAggregatorMapModeInput
} from '../@interfaces/aggregator-interface'
import { IDataWorker, IDataWorkerBase } from '../@interfaces/data-worker-interface'
import { IAggregateInnerInterface } from '../@types/types'

let _aggregate: IAggregateInnerInterface

_aggregate = (
  _this: IDataWorkerBase,
  aggregatorOptions: IAggregatorArrayModeInput | IAggregatorMapModeInput
): IDataWorkerBase => {
  if (_this.result.length === 0) {
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
  if (_this.misc.groupApplied) {
    if (_this.misc.nestingApplied) {
      _putAggregationOnNestedResult(_this.result, finalAttrToAggrMap)
    } else {
      for (const singleElement of _this.result) {
        Object.assign(
          singleElement,
          _createTempAggregationObject(finalAttrToAggrMap, singleElement.values)
        )
        delete singleElement.values
      }
    }
  } else {
    _this.result = _createTempAggregationObject(finalAttrToAggrMap, _this.result)
  }

  return _this
}

function _putAggregationOnNestedResult(
  inputData: any[],
  finalAttrToAggrMap: Map<string, Operation[]>
) {
  for (const singleElement of inputData) {
    if (singleElement.hasOwnProperty('key') && singleElement.hasOwnProperty('values')) {
      if (singleElement.values.length > 0) {
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

export default _aggregate
