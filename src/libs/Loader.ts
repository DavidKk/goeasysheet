class Loader {
  private models: { [key: string]: Model }
  private controllers: { [key: string]: Controller }
  private services: { [key: string]: Service }

  public getCollectionByType (type: string): { [key: string]: Model | Controller | Service } {
    switch (type.toLowerCase()) {
      case 'model':
        return this.models
      case 'controller':
        return this.controllers
      case 'service':
        return this.services
      default:
        return {}
    }
  }

  public load (type: string, id: string): Model | Controller | Service {
    const collection = this.getCollectionByType(type)
    const Module = collection[id]
    if (typeof Module === 'function') {
      return collection[id]
    }

    return Module
  }

  public loadModel (id: string): Model {
    return this.load('model', id)
  }

  public loadController (id: string): Controller {
    return this.load('controller', id)
  }

  public loadService (id: string): Service {
    return this.load('service', id)
  }
}
