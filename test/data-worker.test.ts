import { DataWorker } from '../src/data-worker'
import { AggregatorMode, GroupingMode, Operation, SortingMode } from '../src/enum'

// tslint:disable-next-line:no-var-requires
const sampleData = require('./sampleData.json')

describe('DataWorker test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('DataWorker is instantiable', () => {
    expect(new DataWorker()).toBeInstanceOf(DataWorker)
  })

  it('Should correctly group object with result having 3 length', () => {
    const dw = new DataWorker()
    expect(
      dw
        .input(sampleData)
        .group({
          mode: GroupingMode.ONLY_GROUP,
          flat: false,
          groupOn: ['dep', 'name']
        })
        .complete().length
    ).toBe(3)
  })

  it('Should correctly group object {flat=true} with result having 6 length', () => {
    const dw = new DataWorker()
    expect(
      dw
        .input(sampleData)
        .group({
          mode: GroupingMode.ONLY_GROUP,
          flat: true,
          groupOn: ['dep', 'name']
        })
        .complete().length
    ).toBe(6)
  })

  it('Should correctly group object {flat=false} with sorting and result having 6 length', () => {
    const dw = new DataWorker()
    const result = dw
      .input(sampleData)
      .group({
        mode: GroupingMode.GROUP_SORT,
        flat: false,
        groupingOptions: [
          { sortMode: SortingMode.ASC, attribute: 'dep' },
          { sortMode: SortingMode.DSC, attribute: 'name' }
        ]
      })
      .complete()
    expect(result.length).toBe(3)
    expect(result[0]['key']).toBe('First Top')
    expect(result[0]['values'][0]['key']).toBe('SECOND CHILD')
  })

  it('Should correctly group object {flat=false} with sorting and result having 6 length', () => {
    const dw = new DataWorker()
    const result = dw
      .input(sampleData)
      .group({
        mode: GroupingMode.GROUP_SORT,
        flat: false,
        groupingOptions: [
          { sortMode: SortingMode.DSC, attribute: 'dep' },
          { sortMode: SortingMode.ASC, attribute: 'name' }
        ]
      })
      .complete()
    expect(result.length).toBe(3)
    expect(result[0]['key']).toBe('Third Top')
    expect(result[0]['values'][0]['key']).toBe('First Child')
  })

  it('should apply multiple aggregate data correctly', () => {
    const dw = new DataWorker()
    const result = dw
      .input(sampleData)
      .group({
        mode: GroupingMode.GROUP_SORT,
        flat: false,
        groupingOptions: [{ sortMode: SortingMode.ASC, attribute: 'dep' }]
      })
      .aggregate({
        aggr: [Operation.AVERAGE, Operation.SUM, Operation.MAXIMUM, Operation.MINIMUN],
        attrs: ['size1'],
        mode: AggregatorMode.ARRAY_MODE
      })
      .complete()
  })

  it('should apply multiple aggregate data correctly', () => {
    const dw = new DataWorker()
    const result = dw
      .input(sampleData)
      .group({
        mode: GroupingMode.GROUP_SORT,
        flat: true,
        groupingOptions: [{ sortMode: SortingMode.ASC, attribute: 'dep' }]
      })
      .aggregate({
        aggr: [Operation.MEAN, Operation.NANMEAN, Operation.Q1, Operation.Q3],
        attrs: ['size1'],
        mode: AggregatorMode.ARRAY_MODE
      })
      .complete()
  })

  it('should apply multiple aggregate data correctly', () => {
    const dw = new DataWorker()
    const map: Map<string, Operation[]> = new Map()
    map.set('size', [Operation.STDEV, Operation.MEDIAN, Operation.VARIANCE])
    const result = dw
      .input(sampleData)
      .aggregate({
        attrToAggrMap: map,
        mode: AggregatorMode.MAP_MODE
      })
      .complete()
  })

  it('should apply multiple aggregate data correctly', () => {
    const dw = new DataWorker()
    const result = dw
      .input(sampleData)
      .aggregate({
        aggr: [Operation.AVERAGE, Operation.SUM],
        attrs: ['size1'],
        mode: AggregatorMode.ARRAY_MODE
      })
      .complete()
  })
})

describe('DataWorker Error throw test', () => {
  it('Should throw error when no data present and group is attempted', () => {
    const dw = new DataWorker()
    expect(() => {
      dw
        .group({
          mode: GroupingMode.ONLY_GROUP,
          flat: false,
          groupOn: ['dep', 'name']
        })
        .complete()
    }).toThrow(EvalError)

    expect(() => {
      dw
        .group({
          mode: GroupingMode.ONLY_GROUP,
          flat: false,
          groupOn: ['dep', 'name']
        })
        .complete()
    }).toThrowError('Empty data to group not allowed')
  })

  it('Should throw error when no grouping attribute present and group is attempted (Group Only)', () => {
    const dw = new DataWorker()
    expect(() => {
      dw
        .input(sampleData)
        .group({
          mode: GroupingMode.ONLY_GROUP,
          flat: false,
          groupOn: []
        })
        .complete()
    }).toThrow(EvalError)

    expect(() => {
      dw
        .input(sampleData)
        .group({
          mode: GroupingMode.ONLY_GROUP,
          flat: false,
          groupOn: []
        })
        .complete()
    }).toThrowError('Empty parameter to group not allowed')
  })

  it('Should throw error when no grouping attribute present and group is attempted (Group Sort Mode)', () => {
    const dw = new DataWorker()
    expect(() => {
      dw
        .input(sampleData)
        .group({
          mode: GroupingMode.GROUP_SORT,
          flat: false,
          groupingOptions: []
        })
        .complete()
    }).toThrow(EvalError)

    expect(() => {
      dw
        .input(sampleData)
        .group({
          mode: GroupingMode.GROUP_SORT,
          flat: false,
          groupingOptions: []
        })
        .complete()
    }).toThrowError('Empty parameter to group not allowed')
  })

  it('Should throw error when invalid group mode is supplied and group is attempted', () => {
    const dw = new DataWorker()
    expect(() => {
      dw
        .input(sampleData)
        .group({
          mode: 5,
          flat: false,
          groupingOptions: []
        })
        .complete()
    }).toThrow(EvalError)

    expect(() => {
      dw
        .input(sampleData)
        .group({
          mode: 5,
          flat: false,
          groupingOptions: []
        })
        .complete()
    }).toThrowError('InValid Grouping Mode')
  })
})
