import fs from 'fs'
import path from 'path'
import { spawn, SpawnOptions } from 'child_process'
import { Compiler, Plugin } from 'webpack'
import { rootDir, outDir } from '../constants/conf'

export default class ClaspWebpackPlugin implements Plugin {
  public mode: string
  public target: string
  public tsconfig: string
  public output: string
  public json: string | boolean

  static toString (): string {
    return 'clasp-webpack-plugin'
  }

  constructor () {
    const cert = path.join(rootDir, '.clasprc.json')
    if (!fs.existsSync(cert)) {
      throw new Error('File .clasprc.json is not found, please execute `clasp login` fist.')
    }
  }

  public apply (compiler: Compiler) {
    compiler.hooks.afterEmit.tapPromise(ClaspWebpackPlugin.toString(), () => this.command(['push']))
  }

  private command (commands: string | string[]) {
    return new Promise((resolve, reject) => {
      const options: SpawnOptions = {
        stdio: 'inherit',
        cwd: outDir
      }

      const cp = spawn('clasp', Array.isArray(commands) ? commands : [commands], options)
      cp.on('error', reject)
      cp.on('close', resolve)
    })
  }
}
