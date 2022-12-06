
const nconf = require('nconf')

const os = require('os')

nconf.argv({
  parseValues: true,
  transform
})

nconf.env({
  parseValues: true,
  transform
})

const global_file = `/etc/rabbi/config.json`

const user_file = `${os.homedir()}/.rabbi/config.json`

const project_file = `${process.cwd()}/.rabbi/config.json`

nconf.add('project_file', { type: 'file', file: project_file, transform })

nconf.add('user_file', { type: 'file', file: user_file, transform })

nconf.add('global_file', { type: 'file', file: global_file, transform })

export function loadFromFiles() {

  nconf.use('project_file', { type: 'file', file: project_file, transform })

  nconf.use('user_file', { type: 'file', file: user_file, transform })

  nconf.use('global_file', { type: 'file', file: global_file, transform })

}

loadFromFiles()

process.on('SIGHUP', () => {

  loadFromFiles()

})

nconf.defaults({
  log_level: 'info',
  host: '0.0.0.0',
  port: '5200',
  prometheus_enabled: true,
  http_api_enabled: true,
  swagger_enabled: true,
  postgres_enabled: false,
  amqp_enabled: false,
  loki_enabled: false
})

export default nconf

function transform(obj) {
  return {
    key: obj.key.toLowerCase(),
    value: obj.value
  }
}

