import { AggregatorMode, Operation } from "../@enums/enum";
import {
  IAggregatorArrayModeInput,
  IAggregatorMapModeInput,
} from "../@interfaces/aggregator-interface";
import { IDataWorkerBase, IDatum } from "../@interfaces/data-worker-interface";
import { IAggregateInnerInterface, IOptionType } from "../@types/types";
import { operationDictionary } from "./operationMap";

interface ISimpleObject {
  [key: string]: number | string;
}

/**
 *
 * @param _this self reference
 * @param aggregatorOptions All aggregation options
 * @returns
 */
const _aggregate: IAggregateInnerInterface = (
  _this: IDataWorkerBase,
  aggregatorOptions: IOptionType
): IDataWorkerBase => {
  if (_this.source.length === 0) {
    throw EvalError("Empty data to aggregate not allowed");
  }

  let finalAttrToAggrMap = new Map<string, Operation[]>();

  switch (aggregatorOptions.mode) {
    case AggregatorMode.ARRAY_MODE:
      finalAttrToAggrMap = _aggregatorArrayMode(aggregatorOptions as IAggregatorArrayModeInput);
      break;

    case AggregatorMode.MAP_MODE:
      aggregatorOptions = aggregatorOptions as IAggregatorMapModeInput;
      finalAttrToAggrMap = aggregatorOptions.attrToAggrMap;
      break;

    default:
      return _this;
  }

  const sourceToUse = _this.result.length > 0 ? _this.result : _this.source;
  _this.result = _this.misc.groupApplied
    ? _handleNestingAggregation(
        _this.misc.nestingApplied,
        sourceToUse as IDatum[],
        finalAttrToAggrMap
      )
    : (_createTempAggregationObject(finalAttrToAggrMap, sourceToUse as IDatum[]) as unknown[]);
  return _this;
};

function _aggregatorArrayMode(aggregatorOptions: IAggregatorArrayModeInput) {
  const finalAttrToAggrMap = new Map<string, Operation[]>();
  if (aggregatorOptions.attrs.length === 0) {
    throw EvalError("Must give one attribute when using Array mode");
  }

  if (aggregatorOptions.aggr.length === 0) {
    throw EvalError("Must give one aggregator when using Array mode");
  }
  for (const attr of aggregatorOptions.attrs) {
    finalAttrToAggrMap.set(attr, aggregatorOptions.aggr);
  }
  return finalAttrToAggrMap;
}

function _handleNestingAggregation(
  nestingApplied: boolean | undefined,
  inputData: IDatum[],
  finalAttrToAggrMap: Map<string, Operation[]>
): unknown[] {
  if (nestingApplied) {
    _putAggregationOnNestedResult(inputData, finalAttrToAggrMap);
  } else {
    for (const singleElement of inputData) {
      if (singleElement.values) {
        Object.assign(
          singleElement,
          _createTempAggregationObject(finalAttrToAggrMap, singleElement.values)
        );
        delete singleElement.values;
      }
    }
  }
  return inputData;
}

function _putAggregationOnNestedResult(
  inputData: IDatum[],
  finalAttrToAggrMap: Map<string, Operation[]>
) {
  for (const singleElement of inputData) {
    if (singleElement.values && !singleElement.values[0].values) {
      Object.assign(
        singleElement,
        _createTempAggregationObject(finalAttrToAggrMap, singleElement.values)
      );
      delete singleElement.values;
    } else {
      _putAggregationOnNestedResult(
        singleElement.values ? singleElement.values : [],
        finalAttrToAggrMap
      );
    }
  }
}

function _createTempAggregationObject(
  finalAttrToAggrMap: Map<string, Operation[]>,
  inputData: unknown[]
): unknown {
  const tempObject: ISimpleObject = {};
  finalAttrToAggrMap.forEach((aggr, attr) => {
    aggr.forEach((singleAgg) => {
      tempObject[Operation[singleAgg] + "_" + attr] = _oneAttrOneAggr(
        inputData as ISimpleObject[],
        attr,
        singleAgg
      );
    });
  });
  return tempObject as unknown;
}

function _oneAttrOneAggr(input: ISimpleObject[], attr: string, aggr: Operation): number {
  const numbers = input.map((item) => item[attr]);
  let result: number | undefined;
  if (operationDictionary.has(aggr)) {
    result = operationDictionary.get(aggr)(numbers);
  } else {
    throw TypeError("Unsupported Operation");
  }

  result = result as number;
  return result;
}

export default _aggregate;
