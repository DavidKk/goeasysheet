const GlobalModels = new Map
const GlobalServices = new Map
const GlobalBridges = new Map

function Model <T extends { new(): {} }>(Model: T) {
  return function (target: Object, propertyKey: string) {
    if (!GlobalModels.get(Model.name)) {
      const model = new Model
      GlobalModels.set(Model.name, model)

      Object.defineProperty(target, propertyKey, {
        writable: false,
        get: () => model
      })
    }
  }
}

function Service <T extends { new(): {} }>(Service: T) {
  return function (target: Object, propertyKey: string) {
    if (!GlobalServices.get(Service.name)) {
      const service = new Service
      GlobalServices.set(Service.name, service)

      Object.defineProperty(target, propertyKey, {
        writable: false,
        get: () => service
      })
    }
  }  
}

function Bridge <T extends Object>(target: T, _propertyKey: string, descriptor: PropertyDescriptor) {
  const { name: namespace } = target.constructor
  if (!GlobalBridges.get(namespace)) {
    GlobalBridges.set(namespace, descriptor.value)
  }
}
