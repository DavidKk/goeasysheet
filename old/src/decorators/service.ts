export default function Service <T extends { new(): {} }>(Service: T) {
  return function (target: Object, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get () {
        const namespace = Service.name
        if (!GlobalServices[namespace]) {
          const service = new Service()
          GlobalServices[namespace] = service
        }
  
        return GlobalServices[namespace]
      }
    })
  }
}
