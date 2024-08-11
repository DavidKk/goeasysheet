import { Trigger } from '@/decorators/trigger'
import { Extension } from '@/libs/Extension'

type TriggerType = 'daily' | 'minutely'

interface Trigger {
  type: TriggerType
  action: Function
  payload?: Record<string, any>
}

// 父类定义
class BaseA extends Extension {
  @Trigger('daily', { key: 'baseValue' })
  baseMethod() {
    // baseMethod implementation
  }
}

// 子类定义
class BaseB extends Extension {}

// 子类定义
class BaseAA extends BaseA {
  @Trigger('minutely', { key: 'derivedValue' })
  derivedMethod() {
    // derivedMethod implementation
  }
}

describe('Trigger Decorator', () => {
  it('should correctly add $trigger to instances of baseA', () => {
    const baseA = new BaseA()

    expect(baseA['$trigger']).toBeDefined()
    expect(baseA['$trigger'].length).toBe(1)
    expect(baseA['$trigger'][0].type).toBe('daily')
    expect(baseA['$trigger'][0].payload).toEqual({ key: 'baseValue' })
  })

  it('will not affect the class B', () => {
    const baseB = new BaseB()
    expect(baseB['$trigger']).not.toBeDefined()
  })

  it('should correctly add $trigger to instances of BaseAA', () => {
    const baseAA = new BaseAA()

    expect(baseAA['$trigger']).toBeDefined()
    expect(baseAA['$trigger'].length).toBe(1)
    expect(baseAA['$trigger'][0].type).toBe('minutely')
  })

  it('will not affect the class Extension', () => {
    const ext = new Extension()
    expect(ext['$trigger']).toBeUndefined()
  })
})
