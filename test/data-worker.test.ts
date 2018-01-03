import { DataWorker } from '../src/data-worker'

const sampleData = [
  { size2: '100', size1: NaN, dep: 'First Top', name: 'First child', model: 'value1', size: '320' },
  { size2: '100', size1: NaN, dep: 'First Top', name: 'First child', model: 'value2', size: '320' },
  {
    size2: '100',
    size1: '100',
    dep: 'First Top',
    name: 'First child',
    model: 'value3',
    size: '320'
  },
  {
    size2: '100',
    size1: '100',
    dep: 'First Top',
    name: 'First child',
    model: 'value4',
    size: '320'
  },
  {
    size2: '100',
    size1: '100',
    dep: 'First Top',
    name: 'SECOND CHILD',
    model: 'value1',
    size: '320'
  },
  {
    size2: '100',
    size1: '100',
    dep: 'First Top',
    name: 'SECOND CHILD',
    model: 'value2',
    size: '320'
  },
  {
    size2: '100',
    size1: '100',
    dep: 'First Top',
    name: 'SECOND CHILD',
    model: 'value3',
    size: '320'
  },
  {
    size2: '100',
    size1: '100',
    dep: 'First Top',
    name: 'SECOND CHILD',
    model: 'value4',
    size: '320'
  },
  {
    size2: '100',
    size1: '100',
    dep: 'Second Top',
    name: 'First Child',
    model: 'value1',
    size: '320'
  },
  {
    size2: '100',
    size1: '100',
    dep: 'Second Top',
    name: 'First Child',
    model: 'value2',
    size: '320'
  },
  {
    size2: '100',
    size1: '100',
    dep: 'Second Top',
    name: 'First Child',
    model: 'value3',
    size: '320'
  },
  {
    size2: '100',
    size1: '100',
    dep: 'Second Top',
    name: 'First Child',
    model: 'value4',
    size: '320'
  },
  {
    size2: '100',
    size1: '100',
    dep: 'Second Top',
    name: 'SECOND CHILD',
    model: 'value1',
    size: '320'
  },
  {
    size2: '100',
    size1: '100',
    dep: 'Second Top',
    name: 'SECOND CHILD',
    model: 'value2',
    size: '320'
  },
  {
    size2: '100',
    size1: '100',
    dep: 'Second Top',
    name: 'SECOND CHILD',
    model: 'value3',
    size: '320'
  },
  {
    size2: '100',
    size1: '100',
    dep: 'Second Top',
    name: 'SECOND CHILD',
    model: 'value4',
    size: '320'
  },
  {
    size2: '100',
    size1: '100',
    dep: 'Third Top',
    name: 'First Child',
    model: 'value2',
    size: '320'
  },
  {
    size2: '100',
    size1: '100',
    dep: 'Third Top',
    name: 'First Child',
    model: 'value3',
    size: '320'
  },
  {
    size2: '100',
    size1: '100',
    dep: 'Third Top',
    name: 'First Child',
    model: 'value4',
    size: '320'
  },
  {
    size2: '100',
    size1: '100',
    dep: 'Third Top',
    name: 'First Child',
    model: 'value5',
    size: '320'
  },
  {
    size2: '100',
    size1: '100',
    dep: 'Third Top',
    name: 'Second Child',
    model: 'value1',
    size: '320'
  },
  {
    size2: '100',
    size1: '100',
    dep: 'Third Top',
    name: 'Second Child',
    model: 'value2',
    size: '320'
  },
  {
    size2: '10d',
    size1: '100',
    dep: 'Third Top',
    name: 'Second Child',
    model: 'value3',
    size: '320'
  },
  {
    size2: '10q',
    size1: '100',
    dep: 'Third Top',
    name: 'Second Child',
    model: 'value4',
    size: '320'
  }
]

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
        .group(['dep', 'name'])
        .complete().length
    ).toBe(3)
  })

  it('Should correctly group object {flat=true} with result having 6 length', () => {
    const dw = new DataWorker()
    expect(
      dw
        .input(sampleData)
        .group(['dep', 'name'], true)
        .complete().length
    ).toBe(6)
  })

  // it('should throw error on unsupported operation', () => {
  //   const dw = new DataWorker()
  //   expect(() => dw.oneAttrOneAggr(sampleData, 'size', '')).toThrow('Unsupported Operation')
  // })

  // it('should aggregate data correctly operator (NaN-Mean) | Size1', () => {
  //   const dw = new DataWorker()
  //   expect(dw.oneAttrOneAggr(sampleData, 'size1', 'nanmean')).toBe(100)
  // })

  // it('should aggregate data correctly operator (NaN-Mean) | Size2', () => {
  //   const dw = new DataWorker()
  //   expect(dw.oneAttrOneAggr(sampleData, 'size2', 'nanmean')).toBe(100)
  // })

  // it('should aggregate data correctly operator (Mean-Average)', () => {
  //   const dw = new DataWorker()
  //   expect(dw.oneAttrOneAggr(sampleData, 'size1', 'mean')).toBe(91.67)
  //   expect(dw.oneAttrOneAggr(sampleData, 'size1', 'average')).toBe(91.67)
  // })

  it('should apply multiple aggregate data correctly', () => {
    const dw = new DataWorker()
    const result = dw
      .input(sampleData)
      .group(['dep'], true)
      .aggregate({
        aggr: ['mean', 'nanmean'],
        attrs: ['size1', 'size'],
        mode: 2
      })
      .complete()
  })

  it('should apply multiple aggregate data correctly', () => {
    const dw = new DataWorker()
    const result = dw
      .input(sampleData)
      .group(['dep', 'name'])
      .aggregate({
        aggr: ['mean', 'sum'],
        attrs: ['size1'],
        mode: 2
      })
      .complete()
  })

  it('should apply multiple aggregate data correctly', () => {
    const dw = new DataWorker()
    const result = dw
      .input(sampleData)
      .aggregate({
        aggr: ['mean', 'average'],
        attrs: ['size1', 'size2'],
        mode: 2
      })
      .complete()
  })
})
