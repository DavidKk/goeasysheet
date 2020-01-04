export default function Bridge <T extends Object>(target: T, propertyKey: string, descriptor: PropertyDescriptor) {
  const { name } = target.constructor
  const namespace = `${name}.${propertyKey}`

  if (!GlobalBridges[namespace]) {
    GlobalBridges[namespace] = (...args: any[]) => {
      return typeof descriptor.value === 'function'
      ? descriptor.value.call(target, ...args)
      : descriptor.value
    }
  }
}
