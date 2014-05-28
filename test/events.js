/* jshint node: true */

var assert = require('chai').assert;
var Calendr = require('..');

describe('events', function() {
  it("each event should be associated to their respective dates", function() {
    var caldate = new Date(2014, 0);
    var events = [
      ef('One', new Date(2014, 0, 1)),
      ef('Two', new Date(2014, 0, 1)),
      ef('Three', new Date(2014, 0, 2)),
      ef('Four', new Date(2014, 0, 2)),
      ef('Five', new Date(2014, 0, 2)),
      ef('Six', new Date(2014, 0, 21))
    ];

    var cal = new Calendr(caldate, {dayObjects: true});
    cal.events(events);

    assert.lengthOf(cal.getDay(1).events, 2);
    assert.lengthOf(cal.getDay(2).events, 3);
    assert.lengthOf(cal.getDay(3).events, 0);
    assert.lengthOf(cal.getDay(21).events, 1);
  });
});

/*
 * event factory
 *
 * @param {String} name
 * @param {Date} startson
 * @param {Ends} endson
 * @return {Object}
 */

function ef(name, startson, endson) {
  return {
    name: name,
    startson: startson,
    endson: endson
  };
}

