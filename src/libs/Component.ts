export function Model <T extends { new(): {} }>(Model: T) {
  return function (target: Object, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get () {
        const namespace = Model.name
        if (!GlobalModels[namespace]) {
          const model = new Model()
          GlobalModels[namespace] = model
        }
 
        return GlobalModels[namespace]
      }
    })
  }
}

export function Service <T extends { new(): {} }>(Service: T) {
  return function (target: Object, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get () {
        const namespace = Model.name
        if (!GlobalServices[namespace]) {
          const service = new Service()
          GlobalServices[namespace] = service
        }
  
        return GlobalServices[namespace]
      }
    })
  }
}

export function Bridge <T extends Object>(target: T, propertyKey: string, descriptor: PropertyDescriptor) {
  const { name } = target.constructor
  const namespace = `${name}.${propertyKey}`

  if (!GlobalBridges[namespace]) {
    GlobalBridges[namespace] = (...args: any[]) => {
      return typeof descriptor.value === 'function'
      ? descriptor.value.call(target, ...args)
      : descriptor.value
    }
  }
}
