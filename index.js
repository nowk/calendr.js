;(function() {
  var moment;

  /*
   * expose Calendr
   */

  if ('undefined' !== typeof module && 'undefined' !== typeof module.exports) {
    moment = require('moment');

    module.exports = Calendr;
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
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
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
    'Decemmber'
  ];


  /*
   * Calendr
   *
   * @param {Date} origin
   * @constructor
   */

  function Calendr(date) {
    this._date = date;
    this.dayObjects = false;

    this.build();
  }


  /*
   * build calendar properties
   *
   * @param {Date} date
   * @api public
   */

  Calendr.prototype.build = function() {
    this.moment = moment(this._date);

    this.month = this.moment.month()+1; // month is 0 indexed
    this.year = this.moment.year();

    this.monthInEnglish = months[this.month-1];

    this.numofdays = this.moment.daysInMonth();
    this.startson = moment(this.year+'-'+this.month, 'YYYY-MM').day();
    this.endson = moment(this.year+'-'+this.month+'-'+this.numofdays, 'YYYY-MM-DD').day();

    this.prevmonth = moment(new Date(this.moment)).subtract('month', 1);
    this.nextmonth = moment(new Date(this.moment)).add('month', 1);
  };


  /*
   * property alias for #slice
   *
   * @return {Array}
   * @api public
   */

  Calendr.prototype.__defineGetter__('grid', function() {
    return this.slice();
  });


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
   * create an array of calendar days
   *
   * @return {Array}
   * @api private
   */

  function calendardays() {
    var self = this;
    var month = self.moment;
    var days = Array.apply(null, Array(self.numofdays));

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
    var month = self.prevmonth;
    var numofdayslastmonth = month.daysInMonth();

    var i = 0;
    var index = self.startson;
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
    var month = self.nextmonth;

    var i = 0;
    var len = 7-week.length;
    for(; i<len; i++) {
      week.push(day.call(self, (i+1), month));
    }
  }


  /*
   * Day object
   *
   * @constructor
   */

  function Day(date, month, year) {
    this.date = date;
    this.month = month;
    this.year = year;
  }


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
      return new Day(date, moment.month()+1, moment.year());
    } else {
      return date;
    }
  }

})();

