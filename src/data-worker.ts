import { AggregatorMode, GroupingMode, Operation, SortingMode } from "./@enums/enum";
import {
  IAggregatorArrayModeInput,
  IAggregatorMapModeInput,
} from "./@interfaces/aggregator-interface";
import {
  IDataWorker,
  IDataWorkerBase,
  IFunctionWithArgs,
} from "./@interfaces/data-worker-interface";
import { IGroupOnlyMode, IGroupSortingMode } from "./@interfaces/group-interface";
import { IAggregateInterface, IExecute, IGroupInterface, IOptionType } from "./@types/types";
import _aggregate from "./main/aggregate";
import _group from "./main/group";

const functionArray: IFunctionWithArgs<IOptionType>[] = [];

const groupBy: IGroupInterface = (options: IGroupOnlyMode | IGroupSortingMode): IDataWorker => {
  functionArray.push({ func: _group, args: options });
  return dw;
};

const aggregateBy: IAggregateInterface = (
  aggregatorOptions: IAggregatorArrayModeInput | IAggregatorMapModeInput
): IDataWorker => {
  functionArray.push({ func: _aggregate, args: aggregatorOptions });
  return dw;
};

const complete: IExecute = (inputData: unknown[]) => {
  let baseData: IDataWorkerBase = { source: inputData, result: [], misc: {} };
  while (functionArray.length > 0) {
    const oneFunc = functionArray.shift();
    if (oneFunc) {
      baseData = oneFunc.func(baseData, oneFunc.args);
    }
  }
  return baseData.result;
};

const dw: IDataWorker = { group: groupBy, aggregate: aggregateBy, execute: complete };

export { dw };
export { GroupingMode, AggregatorMode, SortingMode, Operation };
export type { IAggregatorArrayModeInput, IAggregatorMapModeInput };
export type { IDataWorker, IDataWorkerBase, IFunctionWithArgs };
export type { IGroupOnlyMode, IGroupSortingMode };
export type { IAggregateInterface, IExecute, IGroupInterface };
