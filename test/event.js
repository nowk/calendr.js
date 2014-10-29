/* jshint node: true */

var assert = require("chai").assert;
var Event = require("../event");
var Day = require("../day");

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

  it("returns a collection of days in which an event spans", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 1, 0, 30, 55),
      ends: new Date(2014, 0, 4, 14, 10, 21),
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
      assert.equal(d.starts().valueOf(), v.s.getTime());
      assert.equal(d.ends().valueOf(), v.e.getTime());
    }
  });
});

// var cal = new Calendr(2014, 0);
// var []events = evt.apply(cal);

// for _, v := range []events {
//   for _, d := v.days {
//     // look up day in cal and append
//   } 
// }