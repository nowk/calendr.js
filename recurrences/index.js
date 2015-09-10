/* jshint node: true */

var parseDate = require("../utils").parseDate;
var days = require("../utils").days.map(function(v) {
  return v.toLowerCase();
});

/**
 * expose
 */

module.exports = recurrences;

/**
 * dayofWeekIndex returns the index of the day of the week by name
 * week starts on Sunday
 *
 * @param {String} dayName
 * @return {Number}
 * @api private
 */

var dayofWeekIndex = function(dayName) {
  return days.indexOf(dayName.toLowerCase());
};

/**
 * condition is the conditional function for each recurrence type
 * TODO optimize
 */

var condition = {
  daily: function(d) {
    return d.valueOf() >= this.from();
  },
  weekly: function(d) {
    var daysInWeek = this.onDays().map(function(v) {
      return dayofWeekIndex(v);
    });
    return d.valueOf() >= this.from() && ~daysInWeek.indexOf(d.day());
  },
  monthly: function(d) {
    var m = parseDate(this.from());
    return d.date() === m.date();
  },
  yearly: function(d) {
    var m = parseDate(this.from());
    return d.month() === m.month() && d.date() === m.date();
  }
};

/**
 * recurrences returns copies of the event for the days in which they recurr
 *
 * @param {Event} event
 * @param {[Day]} range
 * @return {[Event]}
 * @api public
 */

function recurrences(event, range) {
  var recur = new Recur(event);
  if (!recur.yes()) {
    return [event];
  }

  var type = recur.type();
  var from = recur.from();
  var till = recur.till();

  var fn = condition[type];
  if (!!!fn) {
    return [];
  }
  
  var events = [];
  var i = 0;
  var len = range.length;
  var cond = fn.bind(recur);
  for(; i < len; i++) {
    var d = parseDate(range[i].moment, event.tz);
    // adjust to the events timezone for comparison

    var date = d.valueOf();
    if (till && date > till) {
      break;
    }

    if (cond(d)) {
      events.push(clone(event, d));
    }
  }

  return events;
}

/**
 * Recur
 *
 * @constructor
 * @api private
 */

function Recur(event) {
  this.event = event; 
}

/**
 * from returns the date from which the recurrence starts
 *
 * @param {Number} (date as int)
 * @api public
 */

Recur.prototype.from = function() {
  var s = parseDate(this.event.starts);
  s.startOf("day");
  return s.valueOf();
};

/**
 * typesMap maps repeats values to moment add/subtract keys
 */

var typesMap = {
  daily:   "days",
  weekly:  "weeks",
  monthly: "months",
  yearly:  "years"
};

/**
 * till returns teh date at which the recurrence stops
 *
 * @param {Number} (date as int)
 * @api public
 */

Recur.prototype.till = function() {
  var ends = parseDate(this.event.repeatEndsOn);
  if (!!ends) {
    ends.startOf("day");
    return ends.valueOf();
  }

  var type = this.type();
  var n = this.event.repeatTimes;
  var intv = typesMap[type];
  if (n > 0) {
    var s = parseDate(this.event.starts);
    s.startOf("day");
    if ("weekly" === type) {
      s.startOf("week");
    }
    s.add(n, intv);
    return s.valueOf();
  }
};

/**
 * type returns the repeats types, eg. daily, weekly, etc...
 *
 * @return {String}
 * @api public
 */

Recur.prototype.type = function() {
  return this.event.repeats;
};

/**
 * onDays returns the days in which an event recurs
 * Only available for weekly recurrences
 *
 * @return {[String]}
 * @api public
 */

Recur.prototype.onDays = function() {
  return this.event.repeatsOn;
};

/**
 * yes returns true if event repeats
 *
 * @return {Bool}
 * @api public
 */

Recur.prototype.yes = function() {
  return !!this.type();
};

/**
 * tz returns the timezone based on the event starts time
 *
 * @return {Number} timezone offset
 * @api public
 */

Recur.prototype.tz = function() {
  return this.event.starts.utcOffset();
};

/**
 * Event provides a clnne of an event matched to the date of the recurrence
 *
 * @param {Event} event
 * @param {Moment} date
 * @constructor
 * @api private
 */

function Event(event, date) {
  this.event = event; 

  var keys = Object.keys(this.event);
  var self = this;
  var i = 0;
  var len = keys.length;
  for(; i < len; i++) {
    var k = keys[i];
    Object.defineProperty(self, k, {
      value: event[k],
      enumerable: true,
      writable: true
    });
  }

  var n = recurOffset(event.starts, date);
  var tz = this.tz;

  this.starts = parseDate(event.starts.valueOf() + n, tz);
  this.ends = parseDate(event.ends.valueOf() + n, tz);
}

/**
 * recurOffset returns the offset value of the original event from the current
 *
 * @param {Moment} a
 * @param {Moment} b
 * @return {Number}
 * @api private
 */

function recurOffset(a, b) {
  var n = parseDate(a);
  n.startOf("day");
  var m = parseDate(b);
  m.startOf("day");

  return m.valueOf() - n.valueOf();
}

/**
 * clone
 *
 * @param {Event} event
 * @param {Moment} date
 * @return {Event}
 * @api private
 */

function clone(event, date) {
  Event.prototype = event;
  return new Event(event, date);
}

