/* jshint node: true */

var t = require('../test_helper');
var ef = t.eventFactory;
var range = t.range;
var assertEvents = t.assertEvents;
var assert = require('chai').assert;
var Calendr = require('../..');
var CalendrEvents = require('../../lib/events');

describe("yearly recurrence", function() {
  var caldate;
  var cal;
  beforeEach(function() {
    caldate = new Date(2014, 0);
    cal = new Calendr(caldate, {dayObjects: true});
  });

  describe("repeat ends on a date", function() {
    var event = ef("One", new Date(2014, 0, 3), {
      repeatEndson: new Date(2016, 0, 5),
      repeats: 'yearly'
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

    it("Jaunary 2014", function() {
      cal.events([event]);
      assertEvents(cal, [3], 1);
      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);
    });

    it("February", function() {
      cal.goForwardMonth(); // feb
      cal.events([event]);
      assertEvents(cal, range(1, cal.moment.daysInMonth(), true), 0);
    });

    it("Jaunary 2015", function() {
      cal = new Calendr(new Date(2015, 0), {dayObjects: true});
      cal.events([event]);
      assertEvents(cal, [3], 1);
      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);
    });

    it("Jaunary 2016", function() {
      cal = new Calendr(new Date(2016, 0), {dayObjects: true});
      cal.events([event]);
      assertEvents(cal, [3], 1);
      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);
    });

    it("Jaunary 2016 - ends on date is before the start on date", function() {
      event.repeatEndson = new Date(2016, 0, 2);
      cal = new Calendr(new Date(2016, 0), {dayObjects: true});
      cal.events([event]);
      assertEvents(cal, range(1, cal.moment.daysInMonth(), true), 0);
    });

    it("Jaunary 2016 - ends on date is before same as the start on date", function() {
      event.repeatEndson = new Date(2016, 0, 3);
      cal = new Calendr(new Date(2016, 0), {dayObjects: true});
      cal.events([event]);
      assertEvents(cal, [3], 1);
      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);
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
      repeats: 'yearly'
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

    it("Jaunary 2014", function() {
      cal.events([event]);
      assertEvents(cal, [3], 1);
      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);
    });

    it("February", function() {
      cal.goForwardMonth(); // feb
      cal.events([event]);
      assertEvents(cal, range(1, cal.moment.daysInMonth(), true), 0);
    });

    it("Jaunary 2015", function() {
      cal = new Calendr(new Date(2015, 0), {dayObjects: true});
      cal.events([event]);
      assertEvents(cal, [3], 1);
      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);
    });

    it("Jaunary 2016", function() {
      cal = new Calendr(new Date(2016, 0), {dayObjects: true});
      cal.events([event]);
      assertEvents(cal, [3], 1);
      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);
    });

    it("Jaunary 2017", function() {
      cal = new Calendr(new Date(2017, 0), {dayObjects: true});
      cal.events([event]);
      assertEvents(cal, range(1, cal.moment.daysInMonth(), true), 0);
    });
  });

  it("will use repeat times over ends on date if both are given", function() {
    var event = ef("One", new Date(2014, 0, 3), {
      repeatTimes: 1,
      repeatEndson: new Date(2016, 3, 2),
      repeats: 'yearly'
    });

    cal.events([event]);
    assertEvents(cal, [3], 1);
    assertEvents(cal, range(1, 2, true), 0);
    assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);

    cal = new Calendr(new Date(2015, 0, 1), {dayObjects: true});
    cal.events([event]);
    assertEvents(cal, range(1, cal.moment.daysInMonth(), true), 0);
  });

  describe("recurring infinitely", function() {
   var event = ef("One", new Date(2014, 0, 3), {
      repeats: 'yearly'
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

    it("Jaunary 2014", function() {
      cal.events([event]);
      assertEvents(cal, [3], 1);
      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);
    });

    it("February", function() {
      cal.goForwardMonth(); // feb
      cal.events([event]);
      assertEvents(cal, range(1, cal.moment.daysInMonth(), true), 0);
    });

    it("Jaunary 2015", function() {
      cal = new Calendr(new Date(2015, 0), {dayObjects: true});
      cal.events([event]);
      assertEvents(cal, [3], 1);
      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);
    });

    it("Jaunary 2016", function() {
      cal = new Calendr(new Date(2016, 0), {dayObjects: true});
      cal.events([event]);
      assertEvents(cal, [3], 1);
      assertEvents(cal, range(1, 2, true), 0);
      assertEvents(cal, range(4, cal.moment.daysInMonth(), true), 0);
    });
  });
});

