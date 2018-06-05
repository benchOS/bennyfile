module.exports = jsonBenny

function jsonBenny (parsedBenny) {
  return parsedBenny.map(function (cmd) {
    var prefix = cmd.force ? 'FORCE ' : ''

    switch (cmd.type) {
      case 'via':
        if (cmd.path) return prefix + 'VIA ' + JSON.stringify(cmd.path) + '\n'
        return prefix + 'VIA ' + cmd.image + (cmd.version ? ':' + cmd.version : '') + '\n'
      case 'go':
        return prefix + 'GO ' + cmd.command + '\n'
      case 'in':
        return prefix + 'IN ' + cmd.env.map(toKeyValue).join(' ') + '\n'
      case 'do':
        return prefix + 'DO ' + cmd.key + (cmd.value ? '=' + JSON.stringify(cmd.value) : '') + '\n'
      case 'to':
        return prefix + 'TO ' + JSON.stringify(cmd.from) + ' ' + JSON.stringify(cmd.to) + '\n'
      default:
        throw new Error('Unknown type: ' + cmd.type)
    }
  }).join('')
}

function toKeyValue (env) {
  return env.key + '=' + JSON.stringify(env.value)
}
