/* jshint node: true */

var t = require("../test_helper");
var ef = t.eventFactory;
var range = t.range;
var assertEvents = t.assertEvents;
var assert = require('chai').assert;
var Calendr = require('../..');
var CalendrEvents = require('../../lib/events');

describe('daily recurrence', function() {
  var caldate;
  var cal;
  beforeEach(function() {
    caldate = new Date(2014, 0);
    cal = new Calendr(caldate, {dayObjects: true});
  });

  it("recurrs to a given ends on date", function() {
    var event = ef("One", new Date(2014, 0, 3), {
      repeatEndson: new Date(2014, 0, 4),
      repeats: 'daily'
    });
    cal.events([event]);

    assertEvents(cal, [3, 4], 1);
    assertEvents(cal, [1, 2, 5], 0);
  });

  it("recurrs a number of times", function() {
    var event = ef("One", new Date(2014, 0, 1), {repeatTimes: 4, repeats: 'daily'});
    cal.events([event]);

    assertEvents(cal, [1, 2, 3, 4], 1);
    assertEvents(cal, [5], 0);
  });

  it("will use number of recurrs over ends on date if both are given", function() {
    var event = ef("One", new Date(2014, 0, 1), {
      repeatTimes: 2,
      repeatEndson: new Date(2014, 0, 4),
      repeats: 'daily'
    });
    cal.events([event]);

    assertEvents(cal, [1, 2], 1);
    assertEvents(cal, [3, 4], 0);
  });

  describe("infinitely", function() {
    var events = [
      ef("One", new Date(2014, 0, 3), {repeats: 'daily'}),
      ef("Two", new Date(2014, 0, 3), {repeats: 'daily'}),
    ];

    it("January", function() {
      cal.events(events);

      assertEvents(cal, [1, 2], 0);
      assertEvents(cal, range(3, 31, true), 2);
    });

    it("February", function() {
      cal.goForwardMonth();
      cal.events(events);

      assertEvents(cal, range(1, 28, true), 2);
    });

    it("March", function() {
      cal.goForwardMonth();
      cal.goForwardMonth();
      cal.events(events);

      assertEvents(cal, range(1, 31, true), 2);
    });
  });

  describe("recurr ends on spans into upcomming months", function() {
    var event = ef("One", new Date(2014, 0, 3), {
      repeatEndson: new Date(2014, 2, 4),
      repeats: 'daily'
    });

    it("January", function() {
      cal.events([event]);

      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(3, 31, true), 1);
    });

    it("February", function() {
      cal.goForwardMonth();
      cal.events([event]);

      assertEvents(cal, range(1, 28, true), 1);
    });

    it("March", function() {
      cal.goForwardMonth();
      cal.goForwardMonth();
      cal.events([event]);

      assertEvents(cal, range(1, 4, true), 1);
      assertEvents(cal, 5, 0);
    });
  });

  it("recurr repeat times exeactly the remainder of the month", function() {
    var event = ef("One", new Date(2014, 0, 3), {
      repeatTimes: 28,
      repeats: 'daily'
    });
    cal.events([event]);

    assertEvents(cal, range(3, 30, true), 1);
  });

  describe("recurr repeat times spans into upcomming months", function() {
    var event = ef("One", new Date(2014, 0, 3), {
      repeatTimes: 62,
      repeats: 'daily'
    });

    it("January", function() {
      cal.events([event]);

      assertEvents(cal, range(3, 31, true), 1);
    });

    it("February", function() {
      cal.goForwardMonth();
      cal.events([event]);

      assertEvents(cal, range(1, 28, true), 1);
    });

    it("March", function() {
      cal.goForwardMonth();
      cal.goForwardMonth();
      cal.events([event]);

      assertEvents(cal, range(1, 6, true), 1);
      assertEvents(cal, 7, 0);
    });
  });

  describe("recurr repeat times spans into upcomming months - 2", function() {
    var event = ef("One", new Date(2014, 1, 3), {
      repeatTimes: 62,
      repeats: 'daily'
    });

    it("February", function() {
      cal.goForwardMonth();
      cal.events([event]);

      assertEvents(cal, range(3, 28, true), 1);
    });

    it("March", function() {
      cal.goForwardMonth();
      cal.goForwardMonth();
      cal.events([event]);

      assertEvents(cal, range(1, 31, true), 1);
    });

    it("April", function() {
      cal.goForwardMonth();
      cal.goForwardMonth();
      cal.goForwardMonth();
      cal.events([event]);

      assertEvents(cal, range(1, 6, true), 1);
      assertEvents(cal, 7, 0);
    });
  });

  it("FIX repeat ends on same month, but different year", function() {
    var event = ef("One", '2014-01-02T16:00:00-07:00', {
      repeats: 'daily',
      repeatEndson: '2015-01-02T00:00:00-07:00'
    });
    cal.events([event]);

    assertEvents(cal, range(2, 31, true), 1);
  });

  it("FIX repeat times does not display events in months it does not span into", function() {
    var event = ef("One", '2014-06-02T17:00:00-07:00', {
      repeats: 'daily',
      repeatTimes: 2,
    });
    cal.events([event]);

    assertEvents(cal, range(1, 31, true), 0);

    cal = new Calendr(new Date(2014, 5, 1), {dayObjects: true});
    cal.events([event]);

    assertEvents(cal, [2, 3], 1);
    // assertEvents(cal, range(4, 30, true), 0);

    cal.goForwardMonth();
    cal.events([event]);

    assertEvents(cal, range(1, 31, true), 0);
  });
});

