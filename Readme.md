# Calendr.js

Weeks array grid for calendar month

# Installation

    npm install calendr

# Example

    var Calendr = require('calendr');

    var april = new Date(2014, 03); // month is 0 indexed
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

# License

MIT
