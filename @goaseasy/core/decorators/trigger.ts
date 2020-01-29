export default function useTrigger (type: Get<Goaseasy.Trigger, 'type'>, payload?: { [key: string]: any }) {
  return function (target: { [key: string]: any }, _propertyKey: string, descriptor: PropertyDescriptor): void {
    !Array.isArray(target.$trigger) && Object.defineProperty(target, '$trigger', { writable: true, value: [] })
    target.$trigger.push({ type, payload, action: descriptor.value })
  }
}
