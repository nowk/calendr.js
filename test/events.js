/* jshint node: true */

var t = require('./test_helper');
var ef = t.eventFactory;
var range = t.range;
var assertEvents = t.assertEvents;
var assert = require('chai').assert;
var Calendr = require('..');
var CalendrEvents = require('../lib/events');

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

  it("only displays events in their appropriate month", function() {
    var event = ef('One', new Date(2014, 0, 10));
    var cal = new Calendr(new Date(2014, 0, 1), {dayObjects: true});
    cal.goBackMonth();
    cal.events([event]);

    assertEvents(cal, range(1, 31, true), 0);

    cal.goForwardMonth();
    cal.goForwardMonth();
    cal.events([event]);

    assertEvents(cal, range(1, 28, true), 0);
  });
});

