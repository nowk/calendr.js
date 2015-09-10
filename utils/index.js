/* jshint node: true */

var  moment = require("moment");

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
 * @param {String|Number|Date|Moment} v
 * @param {String|Number} tz
 * @return {Moment}
 * @api private
 */

exports.parseDate = function(v, tz) {
  if (!!!v) {
    return;
  }

  var m = moment(v);
  if ("undefined" !== typeof tz) {
    m.utcOffset(tz);
  }

  return m;
};
