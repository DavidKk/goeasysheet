/** 渲染菜单 */
export function renderMenuToTreeString(menus: Menu[], level = 0, prefix = ' '): string {
  const lines = Array.from(
    (function* () {
      for (let index = 0; index < menus.length; index++) {
        const item = menus[index]
        const isLast = index === menus.length - 1
        const currentPrefix = `${prefix}${isLast ? '└── ' : '├── '}`
        // 添加当前菜单项的前缀和名称
        yield `${currentPrefix}${item.name}`

        if (!(item.submenu && item.submenu.length > 0)) {
          continue
        }

        const childPrefix = `${prefix}${isLast ? '  ' : '│ '}`
        yield renderMenuToTreeString(item.submenu, level + 1, childPrefix)
      }
    })()
  )

  return lines.join('\n')
}
