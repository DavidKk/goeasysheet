const GoRun = (name: string, params?: any): Promise<any> => new Promise((resolve, reject) => {
  google.script.run
  .withSuccessHandler(resolve)
  .withFailureHandler(reject)
  .bridge(name, params)
})

document.getElementById('submit').addEventListener('click', () => {
  const keyNode = document.getElementById('key') as HTMLInputElement
  const minutesNode = document.getElementById('minutes') as HTMLInputElement

  const { value: apikey } = keyNode
  const { value: minutes } = minutesNode
  GoRun('WeChatRobot.submit', { apikey, minutes }).then(() => {
    alert('保存成功')
  })
  .catch((error) => {
    alert(error.message || '保存失败')
  })
})

GoRun('WeChatRobot.fetch').then((data) => {
  const { apikey = '', minutes = 5 } = data || {}

  const keyNode = document.getElementById('key') as HTMLInputElement
  const minutesNode = document.getElementById('minutes') as HTMLInputElement

  keyNode.value = apikey
  minutesNode.value = minutes
})
