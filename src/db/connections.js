const connections = {
  postgres: {},
  redis: {},
}

function init(type, name, options) {
  if (name === 'default') {
    throw new Error('databse name "default" is reserved.')
  }
  const arr = [type === 'postgres' ? 'postgresql' : type, '://']
  const credentials = options.credentials
  if (credentials) {
    if (credentials.username) {
      arr.push(options.credentials.username)
    } else if (type === 'postgres') {
      throw new Error('Missing username in postgres credentials')
    }
    if (credentials.password) {
      arr.push(':')
      arr.push(options.credentials.password)
    }
    arr.push('@')
  }
  arr.push(options.host)
  if (options.port) {
    arr.push(':')
    arr.push(options.port)
  }
  const server = arr.join('')
  arr.push('/')
  arr.push(options.db)
  const connection = {
    server,
    db: options.db,
    database: options.db,
    string: arr.join(''),
    host: options.host,
    port: options.port,
    options: options.options,
    default: options.default,
  }
  if (credentials) {
    if (credentials.username) {
      connection.user = credentials.username
    }
    if (credentials.password) {
      connection.password = credentials.password
    }
  }
  connections[type][name] = connection
  if (connection.default) {
    connections[type].default = connection
  }
}

function configure(config) {
  for (const type in config) {
    const typedConfig = config[type]
    for (const name in typedConfig) {
      const options = typedConfig[name]
      options.default = options.default || Object.keys(typedConfig).length === 1
      init(type, name, options)
    }
  }
}

export default {
  configure,
  postgres: connections.postgres,
  redis: connections.redis,
}
