# Unix Time Track for HiGlass

> Display human readable unix epoch time.

[![HiGlass](https://img.shields.io/badge/higlass-👍-red.svg?colorB=0f5d92)](http://higlass.io)
[![Build Status](https://travis-ci.org/manzt/higlass-unix-time-track.svg?branch=master)](https://travis-ci.org/manzt/higlass-unix-time-track)

![HiGlass showing times](/screenshot.png?raw=true)

**Note**: This is the source code for the unix time track only! You might want to check out the following repositories as well:

- HiGlass viewer: https://github.com/hms-dbmi/higlass
- HiGlass server: https://github.com/hms-dbmi/higlass-server
- HiGlass docker: https://github.com/hms-dbmi/higlass-docker

## Installation

```
npm install higlass-unix-time-track
```

## Usage

1. Make sure you load this track prior to `hglib.js`. For example:

```
<script src="higlass-unix-time-track.js"></script>
<script src="hglib.js"></script>
<script>
  ...
</script>
```

2. Now, configure the track in your view config and be happy! Cheers 🎉

```
{
  ...
  {
    server: 'http://localhost:8001/api/v1',
    tilesetUid: 'time-interval.json',
    uid: 'blah',
    type: 'unix-time-track',
    options: {

    },
  },
  ...
}
```

Take a look at [`src/index.html`](src/index.html) for an example. (The unix time track does not require a dataset, so the server url acts as a placeholder in this view config. A track will not load without a server url. To configure a custom track for your own dataset, start a local [HiGlass Server](https://github.com/hms-dbmi/higlass-server).)

## Development

### Installation

```bash
$ git clone https://github.com/manzt/higlass-unix-time-track && cd higlass-unix-time-track
$ npm install
```

### Commands

**Developmental server**: `npm start`
**Production build**: `npm run build`
