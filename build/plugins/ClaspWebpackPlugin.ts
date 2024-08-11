import fs from 'fs'
import path from 'path'
import type { SpawnOptions } from 'child_process'
import { spawn } from 'child_process'
import type { Compiler } from 'webpack'
import { rootDir, outDir } from '../constants/conf'

export default class ClaspWebpackPlugin {
  static PLUGIN_NAME = 'clasp-webpack-plugin'

  public mode: string
  public target: string
  public tsconfig: string
  public output: string
  public json: string | boolean

  constructor() {
    const cert = path.join(rootDir, '.clasprc.json')
    if (!fs.existsSync(cert)) {
      throw new Error(`File "${cert}" is not found, please execute "clasp login" fist.`)
    }
  }

  public apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tapPromise(ClaspWebpackPlugin.PLUGIN_NAME, async () => {
      await this.command(['push', '-f'])
    })
  }

  private command(commands: string | string[]) {
    return new Promise((resolve, reject) => {
      const options: SpawnOptions = {
        stdio: 'inherit',
        cwd: outDir,
      }

      const cp = spawn('clasp', Array.isArray(commands) ? commands : [commands], options)
      cp.on('error', reject)
      cp.on('close', resolve)
    })
  }
}
