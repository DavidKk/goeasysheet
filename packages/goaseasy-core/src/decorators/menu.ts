export default function useMenu (name: string) {
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
        Constructor.prototype.$menu.push({ name, submenu })

        return Constructor
      }
    }
  }

  return Decorator
}
