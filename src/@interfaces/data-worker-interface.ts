import {
  IAggregateInterface,
  IExecute,
  IGroupInterface,
  IAggregateInnerInterface,
  IGroupInnerInterface,
  IOptionType,
} from "../@types/types";

import { IAggregatorArrayModeInput, IAggregatorMapModeInput } from "./aggregator-interface";

import { IGroupOnlyMode, IGroupSortingMode } from "./group-interface";

export interface IDataWorkerBase {
  source: unknown[];
  result: unknown[];
  misc: {
    groupApplied?: boolean;
    nestingApplied?: boolean;
  };
}

export interface IDataWorker {
  group: IGroupInterface;
  aggregate: IAggregateInterface;
  execute: IExecute;
}

export interface IFunctionWithArgs<T> {
  func: (_this: IDataWorkerBase, options: T) => IDataWorkerBase;
  args: IOptionType;
}

export interface IDatum {
  key?: string;
  values?: IDatum[];
  value?: undefined;
}
