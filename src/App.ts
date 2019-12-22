let runtime: Runtime

class App extends Runtime {
  constructor (options: AppOptions) {
    super()

    runtime = this

    if (Object.prototype.hasOwnProperty.call(options, 'model')) {
      Object.keys(options.model).forEach((id) => {
        const model = options.model[id]
        this.model(id, model)
      })
    }

    if (Object.prototype.hasOwnProperty.call(options, 'service')) {
      Object.keys(options.service).forEach((id) => {
        const service = options.service[id]
        this.service(id, service)
      })
    }
  }
}
