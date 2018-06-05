module.exports = parseBenny

function parseBenny (src) {
  src = src.toString()

  var result = []
  var ptr = 0
  var cnt = 0

  while (ptr < src.length) {
    var line = parseBennyLine()
    if (!line.length) continue
    var cmd = parseBennyCommand(line, cnt++)
    if (!cmd) continue
    result.push(cmd)
  }

  return result

  function parseBennyCommand (line, cnt) {
    var i = line.indexOf(' ')
    if (i === -1) i = line.length
    var type = line.slice(0, i).toLowerCase()
    var ptr = 0

    if (type[0] === '#') return null

    line = line.slice(i + 1).trim()

    if (type === 'force') {
      var next = parseBennyCommand(line, cnt)
      next.force = true
      return next
    }

    switch (type) {
      case 'via':
        var path = /[./"'`]/.test(line[0]) ? parseBennyString() : null
        var image = path ? null : line.split(':')[0]
        var version = path ? null : line.split(':')[1] || null
        return {type: type, image: image, version: version, path: path}
      case 'in':
        return {type: type, env: parseBennyKeyValue()}
      case 'do':
        return parseBennyArg()
      case 'go':
        return {type: type, command: line}
      case 'to':
        return {type: type, from: parseBennyString(), to: parseBennyString()}
      default:
        throw new Error('Unknown type: ' + type + ' at line ' + cnt)
    }

    function parseBennyArg () {
      // ARG NAME=VALUE?
      var i = line.indexOf('=', ptr)
      if (i === -1) return {type: 'do', key: parseBennyString(), value: null}
      return {type: 'do', key: parseBennyKey(), value: parseBennyString()}
    }

    function parseBennyKeyValue () {
      var env = []
      var i = line.indexOf('=', ptr)
      var space = line.indexOf(' ', ptr)

      if (i === -1 || (space < i && space > -1)) {
        // ENV NAME VALUE
        env.push({key: parseBennyString(), value: parseBennyString()})
      } else {
        // ENV NAME=VALUE
        while (ptr < line.length) {
          env.push({key: parseBennyKey(), value: parseBennyString()})
        }
      }

      return env
    }

    function parseBennyKey () {
      var i = line.indexOf('=', ptr)
      if (i === -1) throw new Error('Expected key=value at line ' + cnt)
      var key = line.slice(ptr, i).trim()
      ptr = i + 1
      return key
    }

    function parseBennyString () {
      for (; ptr < line.length; ptr++) {
        if (!/\s/.test(line[ptr])) break
      }

      if (ptr === line.length) throw new Error('Expected string at line ' + cnt)

      var end = /["'`]/.test(line[ptr]) ? line[ptr++] : ' '
      var prev = ptr
      var skip = false
      var tmp = ''

      for (; ptr < line.length; ptr++) {
        if (skip) {
          prev = ptr
          skip = false
          continue
        }
        if (line[ptr] === '\\') {
          tmp += line.slice(prev, ptr)
          prev = ptr
          skip = true
          continue
        }
        if (line[ptr] === end) {
          return tmp + line.slice(prev, ptr++)
        }
      }

      if (end !== ' ') throw new Error('Missing ' + end + ' at line ' + cnt)
      return tmp + line.slice(prev)
    }
  }

  function parseBennyLine () {
    for (; ptr < src.length; ptr++) {
      if (!/\s/.test(src[ptr])) break
    }

    var prev = ptr
    var lines = []

    for (; ptr < src.length; ptr++) {
      if (src[ptr] === '\\' && src[ptr + 1] === '\r' && src[ptr + 2] === '\n') {
        lines.push(src.slice(prev, ptr).trim())
        ptr += 2
        prev = ptr + 2
        continue
      }
      if (src[ptr] === '\\' && src[ptr + 1] === '\n') {
        lines.push(src.slice(prev, ptr).trim())
        ptr++
        prev = ptr + 1
        continue
      }
      if (src[ptr] === '\n') {
        break
      }
    }

    if (prev < ptr) lines.push(src.slice(prev, ptr).trim())
    return lines.join(' ').trim()
  }
}
