import { AggregatorMode, dw, GroupingMode, Operation, SortingMode } from "../src/data-worker";

// tslint:disable-next-line:no-var-requires
import * as sampleData from "./sampleData.json";
import { get, keys } from "lodash";

describe("DataWorker test", () => {
  it("works if true is truthy", () => {
    expect(true).toBeTruthy();
  });

  it("Should correctly group object with result having 3 length", () => {
    expect(
      dw
        .group({
          mode: GroupingMode.ONLY_GROUP,
          flat: false,
          groupOn: ["dep", "name"],
        })
        .execute(sampleData).length
    ).toBe(3);
  });

  it("Should correctly group object {flat=true} with result having 6 length", () => {
    expect(
      dw
        .group({
          mode: GroupingMode.ONLY_GROUP,
          flat: true,
          groupOn: ["dep", "name"],
        })
        .execute(sampleData).length
    ).toBe(6);
  });

  it("Should correctly group object {flat=false} with sorting and result having 6 length", () => {
    const result = dw
      .group({
        mode: GroupingMode.GROUP_SORT,
        flat: false,
        groupingOptions: [
          { sortMode: SortingMode.ASC, attribute: "dep" },
          { sortMode: SortingMode.DSC, attribute: "name" },
        ],
      })
      .execute(sampleData);
    expect(result.length).toBe(3);
    expect(get(result[0], "key", "default")).toBe("First Top");
    expect(get(result[0], "values[0].key", "default")).toBe("SECOND CHILD");
  });

  it("Should correctly group object {flat=false} with sorting and result having 6 length", () => {
    const result = dw
      .group({
        mode: GroupingMode.GROUP_SORT,
        flat: false,
        groupingOptions: [
          { sortMode: SortingMode.DSC, attribute: "dep" },
          { sortMode: SortingMode.ASC, attribute: "name" },
        ],
      })
      .execute(sampleData);
    expect(result.length).toBe(3);
    expect(get(result[0], "key", "default")).toBe("Third Top");
    expect(get(result[0], "values[0].key", "default")).toBe("First Child");
  });

  it("should apply multiple aggregate data correctly", () => {
    const result = dw
      .group({
        mode: GroupingMode.GROUP_SORT,
        flat: false,
        groupingOptions: [
          { sortMode: SortingMode.ASC, attribute: "dep" },
          { sortMode: SortingMode.ASC, attribute: "name" },
        ],
      })
      .aggregate({
        aggr: [Operation.AVERAGE, Operation.SUM, Operation.MAXIMUM, Operation.MINIMUN],
        attrs: ["size1"],
        mode: AggregatorMode.ARRAY_MODE,
      })
      .execute(sampleData);
    expect(result.length).toBe(3);
    expect(keys(get(result[0], "values[0]", {}))).toStrictEqual([
      "key",
      "AVERAGE_size1",
      "SUM_size1",
      "MAXIMUM_size1",
      "MINIMUN_size1",
    ]);
    expect(get(result[0], "values[0].AVERAGE_size1", 0)).toBe(100);
  });

  it("should apply multiple aggregate data correctly", () => {
    const result = dw
      .group({
        mode: GroupingMode.GROUP_SORT,
        flat: true,
        groupingOptions: [{ sortMode: SortingMode.ASC, attribute: "dep" }],
      })
      .aggregate({
        aggr: [Operation.MEAN, Operation.NANMEAN, Operation.Q1, Operation.Q3],
        attrs: ["size2"],
        mode: AggregatorMode.ARRAY_MODE,
      })
      .execute(sampleData);
    expect(result.length).toBe(3);
    expect(keys(result[0])).toStrictEqual([
      "dep",
      "MEAN_size2",
      "NANMEAN_size2",
      "Q1_size2",
      "Q3_size2",
    ]);
    expect(get(result[0], "MEAN_size2", 0)).toBe(257.25);
  });

  it("should apply multiple aggregate data correctly", () => {
    const map: Map<string, Operation[]> = new Map();
    map.set("size2", [Operation.STDEV, Operation.MEDIAN, Operation.VARIANCE]);
    const result = dw
      .aggregate({
        attrToAggrMap: map,
        mode: AggregatorMode.MAP_MODE,
      })
      .execute(sampleData);
    expect(result).toStrictEqual({
      STDEV_size2: 187.13444017951028,
      MEDIAN_size2: 100,
      VARIANCE_size2: 35019.29870129871,
    });
  });

  it("should apply multiple aggregate data correctly", () => {
    const result = dw
      .aggregate({
        aggr: [Operation.AVERAGE, Operation.SUM],
        attrs: ["size2"],
        mode: AggregatorMode.ARRAY_MODE,
      })
      .execute(sampleData);
    console.log(result);
    expect(result).toStrictEqual({
      AVERAGE_size2: 157.1818181818182,
      SUM_size2: 3458,
    });
  });
});

