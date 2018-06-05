# Bennyfile (Benfile Parser For Benny)
[![benOSShield-Official](https://img.shields.io/badge/benOS-Native-brightgreen.svg)](https://github.com/benchOS/benOS)[![benOSShield-Utils](https://img.shields.io/badge/benOS-Utils-brightgreen.svg)](https://github.com/benchOS/benOS)[![benOSShield-Utils](https://img.shields.io/badge/benOS-Benny-blue.svg)](https://github.com/benchOS/benOS)[![build status](http://img.shields.io/travis/benchOS/bennyfile.svg?style=flat)](http://travis-ci.org/benchOS/bennyfile)[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![benOSRepoHeader](https://raw.githubusercontent.com/benchOS/benchOS-design/master/repo-headers/benos-bennyfile-header.png)](https://github.com/benchOS/bennyfile)
<br>
`Benfile` parsing library that converts a `Benfile` to a JSON object and then back to the original format.


## Table of Contents

- [Background](#background)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Related Projects](#related-projects)
- [Why Decentralized Internet](#why-the-internet-must-have-a-decentralized-alternative)
- [Bench On The dWeb](#bench-on-the-dweb)
- [License](#license)
- [Copyright](#license)

## Background
`Benfiles` are basically installer-steps for [Benny](https://github.com/benchOS/benny), benOS' native container builder and management software. This library was created to parse and delivery the installation steps within a `Benfile` in JSON format, to Benny for execution.

[![benOSRepoHeader](https://raw.githubusercontent.com/benchOS/benchOS-design/master/terminal-screens/bennyfile.png)](https://github.com/benchOS/bennyfile)


### With NPM
```
npm install bennyfile
```

### With YARN
```
yarn add bennyfile
```

## Usage

``` js
var bennyfile = require('bennyfile')

var parsedBenny = bennyfile.parseBenny(`
  FROM ubuntu:xenial
  RUN rm -f /etc/resolv.conf && echo '8.8.8.8' > /etc/resolv.conf
  RUN apt-get update
  RUN apt-get install -y git vim curl
  RUN curl -fs https://raw.githubusercontent.com/benchOS/getnjs/master/go | sh
  RUN node-install 8.9.1
`)

// prints the parsedBenny file
console.log(parsedBenny)

// serializes it again
console.log(bennyfile.stringify(parsedBenny))
```

## Syntax

The `Benfile` formatting is similar to a `Dockerfile`, just easier and shorter.

```
VIA os:version
GO shell-command
TO from/local/file /to/container/path
IN key=value key2=value2
DO key=value
```

Alternatively if you are referencing another `Benfile` or disk image you can do

```
VIA ./path/to/disk/image/or/Benfile
```

If your shell command is long you can split it into multiple lines using the familiar `\\` syntax

```
GO apt-get update && \\
  apt-get install -y git vim curl
```

To comment out a line add `#` infront.

To force run a command (i.e. cache bust it) you can prefix any command with `FORCE`.

## API

#### `var parsedBenny = bennyfile.parseBenny(string)`

Parse the content of a `Benfile`.
Returns an array of objects, each representing a line.

``` js
// VIA os:version
{
  type: 'via',
  image: 'os',
  version: 'version',
  path: null
}

// VIA ./path
{
  type: 'via',
  image: null,
  version: null,
  path: './path'
}

// GO command
{
  type: 'go',
  command: 'command'
}

// TO from to
{
  type: 'to',
  from: 'from',
  to: 'to'
}

// IN key=value key2="value 2" ...
{
  type: 'in',
  env: [{
    key: 'key',
    value: 'value'
  }, {
    key: 'key2',
    value: 'value 2'
  }]
}

// DO key=value
{
  type: 'do',
  key: 'key',
  value: 'value'
}

// DO key
{
  type: 'do',
  key: 'key',
  value: null
}
```

If a command is prefixed with `FORCE`, `force: true` will be set on the object.

#### `var str = bennyfile.stringify(parsedBenny)`

Convert a `parsedBenny` JS object (JSON Formatted version of Benfile) back to the original `Benfile` format


## Related Projects
- [benOS](https://github.com/benchOS/benOS) - benOS Decentralized Operating System
- [benny](https://github.com/benchOS/dpack-logger) - benOS Native Container Builder
- [gospawn](https://github.com/distributedweb/gospawn) - Bootstrap Spawner For Benny
- [bennyfile](https://github.com/distributedweb/bennyfile) - Build File Library For Benny Containers
- [thinbit](https://github.com/distributedweb/buffgap) - BitField Library For Benny

## Why The Internet Must Have A Decentralized Alternative
Today, the internet is more censored than ever and it's only getting worse. Our mission with the [dWeb Protocol](https://github.com/distributedweb/dweb) was to create a truly powerful P2P protocol, around [benOS](https://github.com/benchOS/benos), [dBrowser](https://github.com/benchOS/dbrowser) and many of benOS' underlying libraries to bring the most powerful P2P products to life. In the last few months, by rebuilding P2P technologies that have existed since the early 2000s, we have built a powerful suite of decentralized libraries for benOS and the Bench Network, that will only improve over time. But we also brought new ideas to life, like:

- [dDrive](https://github.com/distributedweb/ddrive)
- [dExplorer](https://github.com/distributedweb/dexplorer)
- [dDatabase](https://github.com/distributedweb/ddatabase)
- [dSites](https://github.com/distributedweb/dsites)
- [dPack](https://github.com/distributedweb/dpack)
- [benFS](https://github.com/benchOS/benfs)
- [DCDN](https://github.com/distributedweb/dcdn)
- [Rocketainer](https://github.com/distributedweb/rocketainer)
- [RocketOS](https://github.com/distributedweb/rocketos)
- [dNames](https://github.com/distributedweb/dnames)
- [P2PDNS](https://github.com/distributedweb/p2pdns)
- [dWebFS](https://github.com/distributedweb/dwebfs)
- [dWebDB](https://github.com/distributedweb/dwebdb)
- [MeteorIDE](https://github.com/distributedweb/meteorIDE)
- [Kepler](https://github.com/benchlab/kepler)
- [Neutron](https://github.com/benchlab/neutron)
- [Designate](https://github.com/benchlab/designate)
- [Nova](https://github.com/benchlab/nova)

and more! These were the protocols and libraries that we needed to create a completely decentralized operating system, where everything was distributed, protected and people were once again in control of their data. benOS is made up of over 1100+ different libraries that we are releasing on a day-by-day basis as we move them to a stable/production state. While financial support is great for this open source project, we need developers who want to be some of the first to build the `dApps` and `dSites` of the future. We have to take back what our forefathers originally designed for freedom, by making our code the law, instead of releasing weak and highly centralized applications where law cannot be applied because the code lacks the foundation to implement a legal framework for itself. Join us for a truly historic journey on the [BenchLabs Telegram](https://t.me/benchlabs). See you there.

### Bench On The dWeb
[dweb://bench.dnames.io](dweb://bench.dnames.io) // dNames Short Link
[dweb://3EDAE09848B77401445B7739CAFCE442DDE1752AED63025A1F94E6A86D7E9F04](dweb://3EDAE09848B77401445B7739CAFCE442DDE1752AED63025A1F94E6A86D7E9F04) // dWeb Key Link

In order to make the links above clickable or to view these links period, you will need [dBrowser](https://github.com/benchOS/dbrowser) (Available for Mac OSX, Linux, Windows and soon to be available on iOS/Android)

#### "The Code Is The Law" - Stan Larimer - Godfather of BitShares.

## License
[MIT](LICENSE.md)
<br><br>
[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
<br>
[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://js.distributedwebs.org)
<br>
[![dWebShield](https://github.com/benchlab/dweb-shields/blob/master/shields/dweb-protocol-shield.svg)](https://github.com/distributedweb/dweb)

## Copyright
Copyright (c) 2018 Bench Open Systems. All rights reserved.
