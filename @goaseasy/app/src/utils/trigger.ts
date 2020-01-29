let GlobalTriggerActionId = 0

export function createTriggers (triggers: Goaseasy.Trigger[]) {
  triggers.forEach((trigger) => {
    const alias = `__TRIGGER_ACTION_${(++ GlobalTriggerActionId).toString(32)}`
    Global[alias] = trigger.action
  })
}
