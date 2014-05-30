/* jshint node: true */

var t = require("../test_helper");
var ef = t.eventFactory;
var assert = require('chai').assert;
var Calendr = require('../..');

describe("weekly recurrence", function() {
  var caldate;
  var cal;
  beforeEach(function() {
    caldate = new Date(2014, 0);
    cal = new Calendr(caldate, {dayObjects: true});
  });


  it("recurrs to  a given ends on date", function() {
    var event = ef("One", new Date(2014, 0, 2), {
      repeatEndson: new Date(2014, 0, 10),
      repeats: 'weekly',
      repeatsOn: ["Monday", "Tuesday", "Thursday"]
    });
    cal.events([event]);

    assert.lengthOf(cal.getDay(2).events, 1);
    assert.lengthOf(cal.getDay(6).events, 1);
    assert.lengthOf(cal.getDay(7).events, 1);
    assert.lengthOf(cal.getDay(9).events, 1);
    assert.lengthOf(cal.getDay(13).events, 0);
    assert.lengthOf(cal.getDay(14).events, 0);
    assert.lengthOf(cal.getDay(16).events, 0);
  });

  it("recurrs a number of times", function() {
    var event = ef("One", new Date(2014, 0, 3), {
      repeatTimes: 2,
      repeats: 'weekly',
      repeatsOn: ["Monday", "Tuesday", "Thursday"]
    });
    cal.events([event]);

    assert.lengthOf(cal.getDay(3).events, 0);
    assert.lengthOf(cal.getDay(6).events, 1);
    assert.lengthOf(cal.getDay(7).events, 1);
    assert.lengthOf(cal.getDay(9).events, 1);
    assert.lengthOf(cal.getDay(13).events, 1);
    assert.lengthOf(cal.getDay(14).events, 1);
    assert.lengthOf(cal.getDay(16).events, 1);
    assert.lengthOf(cal.getDay(20).events, 0);
    assert.lengthOf(cal.getDay(21).events, 0);
    assert.lengthOf(cal.getDay(23).events, 0);
  });

  it("will use number of recurrs over ends on date if both are given", function() {
    var event = ef("One", new Date(2014, 0, 3), {
      repeatTimes: 2,
      repeatEndson: new Date(2014, 0, 24),
      repeats: 'weekly',
      repeatsOn: ["Monday", "Tuesday", "Thursday"]
    });
    cal.events([event]);

    assert.lengthOf(cal.getDay(3).events, 0);
    assert.lengthOf(cal.getDay(6).events, 1);
    assert.lengthOf(cal.getDay(7).events, 1);
    assert.lengthOf(cal.getDay(9).events, 1);
    assert.lengthOf(cal.getDay(13).events, 1);
    assert.lengthOf(cal.getDay(14).events, 1);
    assert.lengthOf(cal.getDay(16).events, 1);
    assert.lengthOf(cal.getDay(20).events, 0);
    assert.lengthOf(cal.getDay(21).events, 0);
    assert.lengthOf(cal.getDay(23).events, 0);
  });
});

