var used = false

// our plugin object, only cares about 'construction' extension
module.exports = {
    constructor: function (options, next) {
      // add a rangeDel() method to the current db instance
      this.rangeDel = function () {
        // the tricky bit is that the db may not be open so we may not
        // even have a `this._db` object, so we may have to wait till it's
        // ready
        var args = Array.prototype.slice.call(arguments)
          , go = function () {
              this._db.rangeDel.apply(this._db, args)
            }.bind(this)

        // illegal behaviour
        if (!arguments.length
            || (arguments.length == 1 && typeof arguments[0] != 'function')
            || (arguments.length > 1 && typeof arguments[1] != 'function'))
          // this is done in the C++ too, but the deferred operation will also
          // defer a throw which gets messy
          throw new Error('rangeDel() requires a callback argument')
        if (this.isClosed())
          throw new Error('Can\'t call rangeDel() on a closed database')

        // if open, then execute now, otherwise defer till 'ready'
        if (this.isOpen())
          go()
        else
          this.on('ready', go)
      }

      // must call next plugin, or actual constructure base
      next(options)
    }
}

// register
module.exports.use = function () {
  if (used) return
  used = true
  // register Downer RangeDel with LevelDOWN
  require('downer-rangedel').use()
  // register us with LevelUP
  require('levelup').use(module.exports)
}