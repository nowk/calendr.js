/* jshint node: true */

var assert = require('chai').assert;
var sinon = require('sinon');
var Day = require('..').Day;

describe("Day", function() {
  it("returns the configured Date", function() {
    var day = new Day(2014, 5, 27);
    var a = parseInt(day.moment.unix()/100, 10);
    var b = parseInt(new Date(2014, 4, 27).getTime()/100000, 10);
    assert.equal(a, b);
  });

  describe('properties', function() {
    var day;
    beforeEach(function() {
      day = new Day(2014, 5, 27);
    });

    it('returns the date', function() {
      assert.equal(day.date(), 27);
    });

    it('returns the month, 1 indexed', function() {
      assert.equal(day.month(), 5);
    });

    it('returns the full year', function() {
      assert.equal(day.year(), 2014);
    });

    describe("require invocation", function() {
      it("returns the name of the day of the week", function() {
        assert.equal(day.name(), 'Tuesday');
      });

      it("returns the name of the month", function() {
        assert.equal(day.monthName(), 'May');
      });

      it("tells you if today is 'today'", function() {
        var now = new Date(2014, 0, 1);
        var day = new Day(2014, 1, 1);
        var clock = sinon.useFakeTimers(now.getTime());
        assert(day.isToday());
        clock.restore();
      });
    });
  });
});

