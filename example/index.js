require('upper-rangedel').use()

var levelup = require('levelup')
  , db      = levelup('/tmp/foo.db')
  , data    = [
        { type: 'put', key: 'α', value: 'alpha' }
      , { type: 'put', key: 'β', value: 'beta' }
      , { type: 'put', key: 'γ', value: 'gamma' }
      , { type: 'put', key: 'δ', value: 'delta' }
      , { type: 'put', key: 'ε', value: 'epsilon' }
    ]
  , printdb = function (callback) {
      db.readStream()
        .on('data', console.log)
        .on('close', callback)
        .on('error', callback)
    }

db.batch(data, function (err) {
  if (err) throw err
  console.log('INITIAL DATABASE CONTENTS:')
  printdb(function (err) {
    if (err) throw err
    db.rangeDel({ start: 'β', limit: 3 }, function (err) {
      if (err) throw err
      console.log('\nDATABASE CONTENTS AFTER rangeDel({ start: \'β\', limit: 3 }):')
      printdb(function (err) {
        if (err) throw err
        console.log('\nDone')
      })
    })
  })
})