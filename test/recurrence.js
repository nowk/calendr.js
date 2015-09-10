/* jshint node: true */

var assert = require("chai").assert;
var Event = require("../event");
var Grid = require("../grid");
var recurrences = require("../recurrences");

var calRange = function(date) {
  var cal = new Grid(date, {dayObjects: true});
  return [].concat.apply([], cal.grid());
};

describe("recurrences", function() {
  it("returns [itself] if the event contains no recurrence", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 16),
      ends: new Date(2014, 0, 16)
    });
    var range = calRange(new Date(2014, 0));
    var events = recurrences(evt, range);
    assert.deepEqual(events, [evt]);
  });

  it("returned recurrences contain the same properties as original event", function() {
    var evt = new Event({
      title: "Hello World!",
      starts: new Date(2014, 0, 16),
      ends: new Date(2014, 0, 16),
      repeats: "daily"
    }, {
      title: "title"
    });
    var range = calRange(new Date(2014, 0));
    var events = recurrences(evt, range);
    var e = events[0];
    assert.equal(e.title, "Hello World!");
    assert.equal(e.repeats, "daily");
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

  it("returns weekly recurrences till no end", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 16),
      ends: new Date(2014, 0, 16),
      repeats: "weekly",
      repeats_on: ["monday", "tuesday", "friday"]
    });
    var range = calRange(new Date(2014, 0));
    var events = recurrences(evt, range);
    assert.lengthOf(events, 7);

    range = calRange(new Date(2014, 3));
    events = recurrences(evt, range);
    assert.lengthOf(events, 15);
  });

  it("returns weekly recurrences till repeat ends date", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 16),
      ends: new Date(2014, 0, 16),
      repeats: "weekly",
      repeats_on: ["monday", "tuesday", "friday"],
      repeat_ends_on: new Date(2014, 2, 1)
    });
    var range = calRange(new Date(2014, 1));
    var events = recurrences(evt, range);
    assert.lengthOf(events, 15);

    range = calRange(new Date(2014, 2));
    events = recurrences(evt, range);
    assert.lengthOf(events, 3);
  });

  it("returns weekly recurrences for a # of times", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 16),
      ends: new Date(2014, 0, 16),
      repeats: "weekly",
      repeats_on: ["monday", "tuesday", "friday"],
      repeat_times: 5
    });
    var range = calRange(new Date(2014, 1));
    var events = recurrences(evt, range);
    assert.lengthOf(events, 9);
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

  it("returns yearly recurrences till no end", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 16),
      ends: new Date(2014, 0, 16),
      repeats: "yearly"
    });
    var range = calRange(new Date(2024, 0));
    var events = recurrences(evt, range);
    assert.lengthOf(events, 1);
  });

  it("returns yearly recurrences till repeat ends date", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 16),
      ends: new Date(2014, 0, 16),
      repeats: "yearly",
      repeat_ends_on: new Date(2024, 0, 15)
    });
    var range = calRange(new Date(2023, 0));
    var events = recurrences(evt, range);
    assert.lengthOf(events, 1);

    range = calRange(new Date(2024, 0));
    events = recurrences(evt, range);
    assert.lengthOf(events, 0);
  });

  it("returns yearly recurrences for a #of times", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 16),
      ends: new Date(2014, 0, 16),
      repeats: "yearly",
      repeat_times: 5
    });
    var range = calRange(new Date(2019, 0));
    var events = recurrences(evt, range);
    assert.lengthOf(events, 1);

    range = calRange(new Date(2020, 0));
    events = recurrences(evt, range);
    assert.lengthOf(events, 0);
  });

  it("returns sets the dates tailored to the day of the recurrence", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 16, 12, 30, 15),
      ends: new Date(2014, 0, 18, 1, 10, 24),
      repeats: "daily",
      repeat_times: 5
    });
    var range = calRange(new Date(2014, 0));
    var events = recurrences(evt, range);

    var table = [
      [new Date(2014, 0, 16, 12, 30, 15), new Date(2014, 0, 18, 1, 10, 24)],
      [new Date(2014, 0, 17, 12, 30, 15), new Date(2014, 0, 19, 1, 10, 24)],
      [new Date(2014, 0, 18, 12, 30, 15), new Date(2014, 0, 20, 1, 10, 24)]
    ];
    var i = 0;
    var len = table.length;
    for(; i < len; i++) {
      var e = events[i];
      assert.equal(e.starts.valueOf(), table[i][0].getTime());
      assert.equal(e.ends.valueOf(), table[i][1].getTime());
    }
  });

  it("Fix cloned events are not passing values to days", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 16, 12, 30, 15),
      ends: new Date(2014, 0, 18, 1, 10, 24),
      repeats: "daily",
      repeat_times: 5,
      name: "Wat"
    }, {
      name: "name"
    });
    var range = calRange(new Date(2014, 0));
    var events = recurrences(evt, range);
    var e = events[0];

    var days = e.days(); 
    var i = 0;
    var len = days.length;
    for(; i < len; i++) {
      var d = days[i];
      // assert.equal(d.starts.valueOf(), evt.starts.valueOf());
      assert.equal(d.repeats, "daily");
      assert.equal(d.repeatTimes, 5);
      assert.equal(d.name, "Wat");
    }
  });

  it("cloned events maintain the timezone of the original event", function() {
    var starts = "2014-10-22T16:00:00-07:00";
    var ends   = "2014-10-22T16:00:00-07:00";

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

    assert.equal(events[0].starts.utcOffset(), 420);
    assert.equal(events[1].starts.utcOffset(), 420);
    assert.equal(events[2].starts.utcOffset(), 420);
    assert.equal(events[3].starts.utcOffset(), 420);
  });

  it("returns recurrences in the outer months", function() {
    var evt = new Event({
      starts: new Date(2014, 0, 7),
      ends: new Date(2014, 0, 7),
      repeats: "weekly",
      repeats_on: ["sunday", "saturday"]
    });
    var range = calRange(new Date(2014, 7));
    var events = recurrences(evt, range);
    assert.lengthOf(events, 12);

    assert.equal(events[0].starts.month(), 6);
    assert.equal(events[1].starts.month(), 7);
    assert.equal(events[10].starts.month(), 7);
    assert.equal(events[11].starts.month(), 8);
  });
});
