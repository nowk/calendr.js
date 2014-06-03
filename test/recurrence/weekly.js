/* jshint node: true */

var t = require("../test_helper");
var ef = t.eventFactory;
var range = t.range;
var assert = require('chai').assert;
var assertEvents = t.assertEvents;
var Calendr = require('../..');
var CalendrEvents = require('../../lib/events');

describe("weekly recurrence", function() {
  var caldate;
  var cal;
  beforeEach(function() {
    caldate = new Date(2014, 0);
    cal = new Calendr(caldate, {dayObjects: true});
  });


  it("recurrs to  a given ends on date", function() {
    var event = ef("One", new Date(2014, 0, 2), {
      repeatEndson: new Date(2014, 0, 15),
      repeats: 'weekly',
      repeatsOn: ["Monday", "Tuesday", "Thursday"]
    });
    cal.events([event]);

    assertEvents(cal, [2, 6, 7, 9, 13, 14], 1);
    assertEvents(cal, [16], 0);
  });

  it("recurrs a number of times", function() {
    var event = ef("One", new Date(2014, 0, 3), {
      repeatTimes: 2,
      repeats: 'weekly',
      repeatsOn: ["Monday", "Tuesday", "Thursday"]
    });
    cal.events([event]);

    assertEvents(cal, [6, 7, 9], 1);
    assertEvents(cal, [3, 13, 14, 16], 0);
  });

  it("will use number of recurrs over ends on date if both are given", function() {
    var event = ef("One", new Date(2014, 0, 3), {
      repeatTimes: 2,
      repeatEndson: new Date(2014, 0, 24),
      repeats: 'weekly',
      repeatsOn: ["Monday", "Tuesday", "Thursday"]
    });
    cal.events([event]);

    assertEvents(cal, [6, 7, 9], 1);
    assertEvents(cal, [3, 13, 14, 16], 0);
  });

  describe("infinitely", function() {
    var event = ef("One", new Date(2014, 0, 7), {
      repeats: 'weekly',
      repeatsOn: ["Monday", "Tuesday", "Thursday"]
    });

    it("January", function() {
      cal.events([event]);

      assertEvents(cal, [7, 9, 13, 14, 16, 20, 21, 23, 27, 28, 30], 1);
      assertEvents(cal, [3, 6], 0);
    });

    it("February", function() {
      cal.goForwardMonth();
      cal.events([event]);

      assertEvents(cal, [3, 4, 6, 10, 11, 13, 17, 18, 20, 24, 25], 1);
    });
  });

  describe("recurr ends on spans into upcomming months", function() {
    var event = ef("One", new Date(2014, 0, 7), {
      repeats: 'weekly',
      repeatEndson: new Date(2014, 2, 4),
      repeatsOn: ["Monday", "Tuesday", "Thursday"]
    });

    it("January", function() {
      cal.events([event]);

      assertEvents(cal, [7, 9, 13, 14, 16, 20, 21, 23, 27, 28, 30], 1);
      assertEvents(cal, [3, 6], 0);
    });

    it("February", function() {
      cal.goForwardMonth();
      cal.events([event]);

      assertEvents(cal, [3, 4, 6, 10, 11, 13, 17, 18, 20, 24, 25], 1);
    });

    it("March", function() {
      cal.goForwardMonth();
      cal.goForwardMonth();
      cal.events([event]);

      assertEvents(cal, [3, 4], 1);
      assertEvents(cal, [6, 10, 11, 13], 0);
    });

    it("April", function() {
      cal.goForwardMonth();
      cal.goForwardMonth();
      cal.goForwardMonth();
      cal.events([event]); // April

      assertEvents(cal, range(1, 30, true), 0);
    });
  });

  it("FIX repeat ends on same month, but different year", function() {
    var event = ef("One", '2014-01-02T16:00:00-07:00', {
      repeats: 'weekly',
      repeatEndson: '2015-01-02T00:00:00-07:00',
      repeatsOn: ["sunday", "saturday"],
      endson: "2014-06-02T15:00:00-07:00"
    });
    cal.events([event]);

    assertEvents(cal, [4, 5, 11, 12, 18, 19, 25, 26], 1);
  });

  it("FIX repeat times does not display events in months it does not span into", function() {
    var event = ef("One", '2014-06-02T17:00:00-07:00', {
      repeats: 'weekly',
      repeatTimes: 2,
      repeatsOn: ["monday", "tuesday"]
    });
    cal.events([event]);

    assertEvents(cal, range(1, 31, true), 0);

    cal = new Calendr(new Date(2014, 5, 1), {dayObjects: true});
    cal.events([event]);

    assertEvents(cal, [2, 3, 9, 10], 1);

    cal.goForwardMonth();
    cal.events([event]);

    assertEvents(cal, range(1, 31, true), 0);
  });

  it("padding days for the next month should not have events", function() {
    var event = ef("One", '2014-06-02T16:00:00-07:00', {
      repeats: 'weekly',
      repeatEndson: '2014-10-02T00:00:00-07:00',
      repeatsOn: ["friday"]
    });
    cal = new Calendr(new Date(2014, 7, 1), {dayObjects: true});
    cal.events([event]);

    assertEvents(cal, [1, 8, 15, 22, 29], 1);
    assertEvents(cal, [36], 0);
  });

  it("recurr repeat times exeactly the remainder of the month", function() {
    var event = ef("One", new Date(2014, 0, 14), {
      repeats: 'weekly',
      repeatTimes: 3,
      repeatsOn: ["Monday", "Tuesday", "Thursday"]
    });
    cal.events([event]);

    assertEvents(cal, [14, 16, 20, 21, 23, 27, 28, 30], 1);
    assertEvents(cal, [3], 0);
  });

  describe("recurr repeat times spans into upcomming months", function() {
    var event = ef("One", new Date(2014, 0, 7), {
      repeats: 'weekly',
      repeatTimes: 15,
      repeatsOn: ["Monday", "Tuesday", "Thursday"]
    });

    it("January", function() {
      cal.events([event]);

      assertEvents(cal, [7, 9, 13, 14, 16, 20, 21, 23, 27, 28, 30], 1);
      assertEvents(cal, [3, 6], 0);
    });

    it("February", function() {
      cal.goForwardMonth();
      cal.events([event]); // Feb

      assertEvents(cal, [3, 4, 6, 10, 11, 13, 17, 18, 20, 24, 25, 27], 1);
    });

    it("March", function() {
      cal.goForwardMonth();
      cal.goForwardMonth();
      cal.events([event]); // Mar

      assertEvents(cal, [3, 4, 6, 10, 11, 13, 17, 18, 20, 24, 25, 27, 31], 1);
    });

    it("April", function() {
      cal.goForwardMonth();
      cal.goForwardMonth();
      cal.goForwardMonth();
      cal.events([event]); // Apr

      assertEvents(cal, [1, 3, 7, 8, 10], 1);
      assertEvents(cal, [14, 15, 17], 0);
    });

    it("May", function() {
      cal.goForwardMonth();
      cal.goForwardMonth();
      cal.goForwardMonth();
      cal.goForwardMonth();
      cal.events([event]); // May

      assertEvents(cal, range(1, 31, true), 0);
    });
  });
});

