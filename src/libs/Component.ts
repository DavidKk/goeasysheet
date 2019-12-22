const GlobalModels = {}
const GlobalServices = {}
const GlobalBridges = {}

export function Model <T extends { new(): {} }>(Model: T) {
  return function (target: Object, propertyKey: string) {
    if (!GlobalModels[Model.name]) {
      const model = new Model
      GlobalModels[Model.name] = model
      target[propertyKey] = model
    }
  }
}

export function Service <T extends { new(): {} }>(Service: T) {
  return function (target: Object, propertyKey: string) {
    if (!GlobalServices[Service.name]) {
      const service = new Service
      GlobalServices[Service.name] = service
      target[propertyKey] = service
    }
  }  
}

export function Bridge <T extends Object>(target: T, _propertyKey: string, descriptor: PropertyDescriptor) {
  const { name: namespace } = target.constructor
  if (!GlobalBridges[namespace]) {
    GlobalBridges[namespace] = descriptor.value
  }
}
