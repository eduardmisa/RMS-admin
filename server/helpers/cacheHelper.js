const NodeCache = require( "node-cache" );
const appCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

module.exports = {
    setValue: function ({ key, val }) {
        return appCache.set(key, val)
    },
    getValue: function (key) {
        return appCache.get(key)
    }
}
