export default function Model <T extends { new(): {} }>(Model: T) {
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
