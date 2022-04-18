import { deviation, max, mean, median, min, quantile, sum, variance } from "d3-array";
import { Operation } from "../@enums/enum";

function quantileQ1(input: any[]) {
  return quantile(input, 0.25);
}

function quantileQ3(input: any[]) {
  return quantile(input, 0.75);
}

const operationDictionary: Map<Operation, any> = new Map();

// Mean Operation
operationDictionary.set(Operation.AVERAGE, mean);
operationDictionary.set(Operation.MEAN, mean);
operationDictionary.set(Operation.NANMEAN, mean);

// Sum
operationDictionary.set(Operation.SUM, sum);

// Min,Max
operationDictionary.set(Operation.MINIMUN, min);
operationDictionary.set(Operation.MAXIMUM, max);

// Median,Variance,Stdev
operationDictionary.set(Operation.MEDIAN, median);
operationDictionary.set(Operation.VARIANCE, variance);
operationDictionary.set(Operation.STDEV, deviation);

// q1,q3
operationDictionary.set(Operation.Q1, quantileQ1);
operationDictionary.set(Operation.Q3, quantileQ3);

export { operationDictionary };
