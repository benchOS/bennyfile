var tape = require('tape')
var parseBenny = require('./parseBenny')
var jsonBenny = require('./jsonBenny')

tape('BennyFile Tests: parses', function (t) {
  var parsedBenny = parseBenny(`
    VIA ubuntu:precise
    GO rm -f /etc/resolv.conf && echo '8.8.8.8' > /etc/resolv.conf
    GO apt-get update
    GO apt-get install -y python-software-properties && \\
      add-apt-repository -y ppa:ubuntu-toolchain-r/test && \\
      apt-get update
    GO apt-get install -y g++-4.8 g++-4.8-multilib gcc-4.8-multilib && \\
      update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.8 50
    GO foo \\
      bar \\
      baz
    TO ./start.js /root/start.js
    TO "./start.js" /root/start.js
    TO " a b c " 'd e f'
    TO foo\\ bar.js baz
  `)

  var expected = [{
    type: 'via',
    image: 'ubuntu',
    version: 'precise',
    path: null
  }, {
    type: 'go',
    command: 'rm -f /etc/resolv.conf && echo \'8.8.8.8\' > /etc/resolv.conf'
  }, {
    type: 'go',
    command: 'apt-get update'
  }, {
    type: 'go',
    command: 'apt-get install -y python-software-properties && add-apt-repository -y ppa:ubuntu-toolchain-r/test && apt-get update'
  }, {
    type: 'go',
    command: 'apt-get install -y g++-4.8 g++-4.8-multilib gcc-4.8-multilib && update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.8 50'
  }, {
    type: 'go',
    command: 'foo bar baz'
  }, {
    type: 'to',
    from: './start.js',
    to: '/root/start.js'
  }, {
    type: 'to',
    from: './start.js',
    to: '/root/start.js'
  }, {
    type: 'to',
    from: ' a b c ',
    to: 'd e f'
  }, {
    type: 'to',
    from: 'foo bar.js',
    to: 'baz'
  }]

  t.same(parsedBenny.length, expected.length)
  for (var i = 0; i < parsedBenny.length; i++) {
    t.same(parsedBenny[i], expected[i])
  }
  t.end()
})

tape('BennyFile Tests: force', function (t) {
  t.same(parseBenny('FORCE GO foo'), [{type: 'go', command: 'foo', force: true}])
  t.end()
})

tape('BennyFile Tests: other from', function (t) {
  t.same(parseBenny('VIA ./path'), [{type: 'via', image: null, version: null, path: './path'}])
  t.same(parseBenny('VIA "./path space"'), [{type: 'via', image: null, version: null, path: './path space'}])
  t.end()
})

tape('BennyFile Tests: do', function (t) {
  t.same(parseBenny('DO foo=bar\nDO foo'), [{
    type: 'do',
    key: 'foo',
    value: 'bar'
  }, {
    type: 'do',
    key: 'foo',
    value: null
  }])
  t.end()
})

tape('BennyFile Tests: in', function (t) {
  t.same(parseBenny('IN key value'), [{
    type: 'in',
    env: [{
      key: 'key',
      value: 'value'
    }]
  }])

  t.same(parseBenny('IN key=value'), [{
    type: 'in',
    env: [{
      key: 'key',
      value: 'value'
    }]
  }])

  t.same(parseBenny('IN key1=value1 key2=value2'), [{
    type: 'in',
    env: [{
      key: 'key1',
      value: 'value1'
    }, {
      key: 'key2',
      value: 'value2'
    }]
  }])

  t.end()
})

tape('BennyFile Tests: jsonBenny Object', function (t) {
  t.same(jsonBenny([{type: 'via', image: 'arch'}]), 'VIA arch\n')

  var input = [{
    type: 'via',
    path: './foo'
  }, {
    type: 'do',
    key: 'foo',
    value: 'bar'
  }, {
    type: 'go',
    command: 'echo hello'
  }, {
    type: 'to',
    from: 'a',
    to: 'b'
  }, {
    type: 'in',
    env: [{
      key: 'hello',
      value: 'world'
    }, {
      key: 'key',
      value: 'bunch of spaces'
    }]
  }]

  t.same(jsonBenny(input), 'VIA "./foo"\nDO foo="bar"\nGO echo hello\nTO "a" "b"\nIN hello="world" key="bunch of spaces"\n')
  t.same(noNull(parseBenny(jsonBenny(input))), input)
  t.end()
})

function noNull (inp) {
  inp.forEach(function (i) {
    Object.keys(i).forEach(function (k) {
      if (i[k] === null) delete i[k]
    })
  })
  return inp
}