describe("DataWorker Error throw test", () => {
  it("Should throw error when no data present and group is attempted", () => {
    expect(() => {
      dw.group({
        mode: GroupingMode.ONLY_GROUP,
        flat: false,
        groupOn: ["dep", "name"],
      }).execute([]);
    }).toThrow(EvalError);

    expect(() => {
      dw.group({
        mode: GroupingMode.ONLY_GROUP,
        flat: false,
        groupOn: ["dep", "name"],
      }).execute([]);
    }).toThrowError("Empty data to group not allowed");
  });

  it("Should throw error when no data present and aggregate is attempted", () => {
    expect(() => {
      dw.aggregate({
        aggr: [Operation.AVERAGE, Operation.SUM],
        attrs: ["size1"],
        mode: AggregatorMode.ARRAY_MODE,
      }).execute([]);
    }).toThrow(EvalError);

    expect(() => {
      dw.aggregate({
        aggr: [Operation.AVERAGE, Operation.SUM],
        attrs: ["size1"],
        mode: AggregatorMode.ARRAY_MODE,
      }).execute([]);
    }).toThrowError("Empty data to aggregate not allowed");
  });

  it("Should throw error when no grouping attribute present and group is attempted (Group Only)", () => {
    expect(() => {
      dw.group({
        mode: GroupingMode.ONLY_GROUP,
        flat: false,
        groupOn: [],
      }).execute(sampleData);
    }).toThrow(EvalError);

    expect(() => {
      dw.group({
        mode: GroupingMode.ONLY_GROUP,
        flat: false,
        groupOn: [],
      }).execute(sampleData);
    }).toThrowError("Empty parameter to group not allowed");
  });

  it("Should throw error when no grouping attribute present and group is attempted (Group Sort Mode)", () => {
    expect(() => {
      dw.group({
        mode: GroupingMode.GROUP_SORT,
        flat: false,
        groupingOptions: [],
      }).execute(sampleData);
    }).toThrow(EvalError);

    expect(() => {
      dw.group({
        mode: GroupingMode.GROUP_SORT,
        flat: false,
        groupingOptions: [],
      }).execute(sampleData);
    }).toThrowError("Empty parameter to group not allowed");
  });

  it("Should throw error when invalid group mode is supplied and group is attempted", () => {
    expect(() => {
      dw.group({
        mode: 5,
        flat: false,
        groupingOptions: [],
      }).execute(sampleData);
    }).toThrow(EvalError);

    expect(() => {
      dw.group({
        mode: 5,
        flat: false,
        groupingOptions: [],
      }).execute(sampleData);
    }).toThrowError("Invalid Grouping Mode");
  });

  it("Should throw error when invalid aggregate is attempted", () => {
    expect(() => {
      dw.aggregate({
        aggr: [99, Operation.SUM],
        attrs: ["size1"],
        mode: AggregatorMode.ARRAY_MODE,
      }).execute(sampleData);
    }).toThrow(TypeError);

    expect(() => {
      dw.aggregate({
        aggr: [99, Operation.SUM],
        attrs: ["size1"],
        mode: AggregatorMode.ARRAY_MODE,
      }).execute(sampleData);
    }).toThrowError("Unsupported Operation");
  });

  it("Should throw error when empty parameter in aggregate is attempted", () => {
    expect(() => {
      dw.aggregate({
        aggr: [Operation.SUM],
        attrs: [],
        mode: AggregatorMode.ARRAY_MODE,
      }).execute(sampleData);
    }).toThrow(EvalError);

    expect(() => {
      dw.aggregate({
        aggr: [Operation.SUM],
        attrs: [],
        mode: AggregatorMode.ARRAY_MODE,
      }).execute(sampleData);
    }).toThrowError("Must give one attribute when using Array mode");
  });

  it("Should throw error when empty aggregator in aggregate is attempted", () => {
    expect(() => {
      dw.aggregate({
        aggr: [],
        attrs: ["size1"],
        mode: AggregatorMode.ARRAY_MODE,
      }).execute(sampleData);
    }).toThrow(EvalError);

    expect(() => {
      dw.aggregate({
        aggr: [],
        attrs: ["size1"],
        mode: AggregatorMode.ARRAY_MODE,
      }).execute(sampleData);
    }).toThrowError("Must give one aggregator when using Array mode");
  });
});
