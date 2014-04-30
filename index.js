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
   * Calendr
   *
   * @param {Date} date
   * @constructor
   */

  function Calendr(d) {
    this.d = moment(d); // keep reference to original date used to build
    this.date = this.d.date();
    this.month = this.d.month()+1;
    this.year = this.d.year();
    this.numofdays = this.d.daysInMonth();
    this.monthstartson = moment(this.year+'-'+this.month, 'YYYY-MM').day();
    this.monthendson = moment(this.year+'-'+this.month+'-'+this.numofdays, 'YYYY-MM-DD').day();
    this.previousmonth = moment(new Date(this.d)).subtract('month', 1);
    this.nextmonth = moment(new Date(this.d)).add('month', 1);

    this.dayObjects = false;
  }


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
    var month = self.d;
    var days = Array.apply(null, Array(this.numofdays));
    return days.map(function(d, i) {
      var n = i+1;
      return day.call(self, n, month);
    });
  }


  /*
   * pad days so 1st day starts on same index of day of the week
   *
   * @param {Array} days
   * @param {Number} index
   * @return {Array}
   * @api private
   */

  function prepad(days) {
    var self = this;
    var month = self.previousmonth;
    var numofdayslastmonth = month.daysInMonth();
    var i = 0;
    var index = self.monthstartson;
    for(; i<index; i++) {
      var n = numofdayslastmonth-i;
      days.splice(0, 0, day.call(self, n, month));
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
      var n = i+1;
      week.push(day.call(self, n, month));
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
   */

  function day(date, moment) {
    if (this.dayObjects) {
      return new Day(date, moment.month()+1, moment.year());
    } else {
      return date;
    }
  }

})();

