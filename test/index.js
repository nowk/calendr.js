/* jshint node: true */

var assert = require('chai').assert;
var sinon = require('sinon');
var Calendr = require('..');
var Day = Calendr.Day;


describe("Calendr", function() {
  it("returns an array of the calendar month's weeks", function() {
    var april = new Date(2014, 03); // month is 0 indexed
    var aprilcal = new Calendr(april);
    assert.deepEqual(aprilcal.grid, [
      [30,  31,  1,   2,   3,   4,   5],
      [6,   7,   8,   9,   10,  11,  12],
      [13,  14,  15,  16,  17,  18,  19],
      [20,  21,  22,  23,  24,  25,  26],
      [27,  28,  29,  30,  1,   2,   3]
    ]);

    var may = new Date(2014, 04);
    var maycal = new Calendr(may);
    assert.deepEqual(maycal.grid, [
      [27,  28,  29,  30,  1,   2,   3],
      [4,   5,   6,   7,   8,   9,   10],
      [11,  12,  13,  14,  15,  16,  17],
      [18,  19,  20,  21,  22,  23,  24],
      [25,  26,  27,  28,  29,  30,  31]
    ]);
  });

  it("returns days in grid as objects", function() {
    var now = new Date(2014, 3, 21);
    var clock = sinon.useFakeTimers(now.getTime());

    var a = dayMock(2014, 3);
    var b = dayMock(2014, 4);
    var c = dayMock(2014, 5);

    var april = new Date(2014, 3);
    var aprilcal = new Calendr(april);

    aprilcal.dayObjects = true;

    assert.deepEqual(aprilcal.grid, [
      [a(30),  a(31),  b(1),   b(2),   b(3),   b(4),   b(5)],
      [b(6),   b(7),   b(8),   b(9),   b(10),  b(11),  b(12)],
      [b(13),  b(14),  b(15),  b(16),  b(17),  b(18),  b(19)],
      [b(20),  b(21),  b(22),  b(23),  b(24),  b(25),  b(26)],
      [b(27),  b(28),  b(29),  b(30),  c(1),   c(2),   c(3)]
    ]);

    clock.restore();
  });

  it("returns the name of the month", function() {
    var aprilcal = new Calendr(new Date(2014, 3));
    var maycal = new Calendr(new Date(2014, 4));

    assert.equal(aprilcal.nameOfMonth, 'April');
    assert.equal(maycal.nameOfMonth, 'May');

    assert.equal(maycal.prevnameOfMonth, 'April');
    assert.equal(maycal.nextnameOfMonth, 'June');
  });

  it("can move forward and backward by month", function() {
    var april = new Date(2014, 3);
    var cal = new Calendr(april);
    assert.equal(cal.nameOfMonth, 'April');
    assert.deepEqual(cal.grid, [
      [30,  31,  1,   2,   3,   4,   5],
      [6,   7,   8,   9,   10,  11,  12],
      [13,  14,  15,  16,  17,  18,  19],
      [20,  21,  22,  23,  24,  25,  26],
      [27,  28,  29,  30,  1,   2,   3]
    ]);

    cal.goForwardMonth();
    assert.equal(cal.nameOfMonth, 'May');
    assert.deepEqual(cal.grid, [
      [27,  28,  29,  30,  1,   2,   3],
      [4,   5,   6,   7,   8,   9,   10],
      [11,  12,  13,  14,  15,  16,  17],
      [18,  19,  20,  21,  22,  23,  24],
      [25,  26,  27,  28,  29,  30,  31]
    ]);

    cal.goBackMonth();
    assert.equal(cal.nameOfMonth, 'April');
    assert.deepEqual(cal.grid, [
      [30,  31,  1,   2,   3,   4,   5],
      [6,   7,   8,   9,   10,  11,  12],
      [13,  14,  15,  16,  17,  18,  19],
      [20,  21,  22,  23,  24,  25,  26],
      [27,  28,  29,  30,  1,   2,   3]
    ]);
  });

  it("can auto grid", function() {
    var s = sinon.mock(Calendr.prototype)
      .expects('slice')
      .once()
      .returns([[1, 2, 3], [4, 5, 6]]);

    var may = new Date(2014, 04);
    var maycal = new Calendr(may, {auto: true});

    s.verify();
    Calendr.prototype.slice.restore();
  });

  it("caches the subsequent calls to grid", function() {
    var s = sinon.mock(Calendr.prototype)
      .expects('slice')
      .once()
      .returns([[1, 2, 3], [4, 5, 6]]);

    var may = new Date(2014, 04);
    var maycal = new Calendr(may);
    assert.deepEqual(maycal.grid, [[1, 2, 3], [4, 5, 6]]);
    assert.deepEqual(maycal.grid, [[1, 2, 3], [4, 5, 6]]);

    s.verify();
    Calendr.prototype.slice.restore();
  });

  it("today's day isToday is true", function() {
    var now = new Date(2014, 3, 21);
    var clock = sinon.useFakeTimers(now.getTime());
    var day = dayMock(2014, 4);

    var april = new Date(2014, 3);
    var may = new Date(2014, 4);
    var aprilcal = new Calendr(april, {auto: true, dayObjects: true});
    var maycal = new Calendr(may, {auto: true, dayObjects: true});
    assert.deepEqual(aprilcal.today, day(21));
    assert.isUndefined(maycal.today);

    var aprilcalNoDayObj = new Calendr(april);
    assert.equal(aprilcalNoDayObj.today, 21);

    var april2015 = new Calendr(new Date(2015, 3));
    assert.isUndefined(april2015.today);

    clock.restore();
  });

  /*
   * day mock
   *
   * @param {Number} year
   * @param {Number} month
   * @return {Function}
   */

  function dayMock(year, month) {
    return function(date) {
      return new Day(year, month, date);
    };
  }
});
