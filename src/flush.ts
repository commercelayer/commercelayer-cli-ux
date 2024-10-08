import { error } from "@oclif/core/lib/errors"


async function timeout(p: Promise<any>, ms: number): Promise<any> {
  async function wait(ms: number, unref = false): Promise<any> {
    return new Promise((resolve) => {
      const t: any = setTimeout(() => { resolve(null); }, ms)
      if (unref) t.unref()
    })
  }

  return Promise.race([p, wait(ms, true).then(() => error('timed out'))])
}

async function _flush(): Promise<any> {
  const p = new Promise((resolve) => {
    process.stdout.once('drain', () => { resolve(null); })
  })
  const flushed = process.stdout.write('')

  if (flushed) return

  return p
}

export async function flush(ms = 10_000): Promise<void> {
  await timeout(_flush(), ms)
}
