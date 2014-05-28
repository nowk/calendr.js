# Calendr.js

[![Build Status](https://travis-ci.org/nowk/calendr.js.svg?branch=master)](https://travis-ci.org/nowk/calendr.js)
[![Code Climate](https://codeclimate.com/github/nowk/calendr.js.png)](https://codeclimate.com/github/nowk/calendr.js)

Weeks array grid for calendar month

# Installation

    npm install calendr

# Example

    var Calendr = require('calendr');

    var april = new Date(2014, 3); // month is 0 indexed
    var aprilcal = new Calendr(april);

    aprilcal.grid

Returns:

    [
      [30,  31,  1,   2,   3,   4,   5],
      [6,   7,   8,   9,   10,  11,  12],
      [13,  14,  15,  16,  17,  18,  19],
      [20,  21,  22,  23,  24,  25,  26],
      [27,  28,  29,  30,  1,   2,   3]
    ]

---

When `dayObjects` is `true` each day item is returned as a `Day` object instead of a `Number`.

    var april = new Date(2014, 3);
    april.dayObjects = true;

or

    var april = new Date(2014, 3, {dayObjects: true});

`Day` objects include these methods:

    day.date()       // the date eg. 12
    day.month()      // the month eg. 2 (this is 1 index)
    day.year()       // the full year eg. 2014
    day.isToday()    // returns Boolean based on whether this `Day` is today
    day.toDate()     // returns the day's date as a Date object
    day.dayOfWeek()  // the name of the day of the week, eg. Monday, Tuesday, etc...
    day.dayOfMonth() // the name of the day of the month, eg. January, February, etc...

# License

MIT
