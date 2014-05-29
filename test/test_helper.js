/* jshint node: true */

/*
 * event factory
 *
 * @param {String} name
 * @param {Date} startson
 * @param {Object} opts
 * @return {Object}
 */

exports.eventFactory = function(name, startson, opts) {
  var event = {
    name: name,
    startson: startson
  };

  for(var k in opts) {
    event[k] = opts[k];
  }

  return event;
};

