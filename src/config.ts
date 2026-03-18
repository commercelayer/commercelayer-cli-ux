import { createRequire } from 'node:module'
import type { ActionBase } from './action/base'
import simple from './action/simple'
import spinner from './action/spinner'

export type Levels = 'debug' | 'error' | 'fatal' | 'info' | 'trace' | 'warn'

export interface ConfigMessage {
  prop: string
  type: 'config'
  value: any
}

const g: any = global
const globals = g.ux || (g.ux = {})

const actionType =
  (Boolean(process.stderr.isTTY) &&
    !process.env.CI &&
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    !['dumb', 'emacs-color'].includes(process.env.TERM!) &&
    'spinner') ||
  'simple'

const Action = actionType === 'spinner' ? spinner : simple


export class Config {
  action: ActionBase = new Action()

  errorsHandled = false

  outputLevel: Levels = 'info'

  showStackTrace = true

  get context(): any {
    return globals.context || {}
  }

  set context(v: unknown) {
    globals.context = v
  }

  get debug(): boolean {
    return globals.debug || process.env.DEBUG === '*'
  }

  set debug(v: boolean) {
    globals.debug = v
  }
}


function fetch(): Config {
  const { version } = createRequire(__filename)('@oclif/core/package.json') as { version: string }
  const major = version?.split('.')[0] ?? 'unknown'
  if (!globals[major]) globals[major] = new Config()
  return globals[major]
}



export const config: Config = fetch()
export default config
