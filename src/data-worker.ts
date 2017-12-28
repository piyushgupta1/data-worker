import { nest } from 'd3-collection'
export default class DataWorker {
  private ipData: any[] = []
  private result: any[] = []
  constructor() {}

  public group(groupOn: string[], flat: boolean = false): DataWorker {
    if (this.ipData.length === 0) {
      throw new EvalError('Empty data to group not allowed')
    }

    if (groupOn.length === 0) {
      throw new EvalError('Empty parameter to group not allowed')
    }

    let tempResult = []
    let nestObject = nest()
    for (let i = 0; i < groupOn.length; i++) {
      nestObject.key((d: any) => {
        return d[groupOn[i]]
      })
    }
    tempResult = nestObject.entries(this.ipData)
    if (flat) {
      this.result = this.flattenObjects(tempResult, groupOn)
    } else {
      this.result = tempResult
    }
    return this
  }

  public input(entryData: any[]): DataWorker {
    this.ipData = entryData
    return this
  }

  public complete(): any[] {
    return this.result
  }

  private flattenObjects(
    input: any[],
    keys: string[],
    returnMe: any[] = []
  ): any[] {
    keys.push('values')
    return this.parseOneArray(input, keys)
  }

  private parseOneArray(
    input: any[],
    keys: string[],
    currentDepth: number = 0,
    currentElement: any = {},
    returnArray: any[] = []
  ): any {
    for (let i = 0; i < input.length; i++) {
      if (input[i].hasOwnProperty('key') && input[i].hasOwnProperty('values')) {
        currentElement[keys[currentDepth]] = input[i]['key']
        this.parseOneArray(
          input[i]['values'],
          keys,
          currentDepth + 1,
          currentElement,
          returnArray
        )
      } else {
        currentElement[keys[currentDepth]] = input
        returnArray.push(JSON.parse(JSON.stringify(currentElement)))
        return returnArray
      }
    }
    return returnArray
  }
}
