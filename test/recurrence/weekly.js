/* jshint node: true */

var t = require("../test_helper");
var ef = t.eventFactory;
var assert = require('chai').assert;
var assertEvents = t.assertEvents;
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

    assertEvents(cal, [2, 6, 7, 9], 1);
    assertEvents(cal, [13, 14, 16], 0);
  });

  it("recurrs a number of times", function() {
    var event = ef("One", new Date(2014, 0, 3), {
      repeatTimes: 2,
      repeats: 'weekly',
      repeatsOn: ["Monday", "Tuesday", "Thursday"]
    });
    cal.events([event]);

    assertEvents(cal, [6, 7, 9, 13, 14, 16], 1);
    assertEvents(cal, [3, 20, 21, 23], 0);
  });

  it("will use number of recurrs over ends on date if both are given", function() {
    var event = ef("One", new Date(2014, 0, 3), {
      repeatTimes: 2,
      repeatEndson: new Date(2014, 0, 24),
      repeats: 'weekly',
      repeatsOn: ["Monday", "Tuesday", "Thursday"]
    });
    cal.events([event]);

    assertEvents(cal, [6, 7, 9, 13, 14, 16], 1);
    assertEvents(cal, [3, 20, 21, 23], 0);
  });

  it("infinitely", function() {
    var event = ef("One", new Date(2014, 0, 7), {
      repeats: 'weekly',
      repeatsOn: ["Monday", "Tuesday", "Thursday"]
    });
    cal.events([event]);


    assert.lengthOf(cal.getDay(3).events, 0);
    assert.lengthOf(cal.getDay(6).events, 1);

    assertEvents(cal, [6, 7, 9, 13, 14, 16, 20, 21, 23, 27, 28, 30], 1);
    assertEvents(cal, [3/*, TODO 6 should 0, since its past start on date*/], 0);

    cal.goForwardMonth();
    cal.events([event]);

    assertEvents(cal, [3, 4, 6, 10, 11, 13, 17, 18, 20, 24, 25], 1);
  });
});

