/* jshint node: true */

var moment = require("moment");

/**
 * days in english
 */

exports.days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

/**
 * months in english
 */

exports.months = [
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


/**
 * parseDate converts to Date
 *
 * @param {String|Number|Date} v
 * @return {Moment}
 * @api private
 */

exports.parseDate = function(v) {
  if (!!!v) {
    return;
  }

  return moment(v);
}