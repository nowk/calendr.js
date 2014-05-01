# Calendr.js

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

When called with `dayObjects = true` each day item is returned as a `Day` object instead of a `Number`.

`Day` objects include these properties:

* `date` the date eg. 12
* `month` the month eg. 2 (this is not 0 index like the Javascript `Date` object)
* `year` the full year eg. 2014
* `isToday` returns Boolean based on whether this `Day` is today

---

#### Methods:

* **Calendr(date, options)**

  This is the constructor.

  `date` should be a valid Javascript `Date` object.
  `options` can have two properties `auto` and/or `dayObjects`

       var cal = new Calendr(new Date(2014, 3), {auto: true, dayObjects: true});

  *When using the `{auto: true}` options, you must also pass along `{dayObjects: true}` in the options in order to retrieve the days as `Day` instances.*


* **slice()**

  Returns the weeks array for the current month. This will always rebuild the weeks.

  If the constructor is provided the `{auto: true}` option, `slice()` will automatically be called and the grid cache set.

  *You want to call the `grid` property vs. `slice()`. `grid` will handle everything for you. `slice()` will not set the cache.*


* **goForwardMonth()**

  Forwards the calendar to the next month. *This changes the `Calendr` instance `moment` property*

* **goBackMonth()**

  Moves the calendar back month. *This changes the `Calendr` instance `moment` property*

---

#### Properties:

* **grid**

  Returns the cached return from `slice()` or calls `slice()` if the cache is empty. The cache is always reset when the month changes.

* **today**

  Returns "today" or undefined.

  If `dayObjects = true` it returns today's `Day` else it returns today as a `Number`.

* **month**

  Returns the month `Number` (not 0 indexed)

* **year**

  Returns the full year

* **moment**

  Returns the *moment.js* instance of the `Date` used to build the calendar.

* **nextmonth**

  Returns the *moment.js* instance of the next month.

* **prevmonth**

  Returns the *moment.js* instance of the previous month.



# License

MIT
