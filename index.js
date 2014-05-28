;(function() {
  var moment;

  /*
   * expose Calendr
   */

  if ('undefined' !== typeof module && 'undefined' !== typeof module.exports) {
    moment = require('moment');
    exports = module.exports = Calendr;
  } else {
    if (!('moment' in window)) {
      return console.error('Moment.js is required');
    }
    moment = window.moment;
    window.Calendr = Calendr;
  }

  /*
   * days in english
   */

  var days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  /*
   * months in english
   */

  var months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  /*
   * Calendr
   *
   * @param {Date} origin
   * @param {Object} opts
   * @constructor
   */

  function Calendr(date, opts) {
    this._date = date; // save the original date
    this.moment = moment(this._date);

    opts = opts || {};
    this.auto = opts.auto || false;
    this.dayObjects = opts.dayObjects || false;

    this.build();
  }

  /*
   * build calendar properties
   *
   * @api public
   */

  Calendr.prototype.build = function() {
    this.year = this.moment.year();
    this.month = this.moment.month()+1; // month is 0 indexed
    this.numofdays = this.moment.daysInMonth();
    this.startson = moment(this.year+'-'+this.month, 'YYYY-MM').day();
    this.endson = moment(this.year+'-'+this.month+'-'+this.numofdays, 'YYYY-MM-DD').day();

    if (this.auto) {
      this._grid = this.slice();
    } else {
      delete this._grid; // remove the defined _grid on each build; re-set on next grid call
    }
  };

  /*
   * return the name of the month
   *
   * @api public
   */

  Calendr.prototype.nameOfMonth = function() {
    return months[this.moment.month()];
  };

  /*
   * property alias for #slice
   *
   * @return {Array}
   * @api public
   */

  Calendr.prototype.grid = function() {
    return this._grid || (this._grid = this.slice());
  };

  /*
   * slices the calendar days up into weeks
   *
   * @return {Array}
   * @api public
   */

  Calendr.prototype.slice = function() {
    var days = calendardays.call(this);
    prepad.call(this, days);

    var numofweeks = Math.ceil(days.length / 7);
    var weeks = Array.apply(null, Array(numofweeks)).map(function(o, i) {
      var b = i*7;
      var e = 7*(i+1);
      return days.slice(b, e);
    });

    fill.call(this, weeks[numofweeks-1]);

    return weeks;
  };

  /*
   * move forward one month
   *
   * @api public
   */

  Calendr.prototype.goForwardMonth = function() {
    this.moment.add('month', 1);
    this.build();
  };

  /*
   * move back one month
   *
   * @api public
   */

  Calendr.prototype.goBackMonth = function() {
    this.moment.subtract('month', 1);
    this.build();
  };

  /*
   * return today
   *
   * @return {Day|Number}
   * @api public
   */

  Calendr.prototype.getToday = function() {
    var t = new Date();

    // return if it's not the same month as now
    if (this.month !== t.getMonth()+1 || this.year !== t.getFullYear()) {
      return;
    }

    return this.getDay(t.getDate());
  };

  /*
   * return the day
   *
   * @param {Number} date
   * @return {Day}
   * @api public
   */

  Calendr.prototype.getDay = function(date) {
    var dayi = (date-1)+this.startson; // offset with the actual start on index
    var weeki = Math.floor(dayi/7);

    // get the dayi offset if not in the first week
    if (weeki > 0) {
      dayi = dayi-(weeki*7); 
    }

    return this.grid()[weeki][dayi];
  };

  /*
   * define events for the calendr month
   *
   * @param {Array} events
   * @api public
   */

  Calendr.prototype.events = function(events) {
    events = events || [];

    if ('undefined' === typeof this._grid) {
      this.grid();
    }

    var self = this;
    var i = 0;
    var len = events.length;
    for(; i<len; i++) {
      var event = events[i];
      var day = self.getDay(event.startson.getDate());
      if (day) {
        day.events.push(event);
      }
    }
  };

  /*
   * create an array of calendar days
   *
   * @return {Array}
   * @api private
   */

  function calendardays() {
    var self = this;
    var month = this.moment;
    var days = Array.apply(null, Array(this.numofdays));
    return days.map(function(d, i) {
      return day.call(self, (i+1), month);
    });
  }

  /*
   * pad days so 1st day starts on same index of day of the week
   *
   * @param {Array} days
   * @api private
   */

  function prepad(days) {
    var self = this;
    var month = moment(new Date(this.moment)).subtract('month', 1);
    var numofdayslastmonth = month.daysInMonth();
    var i = 0;
    var index = this.startson;
    for(; i<index; i++) {
      days.splice(0, 0, day.call(self, (numofdayslastmonth-i), month));
    }
  }

  /*
   * pad the last week to be a full 7 length array
   *
   * @param {Array} week
   * @api private
   */

  function fill(week) {
    var self = this;
    var month = moment(new Date(this.moment)).add('month', 1);
    var i = 0;
    var len = 7-week.length;
    for(; i<len; i++) {
      week.push(day.call(self, (i+1), month));
    }
  }


  /*
   * expose Day
   */

  exports.Day = Day;

  /*
   * Day object
   *
   * @constructor
   */

  function Day(year, month, date) {
    this._toDate = new Date(year, month-1, date);
    this.events = [];
  }

  /*
   * toDate
   *
   * @return {Date}
   */

  Day.prototype.toDate = function() {
    return this._toDate;
  };

  /*
   * date
   *
   * @return {Number}
   * @api public
   */

  Day.prototype.date = function() {
    return this._toDate.getDate();
  };

  /*
   * month
   *
   * @return {Number}
   * @api public
   */

  Day.prototype.month = function() {
    return this._toDate.getMonth()+1; // 1 indexed
  };

  /*
   * year
   *
   * @return {Number}
   * @api public
   */

  Day.prototype.year = function() {
    return this._toDate.getFullYear();
  };

  /*
   * day of the week (Monday, Tuesday, etc...)
   *
   * @return {String}
   * @api public
   */

  Day.prototype.dayOfWeek = function() {
    return days[moment(this._toDate).day()];
  };

  /*
   * month name
   *
   * @return {String}
   * @api public
   */

  Day.prototype.nameOfMonth = function() {
    return months[this.month()-1];
  };

  /*
   * is it today?
   *
   * @return {Boolean}
   * @api public
   */

  Day.prototype.isToday = function() {
    var now = new Date();
    return this._toDate.getTime() ===
      new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  };

  /*
   * return day object or numer
   *
   * @param {Number} date
   * @param {Moment} moment
   * @return {Day|Number}
   * @api private
   */

  function day(date, moment) {
    if (this.dayObjects) {
      return new Day(moment.year(), moment.month()+1, date);
    } else {
      return date;
    }
  }
})();

