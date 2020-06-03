import Extension from '@goaseasy/core/libs/Extension'

export interface RuntimeParams {
  extensions?: Array<{ new (...args: any[]): Extension }>
  menus?: Goaseasy.Menu[]
  triggers?: Goaseasy.Trigger[]
}
