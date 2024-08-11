import { renderMenuToTreeString } from '@/utils/renderMenuToTreeString'

describe('renderMenuToTreeString', () => {
  it('should render a simple menu correctly', () => {
    const menu: Menu[] = [{ name: 'a' }]

    const result = renderMenuToTreeString(menu)
    const expected = ' └── a'
    expect(result).toBe(expected)
  })

  it('should render a menu with submenus correctly', () => {
    const menu: Menu[] = [
      {
        name: 'a',
        submenu: [{ name: 'b' }],
      },
      {
        name: 'c',
        submenu: [
          {
            name: 'c1',
            submenu: [{ name: 'c2' }],
          },
        ],
      },
    ]

    const result = renderMenuToTreeString(menu)
    const lines = result.split('\n')
    expect(lines[0]).toEqual(' ├── a')
    expect(lines[1]).toEqual(' │ └── b')
    expect(lines[2]).toEqual(' └── c')
    expect(lines[3]).toEqual('   └── c1')
    expect(lines[4]).toEqual('     └── c2')
  })

  it('should handle an empty menu array correctly', () => {
    const menu: Menu[] = []

    const result = renderMenuToTreeString(menu)
    const expected = ''
    expect(result).toBe(expected)
  })

  it('should handle nested submenus correctly', () => {
    const menu: Menu[] = [
      {
        name: 'a',
        submenu: [
          {
            name: 'b',
            submenu: [{ name: 'c' }],
          },
        ],
      },
    ]

    const result = renderMenuToTreeString(menu)
    const lines = result.split('\n')
    expect(lines[0]).toEqual(' └── a')
    expect(lines[1]).toEqual('   └── b')
    expect(lines[2]).toEqual('     └── c')
  })

  it('should handle multiple top-level menus', () => {
    const menu: Menu[] = [
      {
        name: 'a',
        submenu: [{ name: 'b' }],
      },
      {
        name: 'c',
        submenu: [{ name: 'd' }],
      },
    ]

    const result = renderMenuToTreeString(menu)
    const lines = result.split('\n')
    expect(lines[0]).toEqual(' ├── a')
    expect(lines[1]).toEqual(' │ └── b')
    expect(lines[2]).toEqual(' └── c')
    expect(lines[3]).toEqual('   └── d')
  })
})
