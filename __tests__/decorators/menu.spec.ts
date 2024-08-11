import { Action } from '@/decorators/menu'
import { Extension } from '@/libs/Extension'

// 父类定义
class BaseA extends Extension {
  @Action('baseAction')
  baseMethod() {
    // baseMethod implementation
  }
}

// 子类定义
class BaseB extends Extension {}

// 子类定义
class BaseAA extends BaseA {
  @Action('derivedAction')
  derivedMethod() {
    // derivedMethod implementation
  }
}

describe('Action Decorator', () => {
  it('should correctly add $menu to instances of BaseA', () => {
    const baseA = new BaseA()

    expect(baseA['$menu']).toBeDefined()
    expect(baseA['$menu'].length).toBe(1)
    expect(baseA['$menu'][0].name).toBe('baseAction')
    expect(baseA['$menu'][0].action).toBe(baseA.baseMethod)
  })

  it('will not affect the class BaseB', () => {
    const baseB = new BaseB()
    expect(baseB['$menu']).toBeUndefined()
  })

  it('should correctly add $menu to instances of BaseAA', () => {
    const baseAA = new BaseAA()

    expect(baseAA['$menu']).toBeDefined()
    expect(baseAA['$menu'].length).toBe(1)
    expect(baseAA['$menu'][0].name).toBe('derivedAction')
  })

  it('will not affect the class Extension', () => {
    const ext = new Extension()
    expect(ext['$menu']).toBeUndefined()
  })
})
