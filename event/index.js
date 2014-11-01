/* jshint node: true */

var extend = require("node.extend");
var parseDate = require("../utils").parseDate;

/**
 * expose Event
 */

module.exports = Event;

/**
 * defaultConfig is the default mapping table
 */

var defaultConfig = {
  starts:       "starts",
  ends:         "ends",
  repeats:      "repeats",
  repeatsOn:    "repeats_on",
  repeatEndsOn: "repeat_ends_on",
  repeatTimes:  "repeat_times"
};


/**
 * assign assigns properties from data based on config
 *
 * @param {Object} obj
 * @param {Object} config
 * @api private
 */

function assign(obj, config) {
  var self = this;
  var conf = extend({}, defaultConfig, config);
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
* @param {String|Number} tz
* @constructor
* @api public
*/

function Event(obj, config, tz) {
  assign.call(this, (obj || {}), config);

  this.starts = parseDate(this.starts, tz);  
  this.ends = parseDate(this.ends, tz);
  this.repeatEndsOn = parseDate(this.repeatEndsOn, tz);

  if (!!!this.starts || !!!this.ends) {
    throw new Error("must have a starts and ends date") ;
  }

  this.tz = this.starts.zone();
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
};

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
  date.add(this.i, "days");

  var self = this;
  var keys = Object.keys(this.event);
  var n = 0;
  var len = keys.length;
  for(; n < len; n++) {
    var k = keys[n];
    Object.defineProperty(self, k, {
      value: event[k],
      enumerable: true,
      writable: true
    });
  }

  this.starts = parseDate(this.starts);
  this.ends = parseDate(this.ends);
  adjustDates.call(this);
}

/**
 * adjustDates adjusts the EventDay start dates based on it's location in the
 * span
 *
 * @api private
 */

function adjustDates() {
  var f = this.isFirst();
  var l = this.isLast();
  if (f && l) {
    return;
  }

  if (f) {
    this.ends = parseDate(this.starts);
    this.ends.endOf("day");
    return;
  }

  if (l) {
    this.starts = parseDate(this.ends);
    this.starts.startOf("day");
    return;
  }

  if (!f || !l) {
    this.starts = parseDate(this.date);
    this.ends = parseDate(this.date);
    this.starts.startOf("day");
    this.ends.endOf("day");
  }
}

/**
 * isFirst returns true if the EventDay is the first day in the span
 *
 * @return {Bool}
 * @api public
 */

EventDay.prototype.isFirst = function() {
  return this.i === 0;
}

/**
 * isLast returns true if the EventDay is the last in the span
 *
 * @return {Bool}
 * @api public
 */

EventDay.prototype.isLast = function() {
  var d = this.event.duration();
  var len = d.length();
  return this.i === len - 1;
}

/**
 * placeOn places the EventDay on the calender
 *
 * @param {Calendr} cal
 * @api public
 */

EventDay.prototype.placeOn = function(cal) {
  var day = cal.getDay(parseDate(this.date, cal.moment.zone()));
  if ("undefined" === typeof day) {
    return;
  }

  day.events.push(this);
};

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