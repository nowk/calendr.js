/* jshint node: true */

var parseDate = require("./utils").parseDate;

/**
 * expose
 */

module.exports = recurrences;

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
    return [];
  }

  var type = recur.type();
  var from = recur.from();
  var till = recur.till();

  var events = [];
  var i = 0;
  var len = range.length;
  if ("daily" === type) {
    for(; i < len; i++) {
      var d = parseDate(range[i].moment);
      var date = d.valueOf();
      if (till && date > till) {
        break;
      }

      if (date >= from) {
        events.push(clone(event, d));
      }
    }
  }

  var m = parseDate(from);
  if ("monthly" === type) {
    for(; i < len; i++) {
      var d = parseDate(range[i].moment);
      var date = d.valueOf();      
      if (till && date > till) {
        break;
      }

      if (d.date() === m.date()) {
        events.push(clone(event, d));
      }
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
  if (n > 0) {
    var s = parseDate(this.event.starts);
    s.startOf("day");
    if ("daily" === type) {
      s.add(n, "days");
    }

    if ("monthly" === type) {
      s.add(n, "months");
    }
    
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
 * yes returns true if event repeats
 *
 * @return {Bool}
 * @api public
 */

Recur.prototype.yes = function() {
  return !!this.type();
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

