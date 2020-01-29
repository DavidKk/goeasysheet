const Global = this

Global.Menus = []
Global.Triggers = []
Global.Extensions = []

function onInstall (): void {
  onOpen()
}

function onOpen (): void {
}

function onDaily (): void {
  trigger('daily')
}

function onMinutely (): void {
  trigger('minutely')
}

function trigger (type: string): void {
  Global.Triggers.filter((trigger) => trigger.type === type).forEach((trigger) => {
    typeof trigger.action === 'function' && trigger.action()
  })
}
