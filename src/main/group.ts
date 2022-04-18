import { ascending, descending } from "d3-array";
import { nest } from "d3-collection";
import { GroupingMode, SortingMode } from "../@enums/enum";
import { IDataWorkerBase, IDatum } from "../@interfaces/data-worker-interface";
import { IGroupOnlyMode, IGroupSortingMode } from "../@interfaces/group-interface";
import { IAttrSortingMode } from "../@interfaces/sorting-interface";
import { IGroupInnerInterface, IOptionType } from "../@types/types";

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
 *
 * @param _this self reference
 * @param options All grouping options
 * @returns this
 */
const _group: IGroupInnerInterface = (
  _this: IDataWorkerBase,
  options: IOptionType
): IDataWorkerBase => {
  if (_this.source.length === 0) {
    throw new EvalError("Empty data to group not allowed");
  }

  const sourceToUse = _this.result.length > 0 ? _this.result : _this.source;

  switch (options.mode) {
    case GroupingMode.ONLY_GROUP:
      _this.result = _groupOnlyMode(sourceToUse, options as IGroupOnlyMode);
      break;
    case GroupingMode.GROUP_SORT:
      _this.result = _groupSortMode(sourceToUse, options as IGroupSortingMode);
      break;

    default:
      throw new EvalError("Invalid Grouping Mode");
  }

  _this.misc.groupApplied = true;
  _this.misc.nestingApplied = !options.flat;

  return _this;
};

function _groupOnlyMode(inputData: unknown[], options: IGroupOnlyMode): unknown[] {
  // Validations in case Group only mode is used
  if (options.groupOn.length === 0) {
    throw EvalError("Empty parameter to group not allowed");
  }

  return _putGroupingOnInput(
    options.flat,
    options.groupOn.map((item) => {
      return { sortMode: SortingMode.NONE, attribute: item };
    }),
    inputData
  );
}

function _groupSortMode(inputData: unknown[], options: IGroupSortingMode): unknown[] {
  // Validations in case Group-Sort mode is used
  if (options.groupingOptions.length === 0) {
    throw EvalError("Empty parameter to group not allowed");
  }
  return _putGroupingOnInput(options.flat, options.groupingOptions, inputData);
}

function _putGroupingOnInput(flat: boolean, groupOnMapping: IAttrSortingMode[], input: unknown[]) {
  let tempResult: IDatum[] = [];
  const nestObject = nest();
  const groupOn: string[] = [];

  groupOnMapping.forEach((oneKey) => {
    if (flat) {
      groupOn.push(oneKey.attribute);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nestObject.key((d: any) => {
      return d[oneKey.attribute];
    });

    if (oneKey.sortMode === SortingMode.ASC) {
      nestObject.sortKeys(ascending);
    } else if (oneKey.sortMode === SortingMode.DSC) {
      nestObject.sortKeys(descending);
    }
  });

  tempResult = nestObject.entries(input);
  return flat ? _flattenObjects(tempResult, groupOn) : tempResult;
}

function _flattenObjects(input: IDatum[], keys: string[]): unknown[] {
  keys.push("values");
  return _parseOneArray(input, keys);
}

function _parseOneArray(
  input: IDatum[],
  keys: string[],
  currentDepth = 0,
  currentElement: any = {},
  returnArray: unknown[] = []
): unknown[] {
  for (const singleElement of input) {
    if (singleElement.key && singleElement.values) {
      currentElement[keys[currentDepth]] = singleElement.key;
      _parseOneArray(singleElement.values, keys, currentDepth + 1, currentElement, returnArray);
    } else {
      currentElement[keys[currentDepth]] = input;
      returnArray.push(JSON.parse(JSON.stringify(currentElement)));
      return returnArray;
    }
  }
  return returnArray;
}

export default _group;
