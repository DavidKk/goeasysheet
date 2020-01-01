const GoRun = (name: string, params?: any): Promise<any> => new Promise((resolve, reject) => {
  google.script.run
  .withSuccessHandler(resolve)
  .withFailureHandler(reject)
  .bridge(name, params)
})

document.getElementById('submit').addEventListener('click', () => {
  const keyNode = document.getElementById('key') as HTMLInputElement
  const { value: apikey } = keyNode
  GoRun('WeChatRobot.submit', { apikey }).then(() => {
    alert('保存成功')
  })
  .catch((error) => {
    alert(error.message || '保存失败')
  })
})

GoRun('WeChatRobot.fetch').then((data) => {
  const { apikey = '' } = data || {}
  const keyNode = document.getElementById('key') as HTMLInputElement
  keyNode.value = apikey
})
