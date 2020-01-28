export function find (array: any[], callback: (value: any, index: number) => boolean): any | undefined
export function find (array: any[], match: { [key: string]: any }): any | undefined
export function find (array: any[], any: any): any | undefined {
  if (typeof any === 'function') {
    const callback = any
    for (let i = 0; i < array.length; i ++) {
      if (callback(array[i], i) === true) {
        return array[i]
      }
    }

    return
  }

  if (typeof any === 'object') {
    const props = Object.keys(any)
    for (let i = 0; i < array.length; i ++) {
      const item = array[i]

      let mathced = 0
      for (let j = 0; j < props.length; j ++) {
        const prop = props[j]
        item[prop] === any[prop] && mathced ++
      }

      if (mathced === props.length) {
        return item
      }
    }
  }
}

export function findIndex (array: any[], callback: (value: any, index: number) => boolean): number
export function findIndex (array: any[], match: { [key: string]: any }): number
export function findIndex (array: any[], any: any): number {
  if (typeof any === 'function') {
    const callback = any
    for (let i = 0; i < array.length; i ++) {
      if (callback(array[i], i) === true) {
        return i
      }
    }
  }

  if (typeof any === 'object') {
    const props = Object.keys(any)
    for (let i = 0; i < array.length; i ++) {
      const item = array[i]

      let mathced = 0
      for (let j = 0; j < props.length; j ++) {
        const prop = props[j]
        item[prop] === any[prop] && mathced ++
      }

      if (mathced === props.length) {
        return i
      }
    }
  }

  return -1
}
