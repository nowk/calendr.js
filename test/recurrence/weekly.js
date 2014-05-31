/* jshint node: true */

var t = require("../test_helper");
var ef = t.eventFactory;
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
  });
});

