export function useMenu (name: string) {
  function Decorator <T extends { new(...args: any[]): any }>(constructor: T): T
  function Decorator (target: { [key: string]: any }, propertyKey: string, descriptor: PropertyDescriptor): void
  function Decorator (...args: any[]): any {
    switch (args.length) {
      case 3: {
        const target: { [key: string]: any } = args[0]
        const descriptor: PropertyDescriptor = args[2]

        !Array.isArray(target.$menu) && Object.defineProperty(target, '$menu', { writable: true, value: [] })
        target.$menu.push({ name, action: descriptor.value })
        break
      }

      case 1: {
        const Constructor: { new(...args: any[]): any } = args[0]
        const submenu = Constructor.prototype.$menu

        !Array.isArray(submenu) && Object.defineProperty(Constructor.prototype, '$menu', { writable: true, value: [] })
        Constructor.prototype.$menu = [{ name, submenu }]

        return Constructor
      }
    }
  }

  return Decorator
}

export function useTrigger (type: Get<Goaseasy.Trigger, 'type'>, payload?: { [key: string]: any }) {
  return function (target: { [key: string]: any }, _propertyKey: string, descriptor: PropertyDescriptor): void {
    !Array.isArray(target.$trigger) && Object.defineProperty(target, '$trigger', { writable: true, value: [] })
    target.$trigger.push({ type, payload, action: descriptor.value })
  }
}
