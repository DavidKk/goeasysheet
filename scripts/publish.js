const path = require('path')
const cp = require('child_process')
const branch = cp.execSync('git rev-parse --abbrev-ref HEAD').toString('utf-8').replace(/\n/g, '')

if (branch === 'master') {
  const sourceDir = path.join(__dirname, '../googlescripts')
  cp.execSync(`cd ${sourceDir} && clasp push`, { stdio: 'inherit' })
}
