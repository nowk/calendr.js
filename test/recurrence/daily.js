/* jshint node: true */

var t = require("../test_helper");
var ef = t.eventFactory;
var assert = require('chai').assert;
var Calendr = require('../..');

describe('daily recurrance', function() {
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

    assert.lengthOf(cal.getDay(1).events, 0);
    assert.lengthOf(cal.getDay(2).events, 0);
    assert.lengthOf(cal.getDay(3).events, 1);
    assert.lengthOf(cal.getDay(4).events, 1);
  });

  it("recurrs a number of times", function() {
    var event = ef("One", new Date(2014, 0, 1), {repeatTimes: 4, repeats: 'daily'});
    cal.events([event]);

    assert.lengthOf(cal.getDay(1).events, 1);
    assert.lengthOf(cal.getDay(2).events, 1);
    assert.lengthOf(cal.getDay(3).events, 1);
    assert.lengthOf(cal.getDay(4).events, 1);
  });

  it("will use number of recurrs over ends on date if both are given", function() {
    var event = ef("One", new Date(2014, 0, 1), {
      repeatTimes: 2,
      repeatEndson: new Date(2014, 0, 4),
      repeats: 'daily'
    });
    cal.events([event]);

    assert.lengthOf(cal.getDay(1).events, 1);
    assert.lengthOf(cal.getDay(2).events, 1);
    assert.lengthOf(cal.getDay(3).events, 0);
    assert.lengthOf(cal.getDay(4).events, 0);
  });

  it("infinitely", function() {
    var events = [
      ef("One", new Date(2014, 0, 3), {repeats: 'daily'}),
      ef("Two", new Date(2014, 0, 3), {repeats: 'daily'}),
    ];
    cal.events(events);

    assert.lengthOf(cal.getDay(1).events, 0);
    assert.lengthOf(cal.getDay(2).events, 0);
    for(var i=3; i<32; i++) {
      assert.lengthOf(cal.getDay(i).events, 2);
    }
  });
});
