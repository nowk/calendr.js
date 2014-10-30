/* jshint node: true */

var moment = require("moment");

/**
 * expose Event
 */

module.exports = Event;

/**
 * parseDate converts to Date
 *
 * @param {String|Number|Date} v
 * @return {Moment}
 * @api private
 */

var parseDate = function(v) {
  if (!!!v) {
    return;
  }

  return moment(v);
}

/**
 * defaultConfig is the default mapping table
 */

var defaultConfig = {
  id:           "id",
  name:         "name",
  description:  "description",
  starts:       "starts",
  ends:         "ends",
  repeats:      "repeats",
  repeatsOn:    "repeats_on",
  repeatEndsOn: "repeat_ends_on",
  repeatTimes:  "repeat_times"
}

/**
 * extend extends the config object with any missing properties from 
 * defaultConfig
 *
 * @param {Object} orig
 * @return {Object}
 * @api private
 */

function extend(config) {
  var keys = Object.keys(defaultConfig);
  var copy = {};
  var i = 1;
  var len = keys.length;
  for(; i < len; i++) {
    var k = keys[i];
    var v = config[k];
    copy[k] = !!v ? v : defaultConfig[k];
  }

  return copy;
}

/**
 * assign assigns properties from data based on config
 *
 * @param {Object} obj
 * @param {Object} config
 * @api private
 */

function assign(obj, config) {
  var self = this;
  var conf = !!config ? extend(config) : defaultConfig;
  var keys = Object.keys(conf);
  var i = 0;
  var len = keys.length;
  for(; i < len; i++) {
    var k = keys[i];
    var v = conf[k];
    self[k] = obj[v];
  }
}

/**
* Event is the underlying data structure of an event.
* This object does not get applied into a calendar grid itself. It spawns off
* clones that are representative of the Event in relation to a give calendar.
*
* @param {Object} obj (should be plain old object, like a JSON parse)
* @param {Object} config
* @constructor
* @api public
*/

function Event(obj, config) {
  assign.call(this, (obj || {}), config);

  this.starts = parseDate(this.starts);
  this.ends = parseDate(this.ends);
  this.repeatEndsOn = parseDate(this.repeatEndsOn);
  if (!!!this.starts || !!!this.ends) {
    throw new Error("must have a starts and ends date") ;
  }
}

/**
 * duration returns the duration of an event
 *
 * @return {Duration}
 * @api public
 */

Event.prototype.duration = function() {
  return new Duration(this.starts, this.ends);
};

/**
 * days returns a collection of EventDays in which the event spans across
 *
 * @return {[EventDay]}
 * @api public
 */

Event.prototype.days = function() {
  var d = this.duration();
  var self = this;
  var days = [];
  var i = 0;
  var len = d.length();
  for(; i < len; i++) {
    days.push(new EventDay(self, i));
  }
  return days;
};

/**
 * placeOn places the Event's days on the given calendar
 *
 * @param {Calendr} cal
 * @api public
 */

Event.prototype.placeOn = function(cal) {
  var days = this.days(); 
  var i = 0;
  var len = days.length;
  for(; i < len; i++) {
    var d = days[i];
    d.placeOn(cal);
  }
}

/**
 * EventDay is a struct in which Event is cloned onto
 * It is a cloned representation of the event on a particular span of day
 * associated with the event
 *
 * @param {Event} event
 * @param {Number} i (index of the day in the span of the event)
 * @constructor
 * @api private
 */

function EventDay(event, i) {
  this.event = event;
  this.i = i || 0;

  var date = this.date = parseDate(this.event.starts);
  date.startOf("day");
  date.add(this.i, "days");

  assign.call(this, event, defaultConfig);
  this.starts = starts.call(this);
  this.ends = ends.call(this);
};

/**
 * placeOn places the EventDay on the calender
 *
 * @param {Calendr} cal
 * @api public
 */

EventDay.prototype.placeOn = function(cal) {
  var cm = parseDate(cal.moment).startOf("month");
  var tm = parseDate(this.date).startOf("month");
  if (!sameDate(cm, tm)) {
    return;
  }

  var i = this.date.date();
  var day = cal.getDay(i);
  day.events.push(this);
};

/**
 * start returns the start date of the event for the given day
 * 
 * @return {Moment}
 * @api private
 */

function starts() {
  var starts = parseDate(this.event.starts);
  starts.startOf("day");
  if (sameDate(this.date, starts)) {
    return this.event.starts;
  }

  var sod = parseDate(this.date);
  sod.startOf("day");
  return sod;
}

/**
 * ends returns the end date of the event for the given day
 * 
 * @return {Moment}
 * @api private
 */

function ends() {
  var ends = parseDate(this.event.ends);
  ends.startOf("day");
  if (sameDate(this.date, ends)) {
    return this.event.ends;
  }

  var eod = parseDate(this.date);
  eod.endOf("day");
  return eod;
}

/**
 * sameDate compares a pair of dates by their int representations
 * 
 * @param {Moment} a 
 * @param {Moment} b 
 * @return {Bool}
 * @api private
 */

function sameDate(a, b) {
  return a.valueOf() === b.valueOf(); 
}

/**
 * Duration
 *
 * @param {Date} starts
 * @param {Date} ends
 * @constructor
 * @api private
 */

function Duration(starts, ends) {
  this.starts = parseDate(starts);
  this.ends = parseDate(ends);
}

/**
 * ms chart
 */

var ms_in_sec = 1000;
var ms_in_min = 60 * ms_in_sec;
var ms_in_hr = 60 * ms_in_min;
var ms_in_day = 24 * ms_in_hr;

/**
 * length returns the number of days an event spans in relation to a calendar
 * grid, this is not a 24 hour representation of length
 *
 * @return {Number}
 * @api public
 */

Duration.prototype.length = function() {
  var a = this.starts;
  var b = this.ends;
  a.hours(0);
  b.hours(0);

  var offset = 1; // always offset by 1 to account for the day of
  return Math.ceil((b.valueOf() - a.valueOf()) / ms_in_day) + offset; 
};