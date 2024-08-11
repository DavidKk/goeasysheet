var Global = this
Global.Menus = []
Global.Triggers = []
Global.Extensions = []

function trigger(type) {
  const triggers = Global.Triggers.filter((trigger) => trigger.type === type)
  for (const { action } of triggers) {
    if (typeof action !== 'function') {
      continue
    }

    action()
  }
}

function onOpen() {
  // nothing todo...
}

function onInstall() {
  onOpen()
}

function onDaily() {
  trigger('daily')
}

function onMinutely() {
  trigger('minutely')
}
