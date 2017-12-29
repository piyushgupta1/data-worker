import { nest } from 'd3-collection'
export default class DataWorker {
  private ipData: any[] = []
  private result: any[] = []
  constructor() {
    //
  }

  public group(groupOn: string[], flat: boolean = false): DataWorker {
    if (this.ipData.length === 0) {
      throw new EvalError('Empty data to group not allowed')
    }

    if (groupOn.length === 0) {
      throw new EvalError('Empty parameter to group not allowed')
    }

    let tempResult = []
    const nestObject = nest()
    for (const key of groupOn) {
      nestObject.key((d: any) => {
        return d[key]
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

  private flattenObjects(input: any[], keys: string[], returnMe: any[] = []): any[] {
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
    for (const singleElement of input) {
      if (singleElement.hasOwnProperty('key') && singleElement.hasOwnProperty('values')) {
        currentElement[keys[currentDepth]] = singleElement['key']
        this.parseOneArray(
          singleElement['values'],
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
