
/*
 * dependencies
 */

var moment = require('moment');


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

var Calendr = module.exports = function(d) {
  this.d = moment(d); // keep reference to original date used to build
  this.date = this.d.date();
  this.month = this.d.month()+1;
  this.year = this.d.year();
  this.numofdays = this.d.daysInMonth();
  this.monthstartson = moment(this.year+'-'+this.month, 'YYYY-MM').day();
  this.monthendson = moment(this.year+'-'+this.month+'-'+this.numofdays, 'YYYY-MM-DD').day();
  this.previousmonth = moment(this.d.subtract('month', 1));
  this.nextmonth = moment(this.d.add('month', 1));
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

  fill(weeks[numofweeks-1]);

  return weeks;
};


/*
 * create an array of calendar days
 *
 * @return {Array}
 * @api private
 */

function calendardays() {
  var days = Array.apply(null, Array(this.numofdays));
  return days.map(function(d, i) {
    return i+1;
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
  var numofdayslastmonth = this.previousmonth.daysInMonth();
  var i = 0;
  var index = this.monthstartson;
  for(; i<index; i++) {
    days.splice(0, 0, (numofdayslastmonth-i));
  }
}


/*
 * pad the last week to be a full 7 length array
 *
 * @param {Array} week
 * @api private
 */

function fill(week) {
  var i = 0;
  var len = 7-week.length;
  for(; i<len; i++) {
    week.push(i+1);
  }
}

