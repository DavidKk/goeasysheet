export default function useMenu (name: string) {
  function Decorator <T extends { new(...args: any[]): any }>(constructor: T): T
  function Decorator (target: { [key: string]: any }, propertyKey: string, descriptor: PropertyDescriptor): void
  function Decorator (...args: any[]): any {
    switch (args.length) {
      case 3: {
        const target: { [key: string]: any } = args[0]
        const descriptor: PropertyDescriptor = args[2]

        !Array.isArray(target.$menu) && Object.defineProperty(target, '$menu', { writable: false, value: [] })
        target.$menu.push({ name, action: descriptor.value })
        break
      }

      case 1: {
        const Constructor: { new(...args: any[]): any } = args[0]
        const menus = Constructor.prototype.$menu

        !Array.isArray(Global.Menus) && Object.defineProperty(Global, 'Menus', { writable: false, value: [] })

        return class MenuWrapper extends Constructor {
          constructor (...args: any[]) {
            super(...args)

            const submenu = Array.isArray(menus) ? menus.map(({ name, action }) => ({ name, action: (...args: any[]) => action.apply(this, args) })) : []
            Global.Menus.push({ name, submenu })
          }
        }
      }
    }
  }

  return Decorator
}
