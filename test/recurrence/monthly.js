/* jshint node: true */

var t = require('../test_helper');
var ef = t.eventFactory;
var range = t.range;
var assertEvents = t.assertEvents;
var assert = require('chai').assert;
var Calendr = require('../..');
var CalendrEvents = require('../../lib/events');

describe("monthly recurrence", function() {
  var caldate;
  var cal;
  beforeEach(function() {
    caldate = new Date(2014, 0);
    cal = new Calendr(caldate, {dayObjects: true});
  });

  describe("repeat ends on a date", function() {
    var event = ef("One", new Date(2014, 0, 3), {
      repeatEndson: new Date(2014, 3, 2),
      repeats: 'monthly'
    });

    it("January 2013", function() {
      var jancal = new Calendr(new Date(2013, 0, 1), {dayObjects: true});
      jancal.events([event]);
      assertEvents(jancal, range(1, 31, true), 0);
    });

    it("December 2013", function() {
      var deccal = new Calendr(new Date(2013, 11, 1), {dayObjects: true});
      deccal.events([event]);
      assertEvents(deccal, range(1, 31, true), 0);
    });

    it("January", function() {
      cal.events([event]);
      assertEvents(cal, [3], 1);
      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);
    });

    it("February", function() {
      cal.goForwardMonth(); // feb
      cal.events([event]);
      assertEvents(cal, [3], 1);
      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);
    });

    it("March", function() {
      cal.goForwardMonth();
      cal.goForwardMonth(); // mar
      cal.events([event]);
      assertEvents(cal, [3], 1);
      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);
    });

    it("April (repeat ends on date is before the next start on date)", function() {
      cal.goForwardMonth();
      cal.goForwardMonth();
      cal.goForwardMonth(); // apr
      cal.events([event]);
      assertEvents(cal, range(1, cal.moment.daysInMonth(), true), 0);
    });

    it("ends on date is the same as the starton date", function() {
      event.repeatEndson = new Date(2014, 0, 3);
      cal = new Calendr(new Date(2014, 0, 3), {dayObjects: true});
      cal.events([event]);
      assertEvents(cal, [3], 1);
      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);
    });
  });


  describe("repeats a number of times", function() {
    var event = ef("One", new Date(2014, 0, 3), {
      repeatTimes: 3,
      repeats: 'monthly'
    });

    it("January 2013", function() {
      var jancal = new Calendr(new Date(2013, 0, 1), {dayObjects: true});
      jancal.events([event]);
      assertEvents(jancal, range(1, 31, true), 0);
    });

    it("December 2013", function() {
      var deccal = new Calendr(new Date(2013, 11, 1), {dayObjects: true});
      deccal.events([event]);
      assertEvents(deccal, range(1, 31, true), 0);
    });

    it("January", function() {
      cal.events([event]);
      assertEvents(cal, [3], 1);
      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);
    });

    it("February", function() {
      cal.goForwardMonth(); // feb
      cal.events([event]);
      assertEvents(cal, [3], 1);
      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);
    });

    it("March", function() {
      cal.goForwardMonth();
      cal.goForwardMonth(); // mar
      cal.events([event]);
      assertEvents(cal, [3], 1);
      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);
    });

    it("April", function() {
      cal.goForwardMonth();
      cal.goForwardMonth();
      cal.goForwardMonth(); // apr
      cal.events([event]);
      assertEvents(cal, range(1, cal.moment.daysInMonth(), true), 0);
    });

    it("repeats time is 1", function() {
      event.repeatTimes = 1;
      var cal = new Calendr(new Date(2014, 0, 3), {dayObjects: true});
      cal.events([event]);
      assertEvents(cal, [3], 1);
      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);
    });
  });

  it("will use repeat times over ends on date if both are given", function() {
    var event = ef("One", new Date(2014, 0, 3), {
      repeatTimes: 1,
      repeatEndson: new Date(2014, 3, 2),
      repeats: 'monthly'
    });

    cal.events([event]);
    assertEvents(cal, [3], 1);
    assertEvents(cal, range(1, 2, true), 0);
    assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);

    cal.goForwardMonth();
    cal.events([event]);
    assertEvents(cal, range(1, cal.moment.daysInMonth(), true), 0);
  });

  describe("recurring infinitely", function() {
   var event = ef("One", new Date(2014, 0, 3), {
      repeats: 'monthly'
    });

    it("January 2013", function() {
      var jancal = new Calendr(new Date(2013, 0, 1), {dayObjects: true});
      jancal.events([event]);
      assertEvents(jancal, range(1, 31, true), 0);
    });

    it("December 2013", function() {
      var deccal = new Calendr(new Date(2013, 11, 1), {dayObjects: true});
      deccal.events([event]);
      assertEvents(deccal, range(1, 31, true), 0);
    });

    it("January", function() {
      cal.events([event]);
      assertEvents(cal, [3], 1);
      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);
    });

    it("February", function() {
      cal.goForwardMonth(); // feb
      cal.events([event]);
      assertEvents(cal, [3], 1);
      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);
    });

    it("March", function() {
      cal.goForwardMonth();
      cal.goForwardMonth(); // mar
      cal.events([event]);
      assertEvents(cal, [3], 1);
      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);
    });

    it("Januray 2015", function() {
      cal = new Calendr(new Date(2015, 0, 1), {dayObjects: true});
      cal.events([event]);
      assertEvents(cal, [3], 1);
      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);
    });

    it("February 2015", function() {
      cal.goForwardMonth();
      cal.events([event]);
      assertEvents(cal, [3], 1);
      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);
    });
  });
});

