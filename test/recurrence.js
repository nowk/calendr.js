/* jshint node: true */

var assert = require("chai").assert;
var recurrences = require("../recurrences");
var Event = require("../event");
var Calendr = require("..");

var calRange = function(date) {
  var cal = new Calendr(date, {dayObjects: true});
  return [].concat.apply([], cal.grid());
}

describe("recurrences", function() {
  it("returns 0 events if the event contains no recurrence", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 16),
      ends: new Date(2014, 0, 16)
    });
    var range = calRange(new Date(2014, 0));
    var events = recurrences(evt, range);
    assert.lengthOf(events, 0);
  });

  it("returns daily recurrences till no end", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 16),
      ends: new Date(2014, 0, 16),
      repeats: "daily"
    });
    var range = calRange(new Date(2014, 0));
    var events = recurrences(evt, range);
    assert.lengthOf(events, 17);
  });

  it("returns daily recurrences till repeat ends date", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 16),
      ends: new Date(2014, 0, 16),
      repeats: "daily",
      repeat_ends_on: new Date(2014, 1, 3)
    });
    var range = calRange(new Date(2014, 1));
    var events = recurrences(evt, range);
    assert.lengthOf(events, 9);
  });

  it("returns daily recurrences for a # of times", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 16),
      ends: new Date(2014, 0, 16),
      repeats: "daily",
      repeat_times: 5
    });
    var range = calRange(new Date(2014, 0));
    var events = recurrences(evt, range);
    assert.lengthOf(events, 6);

    range = calRange(new Date(2015, 0));
    events = recurrences(evt, range);
    assert.lengthOf(events, 0);
  });


  it("returns monthly recurrences till no end", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 16),
      ends: new Date(2014, 0, 16),
      repeats: "monthly"
    });
    var range = calRange(new Date(2014, 0));
    var events = recurrences(evt, range);
    assert.lengthOf(events, 1);

    range = calRange(new Date(2014, 3));
    events = recurrences(evt, range);
    assert.lengthOf(events, 1);
  });

  it("returns monthly recurrences till repeat ends date", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 16),
      ends: new Date(2014, 0, 16),
      repeats: "monthly",
      repeat_ends_on: new Date(2014, 3, 15)
    });
    var range = calRange(new Date(2014, 2));
    var events = recurrences(evt, range);
    assert.lengthOf(events, 1);

    range = calRange(new Date(2014, 3));
    events = recurrences(evt, range);
    assert.lengthOf(events, 0);
  });

  it("returns monthly recurrences for a # of times", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 16),
      ends: new Date(2014, 0, 16),
      repeats: "monthly",
      repeat_times: 3
    });
    var range = calRange(new Date(2014, 3));
    var events = recurrences(evt, range);
    assert.lengthOf(events, 1);

    range = calRange(new Date(2014, 4));
    events = recurrences(evt, range);
    assert.lengthOf(events, 0);
  });
});