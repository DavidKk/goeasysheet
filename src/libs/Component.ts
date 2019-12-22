const GlobalModels = {}
const GlobalServices = {}
const GlobalBridges = {}

function Model <T extends { new(): {} }>(Model: T) {
  return function (target: Object, propertyKey: string) {
    if (!GlobalModels[Model.name]) {
      const model = new Model
      GlobalModels[Model.name] = model

      Object.defineProperty(target, propertyKey, {
        writable: false,
        get: () => model
      })
    }
  }
}

function Service <T extends { new(): {} }>(Service: T) {
  return function (target: Object, propertyKey: string) {
    if (!GlobalServices[Service.name]) {
      const service = new Service
      GlobalServices[Service.name] = service

      Object.defineProperty(target, propertyKey, {
        writable: false,
        get: () => service
      })
    }
  }  
}

function Bridge <T extends Object>(target: T, _propertyKey: string, descriptor: PropertyDescriptor) {
  const { name: namespace } = target.constructor
  if (!GlobalBridges[namespace]) {
    GlobalBridges[namespace] = descriptor.value
  }
}
