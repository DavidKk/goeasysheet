// eslint-disable-next-line no-var
var Global: Goaseasy.Global = this as any
Global.Menus = []
Global.Triggers = []
Global.Extensions = []

function trigger (type: Get<Goaseasy.Trigger, 'type'>): void {
  Global.Triggers.filter((trigger) => trigger.type === type).forEach((trigger) => {
    typeof trigger.action === 'function' && trigger.action()
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onOpen (): void {
  // nothing todo...
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onInstall (): void {
  onOpen()
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onDaily (): void {
  trigger('daily')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onMinutely (): void {
  trigger('minutely')
}
