/* jshint node: true */

var assert = require('chai').assert;
var Calendr = require('..');


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
  });


  /*
   * day object
   *
   * @param {Number} date
   * @param {Number} month
   * @param {Number} year
   * @constructor
   */

  function Day(date, month, year) {
    this.date = date;
    this.month = month;
    this.year = year;
  }


  /*
   * day mock
   *
   * @param {Number} year
   * @param {Number} month
   * @return {Function}
   */

  function dayMock(year, month) {
    return function(n) {
      return new Day(n, month, year);
    };
  }
});
