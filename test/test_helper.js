/* jshint node: true */

var assert = require('chai').assert;

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

/*
 * assert events
 *
 * @param {Number|Array} day
 * @param {Number} num
 */

exports.assertEvents = function(cal, day, num) {
  if ('number' === typeof day) {
    day = [day];
  }

  for(var i=0, len=day.length; i<len; i++) {
    var eventsCount = cal.getDay(day[i]).events.length;
    var msg = "Day "+day[i]+" should have "+num+" events, but had "+eventsCount;
    assert.equal(eventsCount, num, msg);
  }
};

/*
 * range array
 *
 * @param {Number} start
 * @param {Number} end
 * @param {Boolean} includeEnd
 * @return {Array}
 */

exports.range = function(start, end, includeEnd) {
  var arr = [];

  if (true === includeEnd) {
    end+= 1;
  }

  for(; start<end; start++) {
    arr.push(start);
  }

  return arr;
};


