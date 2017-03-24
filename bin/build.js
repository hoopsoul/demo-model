import Promise from 'bluebird'
import del from 'del'
import webpack from 'webpack'
import webpackConfig from './webpack.config'

function bundle() {
  return new Promise((resolve, reject) => {
    function onComplete(err, stats) {
      if (err) {
        return reject(err)
      }
      console.log(stats.toString(webpackConfig.stats))
      return resolve()
    }
    webpack(webpackConfig).run(onComplete)
  })
}

async function copy() {
  const ncp = Promise.promisify(require('ncp'))
  await ncp('src/db/patches', 'dist/patches')
}

function format(time) {
  return time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1')
}

async function build() {
  const start = new Date()
  console.log(`[${format(start)}] cleanup...`)
  await del(['.tmp', 'dist/*', '!dist/,git'], { dot: true })
  console.log(`[${format(start)}] Starting build...`)
  await bundle()
  await copy()
  const end = new Date()
  const eslapse = end.getTime() - start.getTime()
  console.log(`[${format(end)}] Finished build after ${eslapse} ms`)
}

build().catch(err => {
  console.error(err.stack)
})
