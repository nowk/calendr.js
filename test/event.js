/* jshint node: true */

var assert = require("chai").assert;
var moment = require("moment");
var Event = require("../event");

describe('Event', function() {
  it("returns the length of an event", function() {
    evt = new Event({
      starts: new Date(2014, 0, 1, 0, 30, 55),
      ends: new Date(2014, 0, 4, 20, 12, 25)
    });
    d = evt.duration();
    
    assert.equal(d.length(), 4);
  });

  it("returns 1 if the start and end are on the same day", function() {
    evt = new Event({
      starts: new Date(2014, 0, 1, 0, 30, 55),
      ends: new Date(2014, 0, 1, 20, 12, 25)
    });
    d = evt.duration();
    
    assert.equal(d.length(), 1);
  });

  it("returns 1 if the end date is blank", function() {
    evt = new Event({
      starts: new Date(2014, 0, 1, 0, 30, 55)
    });
    d = evt.duration();
    
    assert.equal(d.length(), 1);
  });

  it("throws if there is no start time", function() {
    assert.throw(function() {
      new Event();
    }, /must have a starts date/);
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

    evt = new Event(data, config);
    assert.equal(evt.starts.valueOf(), data.startson.getTime());
    assert.equal(evt.ends.valueOf(), data.endson.getTime());
    assert.equal(evt.repeats, data.repeats);
    assert.equal(evt.repeatsOn, data.repeatson);
    assert.equal(evt.repeatEndsOn.valueOf(), data.repeatEndson.getTime());
    assert.equal(evt.repeatTimes, data.noTimes);
  });
});