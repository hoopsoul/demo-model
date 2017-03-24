import fs from 'fs'
import path from 'path'

export class DbManager {
  constructor(data) {
    this.connections = data.connections
    this.version = data.version
  }

  async dropDbIfExists() {
    const dbname = this.connections.postgres.default.db
    const queryTerminate = `
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = $1
      ;`
    /* eslint-disable no-undef */
    await db.query('postgres', queryTerminate, [dbname])
    const queryDrop = `DROP DATABASE IF EXISTS "${dbname}";`
    await db.query('postgres', queryDrop)
  }

  async createDbIfNotExists() {
    if (!this.connections.postgres.postgres) return // Can't create database
    const dbname = this.connections.postgres.default.db
    const queryCheck = `
      SELECT 1 AS exists
      FROM pg_database
      WHERE datname = $1
      `
    const result = await db.query('postgres', queryCheck, [dbname])
    if (result.rowCount === 0) {
      const queryCreate = `CREATE DATABASE "${dbname}"`
      await db.query('postgres', queryCreate)
    }
  }

  async getCurrentVersion() {
    const queryCheck = `
      SELECT 1 AS exists FROM pg_class WHERE relname = 'version';
    `
    const resultCheck = await db.query(queryCheck)
    if (resultCheck.rowCount === 0) {
      return -1
    }
    const queryGetVersion = 'SELECT ver FROM version ORDER BY ver DESC LIMIT 1;'
    const resultVersion = await db.query(queryGetVersion)
    if (resultVersion.rowCount === 0) {
      return -1
    }
    const currentVer = resultVersion.rows[0].ver
    this.version = currentVer
    return currentVer
  }

  async getPatchFolders() {
    const patchMainPath = path.join(__dirname, 'patches')
    const currentVer = await this.getCurrentVersion()
    const clusters = fs.readdirSync(patchMainPath)
    const patchFolders = []
    for (const c of clusters) {
      if (c.charAt(0) === '.') continue
      const folders = fs.readdirSync(path.join(patchMainPath, c))
      for (const f of folders) {
        if (f.charAt(0) === '.') continue
        const ver = Number.parseFloat(f)
        if (ver > currentVer) {
          patchFolders.push([ver, path.join(patchMainPath, c, f)])
        }
      }
    }
    patchFolders.sort((a, b) => {
      return a[0] - b[0]
    })
    return patchFolders
  }

  async updateVersion(client, patchVer) {
    const currentVer = await this.getCurrentVersion()
    if (patchVer <= currentVer) return
    const query = 'INSERT INTO version (ver) VALUES ($1);'
    await client.query(query, [patchVer])
    this.version = patchVer
  }

  async update() {
    await this.createDbIfNotExists()
    const patchFolders = await this.getPatchFolders()
    await db.transaction(async (client) => {
      for (const patchFolder of patchFolders) {
        const patchVer = patchFolder[0]
        const patchPath = patchFolder[1]
        const ver = await this.getCurrentVersion()
        if (patchVer <= ver) continue
        const files = fs.readdirSync(patchPath)
        if (files.includes('update.js')) {
          const updatorPath = '.' + path.join(patchPath, 'update.js').slice(__dirname.length)
          const updator = require(updatorPath)
          await updator.putPatch(client)
        } else if (files.includes('query.sql')) {
          const query = fs.readFileSync(path.join(patchPath, 'query.sql'), 'utf8')
          await client.query(query)
        } else {
          continue
        }
        await this.updateVersion(client, patchVer)
      }
    })
  }

  async rebuild() {
    await this.dropDbIfExists()
    await this.update()
  }
}
