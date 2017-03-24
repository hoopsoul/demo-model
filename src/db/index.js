import pgAsPromised from 'pg-then'
import connections from './connections'
import { DbManager } from './manager'

const slice = [].slice

// configure pg
pgAsPromised.pg.defaults.parseInt8 = true

function configure(options) {
  connections.configure(options)
  return new DbManager({ connections })
}

async function query() {
  let args = slice.call(arguments)
  let connection = null
  const database = args[0]
  if (connections.postgres.hasOwnProperty(database)) {
    connection = connections.postgres[database]
    if (!connection) {
      throw new Error(`Connection[${database}] isn't existed`)
    }
    args = slice.call(arguments, 1)
  } else {
    connection = connections.postgres.default
    if (!connection) {
      throw new Error('Connection.default does not existed')
    }
  }
  let client = null
  try {
    client = pgAsPromised.Client(connection)
    return await client.query.apply(client, args)
  } catch (err) {
    throw err
  } finally {
    if (client) client.end()
  }
}

async function transaction(database, actions) {
  let connection = null
  if (typeof(database) === 'function') {
    actions = database
    connection = connections.postgres.default
  } else {
    connection = connections.postgres[database]
  }
  let client = null
  try {
    client = pgAsPromised.Client(connection)
    await client.query('BEGIN')
    const result = await actions(client)
    await client.query('COMMIT')
    return result
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    if (client) client.end()
  }
}

export default { configure, query, transaction }
