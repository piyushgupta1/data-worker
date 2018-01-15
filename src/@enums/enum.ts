export enum AggregatorMode {
  MAP_MODE = 1,
  ARRAY_MODE = 2
}

export enum GroupingMode {
  ONLY_GROUP = 1,
  GROUP_SORT = 2
}

export enum SortingMode {
  ASC = 1,
  DSC = 2,
  NONE = 0
}

export enum Operation {
  SUM = 0,
  MEAN = 1,
  AVERAGE = 2,
  NANMEAN = 3,
  MINIMUN = 4,
  MAXIMUM = 5,
  MEDIAN = 6,
  VARIANCE = 7,
  Q3 = 8,
  Q1 = 9,
  STDEV = 10
}
