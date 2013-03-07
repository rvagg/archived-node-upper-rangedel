const levelup = require('levelup')
    , test    = require('downer-rangedel/test')

require('./').use() // initialize this plugin

var collectEntries = function (db, callback) {
      var rs = db.readStream()
        , data = []
      rs.on('data', function (_data) {
          if (_data.key == +_data.key) _data.key = +_data.key
          data.push(_data)
        })
        .on('close', callback.bind(null, null, data))
        .on('error', callback)
    }

test(levelup, collectEntries)