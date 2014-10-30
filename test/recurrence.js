/* jshint node: true */

var assert = require("chai").assert;
var recurrences = require("../recurrences");
var Event = require("../event");
var Calendr = require("..");

describe("recurrences", function() {
  it("returns 0 events if the event contains no recurrence", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 16),
      ends: new Date(2014, 0, 16)
    });
    var cal = new Calendr(new Date(2014, 0), {dayObjects: true});
    var range = [].concat.apply([], cal.grid());
    var events = recurrences(evt, range);
    assert.lengthOf(events, 0);
  });

  it("returns daily recurrences till no end", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 16),
      ends: new Date(2014, 0, 16),
      repeats: "daily"
    });
    var cal = new Calendr(new Date(2014, 0), {dayObjects: true});
    var range = [].concat.apply([], cal.grid());
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
    var cal = new Calendr(new Date(2014, 1), {dayObjects: true});
    var range = [].concat.apply([], cal.grid());
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

    var cal = new Calendr(new Date(2014, 0), {dayObjects: true});
    var events = recurrences(evt, cal);
    var range = [].concat.apply([], cal.grid());
    var events = recurrences(evt, range);
    assert.lengthOf(events, 6);

    cal = new Calendr(new Date(2015, 0), {dayObjects: true});
    range = [].concat.apply([], cal.grid());
    events = recurrences(evt, range);
    assert.lengthOf(events, 0);
  });


  it("returns monthly recurrences till no end", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 16),
      ends: new Date(2014, 0, 16),
      repeats: "monthly"
    });

    var cal = new Calendr(new Date(2014, 0), {dayObjects: true});
    var range = [].concat.apply([], cal.grid());
    var events = recurrences(evt, range);
    assert.lengthOf(events, 1);

    cal = new Calendr(new Date(2014, 3), {dayObjects: true});
    range = [].concat.apply([], cal.grid());
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

    var cal = new Calendr(new Date(2014, 2), {dayObjects: true});
    var range = [].concat.apply([], cal.grid());
    var events = recurrences(evt, range);
    assert.lengthOf(events, 1);

    cal = new Calendr(new Date(2014, 3), {dayObjects: true});
    range = [].concat.apply([], cal.grid());
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

    var cal = new Calendr(new Date(2014, 3), {dayObjects: true});
    var range = [].concat.apply([], cal.grid());
    var events = recurrences(evt, range);
    assert.lengthOf(events, 1);

    cal = new Calendr(new Date(2014, 4), {dayObjects: true});
    range = [].concat.apply([], cal.grid());
    events = recurrences(evt, range);
    assert.lengthOf(events, 0);
  });
});