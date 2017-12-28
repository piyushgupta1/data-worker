import DataWorker from '../src/data-worker'

let sampleData = [
  { dep: 'First Top', name: 'First child', model: 'value1', size: '320' },
  { dep: 'First Top', name: 'First child', model: 'value2', size: '320' },
  { dep: 'First Top', name: 'First child', model: 'value3', size: '320' },
  { dep: 'First Top', name: 'First child', model: 'value4', size: '320' },
  { dep: 'First Top', name: 'SECOND CHILD', model: 'value1', size: '320' },
  { dep: 'First Top', name: 'SECOND CHILD', model: 'value2', size: '320' },
  { dep: 'First Top', name: 'SECOND CHILD', model: 'value3', size: '320' },
  { dep: 'First Top', name: 'SECOND CHILD', model: 'value4', size: '320' },
  { dep: 'Second Top', name: 'First Child', model: 'value1', size: '320' },
  { dep: 'Second Top', name: 'First Child', model: 'value2', size: '320' },
  { dep: 'Second Top', name: 'First Child', model: 'value3', size: '320' },
  { dep: 'Second Top', name: 'First Child', model: 'value4', size: '320' },
  { dep: 'Second Top', name: 'SECOND CHILD', model: 'value1', size: '320' },
  { dep: 'Second Top', name: 'SECOND CHILD', model: 'value2', size: '320' },
  { dep: 'Second Top', name: 'SECOND CHILD', model: 'value3', size: '320' },
  { dep: 'Second Top', name: 'SECOND CHILD', model: 'value4', size: '320' },
  { dep: 'Third Top', name: 'First Child', model: 'value2', size: '320' },
  { dep: 'Third Top', name: 'First Child', model: 'value3', size: '320' },
  { dep: 'Third Top', name: 'First Child', model: 'value4', size: '320' },
  { dep: 'Third Top', name: 'First Child', model: 'value5', size: '320' },
  { dep: 'Third Top', name: 'Second Child', model: 'value1', size: '320' },
  { dep: 'Third Top', name: 'Second Child', model: 'value2', size: '320' },
  { dep: 'Third Top', name: 'Second Child', model: 'value3', size: '320' },
  { dep: 'Third Top', name: 'Second Child', model: 'value4', size: '320' }
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
})
