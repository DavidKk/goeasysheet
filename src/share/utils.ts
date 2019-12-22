function isSameDate (aDate: Date, bDate: Date) {
  if (aDate.getFullYear() == bDate.getFullYear()) {
    if (aDate.getMonth() == bDate.getMonth()) {
      if (aDate.getDate() == bDate.getDate()) {
        return true
      }
    }
  }
  
  return false
}

function assign (object: { [key: string]: any }, props: { [key: string]: any }) {
  var names = Object.keys(object)
  for (var i = 0; i < names.length; i ++) {
    var name = names[i]
    object[name] = props[name]
  }
}

function find (array: any[], callback: (value: any, index: number) => boolean): any | undefined
function find (array: any[], match: { [key: string]: any }): any | undefined
function find (...args: any[]): any | undefined {
  if (typeof args[1] === 'function') {
    const [array, callback] = args
    for (var i = 0; i < array.length; i ++) {
      if (callback(array[i], i) === true) {
        return array[i]
      }
    }

    return
  }

  if (typeof args[1] === 'object') {
    const [array, callback] = args[1]
    const props = Object.keys(callback)
    for (let i = 0; i < array.length; i ++) {
      const item = array[i]

      let mathced = 0
      for (let j = 0; j < props.length; j ++) {
        const prop = props[j]
        item[prop] === callback[prop] && mathced ++
      }

      if (mathced === props.length) {
        return item
      }
    }
  }
}

function findIndex (array: any[], callback: (value: any, index: number) => boolean): number
function findIndex (array: any[], match: { [key: string]: any }): number
function findIndex (...args: any[]): number {
  if (typeof args[1] === 'function') {
    const [array, callback] = args
    for (let i = 0; i < array.length; i ++) {
      if (callback(array[i], i) === true) {
        return i
      }
    }
  }

  if (typeof args[1] === 'object') {
    const [array, callback] = args[1]
    const props = Object.keys(callback)
    for (let i = 0; i < array.length; i ++) {
      const item = array[i]

      let mathced = 0
      for (let j = 0; j < props.length; j ++) {
        const prop = props[j]
        item[prop] === callback[prop] && mathced ++
      }

      if (mathced === props.length) {
        return i
      }
    }
  }

  return -1
}
