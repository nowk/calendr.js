/* jshint node: true */

var t = require("./test_helper");
var assert = require("chai").assert;
var Grid = require("../grid");
var Day = require("../day");
var recurrences = require("../recurrences");
var Event = require("../event");

var calRange = function(date) {
  var cal = new Grid(date, {dayObjects: true});
  return [].concat.apply([], cal.grid());
};

describe('Event', function() {
  it("returns the length of an event", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 1, 0, 30, 55),
      ends: new Date(2014, 0, 4, 20, 12, 25)
    });
    d = evt.duration();
    
    assert.equal(d.length(), 4);
  });

  it("returns 1 if the start and end are on the same day", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 1, 0, 30, 55),
      ends: new Date(2014, 0, 1, 20, 12, 25)
    });
    d = evt.duration();
    
    assert.equal(d.length(), 1);
  });

  it("can assign extra properties", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 1, 0, 30, 55),
      ends: new Date(2014, 0, 1, 20, 12, 25),
      title: "Foo",
      description: "Hello World!"
    }, {
      title: "title",
      description: "description"
    });
    
    assert.equal(evt.title, "Foo");
    assert.equal(evt.description, "Hello World!");
  });

  it("throws if there is no start time", function() {
    assert.throw(function() {
      new Event();
    }, /must have a starts and ends date/);
  });

  it("can map based on a configuration", function() {
    var config = {
      starts: "startson",
      ends: "endson",
      repeatsOn: "repeatson",
      repeatEndsOn: "repeatEndson",
      repeatTimes: "noTimes",
    };

    var data = {
      startson: new Date(2014, 0, 1, 0, 30, 55),
      endson: new Date(2014, 0, 1, 0, 30, 55),
      repeats: "weekly",
      repeatson: ["m", "w"],
      repeatEndson: new Date(2014, 0, 1, 0, 30, 55),
      noTimes: 3,
    };

    var evt = new Event(data, config);
    assert.equal(evt.starts.valueOf(), data.startson.getTime());
    assert.equal(evt.ends.valueOf(), data.endson.getTime());
    assert.equal(evt.repeats, data.repeats);
    assert.equal(evt.repeatsOn, data.repeatson);
    assert.equal(evt.repeatEndsOn.valueOf(), data.repeatEndson.getTime());
    assert.equal(evt.repeatTimes, data.noTimes);
  });

  it("returns a collection of days through which an event spans", function() {
    var evt = new Event({
      name: "Awesome Event",
      starts: new Date(2014, 0, 1, 0, 30, 55),
      ends: new Date(2014, 0, 4, 14, 10, 21),
    }, {
      name: "name"
    });

    var days = evt.days();
    assert.lengthOf(days, 4);

    var table = [
      {s: new Date(2014, 0, 1, 0, 30, 55), e: new Date(2014, 0, 1, 23, 59, 59, 999)},
      {s: new Date(2014, 0, 2, 0, 0, 0), e: new Date(2014, 0, 2, 23, 59, 59, 999)},
      {s: new Date(2014, 0, 3, 0, 0, 0), e: new Date(2014, 0, 3, 23, 59, 59, 999)},
      {s: new Date(2014, 0, 4, 0, 0, 0), e: new Date(2014, 0, 4, 14, 10, 21)},
    ];
    var i = 0;
    var len = table.length;
    for(; i < len; i++) {
      var d = days[i];
      var v = table[i];
      assert.equal(d.starts.valueOf(), v.s.getTime());
      assert.equal(d.ends.valueOf(), v.e.getTime());
      assert.equal(d.name, "Awesome Event");
      assert.deepEqual(d.event, evt);
      assert.isUndefined(d.days);
    }
  });

  it("can apply its days to a calendar", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 1, 0, 30, 55),
      ends: new Date(2014, 0, 4, 14, 10, 21),
    });

    var cal = new Grid(new Date(2014, 0, 1), {dayObjects: true});
    evt.placeOn(cal);
    t.assertEvents(cal, t.range(1, 4, true), 1);
    t.assertEvents(cal, t.range(5, 31, true), 0);

    cal = new Grid(new Date(2014, 1, 1), {dayObjects: true});
    evt.placeOn(cal);
    t.assertEvents(cal, t.range(1, 28, true), 0);
  });

  it("FIX when timezone is forced comparison against calendr days is off by the timezone", function() {
    var starts = "2014-10-08T19:00:00-07:00";
    var ends = "2014-10-10T09:00:00-07:00";
    var evt = new Event({
      starts: starts,
      ends: ends
    }, {}, "-07:00");

    var cal = new Grid(new Date(2014, 9), {dayObjects: true});
    evt.placeOn(cal);
    t.assertEvents(cal, t.range(8, 10, true), 1);
  })

  it("forces the dates to a timezone", function() {
    var tz = new Date().getTimezoneOffset();
    var starts = "2014-10-22T16:00:00-07:00";
    var evt = new Event({
      starts: starts,
      ends: starts,
      repeat_ends_on: starts
    });
    assert.equal(evt.starts.utcOffset(), tz);
    assert.equal(evt.ends.utcOffset(), tz);
    assert.equal(evt.repeatEndsOn.utcOffset(), tz);

    evt = new Event({
      starts: starts,
      ends: starts,
      repeat_ends_on: starts
    }, {}, "-07:00");
    assert.equal(evt.starts.utcOffset(), 420);
    assert.equal(evt.ends.utcOffset(), 420);
    assert.equal(evt.repeatEndsOn.utcOffset(), 420);
  });

  it("FIX events cloned during recurrence does not adjust proper starts/ends", function() {
    var starts = "2014-10-22T16:00:00-07:00";
    var ends   = "2014-10-22T03:00:00-07:00";

    var evt = new Event({
      starts: starts,
      ends: ends,
      repeats: "weekly",
      repeats_on: ["sunday", "monday", "wednesday"],
      repeat_times: 15,
    }, {}, "-07:00");

    var range = calRange(new Date(2014, 9));
    var events = recurrences(evt, range);
    assert.lengthOf(events, 4);

    var table = [
      {s: new Date(2014, 9, 22, 19, 0, 0), e: new Date(2014, 9, 22, 06, 0, 0)},
      {s: new Date(2014, 9, 26, 19, 0, 0), e: new Date(2014, 9, 26, 06, 0, 0)},
      {s: new Date(2014, 9, 27, 19, 0, 0), e: new Date(2014, 9, 27, 06, 0, 0)},
      {s: new Date(2014, 9, 29, 19, 0, 0), e: new Date(2014, 9, 29, 06, 0, 0)},
    ];
    var i = 0;
    var len = table.length;
    for(; i < len; i++) {
      var v = table[i];
      var e = events[i];
      var d = e.days();
      assert.lengthOf(d, 1);
      assert.equal(d[0].starts.valueOf(), v.s.getTime());
      assert.equal(d[0].ends.valueOf(), v.e.getTime());
    }
  });

  it("FIX event spans 2 days when it should only span 1 due to minutes not be " +
    "zeroed", function() {

    var starts = "2015-02-04T22:00:00-08:00";
    var ends = "2015-02-04T23:45:00-08:00";

    var evt = new Event({
      starts: starts,
      ends:   ends
    }, {}, "-08:00");

    assert.lengthOf(evt.days(), 1);
  });

  it("FIX DST causes days to be off by 1", function() {
    var starts = "2015-03-09T13:00:00-04:00";
    var ends = "2015-03-09T18:00:00-04:00";

    var evt = new Event({
      starts: starts,
      ends:   ends,
    }, {}, "-04:00");

    var cal = new Grid(new Date(2015, 2), {dayObjects: true});
    evt.placeOn(cal);
    t.assertEvents(cal, t.range(1, 8, true), 0);
    t.assertEvents(cal, t.range(9, 9, true), 1);
    t.assertEvents(cal, t.range(10, 31, true), 0);
  });
});
