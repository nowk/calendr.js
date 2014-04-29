
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

var Calendr = module.exports = function(date) {
  var d = this.d = moment(date); // keep reference to original date used to build

  var day = this.day = d.date();
  var month = this.month = d.month()+1;
  var year = this.year = d.year();
  var numofdays = this.numofdays = d.daysInMonth();

  this.monthstartson = moment(year+'-'+month, 'YYYY-MM').day();
  this.monthendson = moment(year+'-'+month+'-'+numofdays, 'YYYY-MM-DD').day();

  this.previousmonth = moment(d.subtract('month', 1));
  this.nextmonth = moment(d.add('month', 1));
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

