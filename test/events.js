/* jshint node: true */

var assert = require('chai').assert;
var Calendr = require('..');

describe('events', function() {
  var caldate;
  beforeEach(function() {
    caldate = new Date(2014, 0);
  });

  it("throws if calendr is not dayObjects: true", function() {
    assert.throws(function() {
      var cal = new Calendr(new Date());
      cal.events([]);
    }, "Calendr must be set with dayObjects = true to use the `events` method");
  });

  it("each event should be associated to their respective dates", function() {
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

  it("sorts each event by it's time (only to minutes), then by name ASC", function() {
    var events = [
      ef('Three', new Date(2014, 0, 1, 10, 0, 30)),
      ef('One', new Date(2014, 0, 1, 10, 0, 15)),
      ef('Four', new Date(2014, 0, 1, 10, 0, 15)),
      ef('Two', new Date(2014, 0, 1, 9, 30))
    ];
    var cal = new Calendr(caldate, {dayObjects: true});
    cal.events(events);
    var sorted = cal.getDay(1).events.map(function(e) {
      return e.name;
    });
    assert.deepEqual(sorted, ['Two', 'Four', 'One', 'Three']);
  });

      var events = [
        ef("One", new Date(2014, 0, 3), {repeatEndson: new Date(2014, 0, 4), repeats: 'daily'})
      ];
      cal.events(events);

      assert.lengthOf(cal.getDay(1).events, 0);
      assert.lengthOf(cal.getDay(2).events, 0);
      assert.lengthOf(cal.getDay(3).events, 1);
      assert.lengthOf(cal.getDay(4).events, 1);
    });

    it("recurrs a number of times", function() {
      var events = [
        ef("One", new Date(2014, 0, 1), {repeatTimes: 4, repeats: 'daily'})
      ];
      cal.events(events);

      assert.lengthOf(cal.getDay(1).events, 1);
      assert.lengthOf(cal.getDay(2).events, 1);
      assert.lengthOf(cal.getDay(3).events, 1);
      assert.lengthOf(cal.getDay(4).events, 1);
    });

    it("will use number of recurrs over ends on date if both are given", function() {
      var events = [
        ef("One", new Date(2014, 0, 1), {repeatTimes: 2, repeatEndson: new Date(2014, 0, 4), repeats: 'daily'}),
      ];
      cal.events(events);

      assert.lengthOf(cal.getDay(1).events, 1);
      assert.lengthOf(cal.getDay(2).events, 1);
      assert.lengthOf(cal.getDay(3).events, 0);
      assert.lengthOf(cal.getDay(4).events, 0);
    });

    it("infinitely", function() {
      var events = [
        ef("One", new Date(2014, 0, 3), {repeatTimes: -1, repeats: 'daily'}),
        ef("Two", new Date(2014, 0, 3), {repeatEndson: -1, repeats: 'daily'}),
      ];
      cal.events(events);

      assert.lengthOf(cal.getDay(1).events, 0);
      assert.lengthOf(cal.getDay(2).events, 0);
      for(var i=3; i<32; i++) {
        assert.lengthOf(cal.getDay(i).events, 2);
      }
    });
  });
});

/*
 * event factory
 *
 * @param {String} name
 * @param {Date} startson
 * @param {Object} opts
 * @return {Object}
 */

function ef(name, startson, opts) {
  var event = {
    name: name,
    startson: startson
  };

  for(var k in opts) {
    event[k] = opts[k];
  }

  return event;
}

