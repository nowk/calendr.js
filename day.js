/* jshint node: true */

var moment = require("moment");
var months = require("./utils").months;
var days = require("./utils").days;

/**
 * expose
 */

module.exports = Day;

/*
 * Day object
 *
 * @param {Number} year (full year eg. 2014)
 * @param {Number} month (0 January)
 * @param {Number} date (1..31)
 * @constructor
 */

function Day(year, month, date) {
  this.moment = moment(new Date(year, month, date));
  this.events = [];
}

/*
 * date
 *
 * @return {Number}
 * @api public
 */

Day.prototype.date = function() {
  return this.moment.date();
};

/*
 * month returns the month (0 January)
 *
 * @return {Number}
 * @api public
 */

Day.prototype.month = function() {
  return this.moment.month();
};

/*
 * year
 *
 * @return {Number}
 * @api public
 */

Day.prototype.year = function() {
  return this.moment.year();
};

/*
 * day of the week (Monday, Tuesday, etc...)
 *
 * @return {String}
 * @api public
 */

Day.prototype.name = function() {
  return days[this.moment.day()];
};

/*
 * month name
 *
 * @return {String}
 * @api public
 */

Day.prototype.monthName = function() {
  return months[this.month()];
};

/*
 * is it today?
 *
 * @return {Boolean}
 * @api public
 */

Day.prototype.isToday = function() {
  var _now = new Date();
  _now.setHours(0, 0, 0, 0);

  var now = parseInt(_now.getTime()/100000, 10);      // milliseconds
  var thisday = parseInt(this.moment.unix()/100, 10); // seconds
  return thisday === now;
};

/**
 * getTime is akin to Date's own getTime()
 *
 * @return {Number}
 * @api public
 */

Day.prototype.getTime = function() {
  return this.moment.valueOf();
}