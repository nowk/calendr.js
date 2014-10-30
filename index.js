/* jshint node: true */

var parseDate = require('./utils').parseDate;
var months = require("./utils").months;
var Day = require("./day");

/**
 * expose
 */

module.exports = Calendr;

/*
 * Calendr
 *
 * @param {Date} origin
 * @param {Object} opts
 * @constructor
 */

function Calendr(date, opts) {
  opts = opts || {};
  this.auto = opts.auto || false;
  this.dayObjects = opts.dayObjects || false;
  this.moment = parseDate([date.getFullYear(), date.getMonth(), 1]);
  this.build();
}

/*
 * build calendar properties
 *
 * @api public
 */

Calendr.prototype.build = function() {
  var base = [this.moment.year(), this.moment.month()];
  this.i = parseDate(base.concat([1])).day();
  this.len = parseDate(base.concat([this.moment.daysInMonth()])).day();

  if (this.auto) {
    this._grid = this.slice();
  } else {
    delete this._grid; // remove the defined _grid on each build; re-set on next grid call
  }
};

/*
 * return calendar month (1 indexed)
 *
 * @return {Number}
 * @api public
 */

Calendr.prototype.month = function() {
  return this.moment.month()+1;
};

/*
 * return calendar year
 *
 * @return {Number}
 * @api public
 */

Calendr.prototype.year = function() {
  return this.moment.year();
};

/*
 * return the name of the month
 *
 * @param {Number} offset
 * @return {String}
 * @api public
 */

Calendr.prototype.monthName = function(offset) {
  if ("undefined" === typeof offset) {
    offset = 0;
  }

  var index = this.moment.month()+offset;
  if (index < 0) {
    index = 12+index;
  } else if (index > 11) {
    index = 12-index;
  }

  return months[index];
};

/*
 * prevMonthName is a helper method to return the previous month's name
 *
 * @return string
 * @api public
 */

Calendr.prototype.prevMonthName = function() {
  return this.monthName(-1);
};

/*
 * nextMonthName is a helper method to return the next month's name
 *
 * @return string
 * @api public
 */

Calendr.prototype.nextMonthName = function() {
  return this.monthName(1);
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
  if (this.month() !== t.getMonth()+1 || this.year() !== t.getFullYear()) {
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
  var dayi = (date-1)+this.moment.day(); // offset with the actual start on index
  var weeki = Math.floor(dayi/7);

  // get the dayi offset if not in the first week
  if (weeki > 0) {
    dayi = dayi-(weeki*7); 
  }

  return this.grid()[weeki][dayi];
};

/*
 * create an array of calendar days
 *
 * @return {Array}
 * @api private
 */

function calendardays() {
  var self = this;
  var days = Array.apply(null, Array(this.moment.daysInMonth()));
  return days.map(function(d, i) {
    return day.call(self, (i+1), self.moment);
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
  var prevmonth = parseDate(this.moment).subtract('month', 1);
  var i = 0;
  var index = this.moment.day();
  for(; i<index; i++) {
    days.splice(0, 0, day.call(self, (prevmonth.daysInMonth()-i), prevmonth));
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
  var nextmonth = parseDate(this.moment).add('month', 1);
  var i = 0;
  var len = 7-week.length;
  for(; i<len; i++) {
    week.push(day.call(self, (i+1), nextmonth));
  }
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
    return new Day(moment.year(), moment.month(), date);
  }

  return date;
}