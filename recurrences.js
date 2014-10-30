/* jshint node: true */

var parseDate = require("./utils").parseDate;
var days = require("./utils").days.map(function(v) {
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
}

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
  if ("weekly" === type) {
    var daysInWeek = recur.onDays().map(function(v) {
      return dayofWeekIndex(v);
    });

    for(; i < len; i++) {
      var d = parseDate(range[i].moment);
      var date = d.valueOf();      
      if (till && date > till) {
        break;
      }

      if (date >= from && ~daysInWeek.indexOf(d.day())) {
        events.push(clone(event, d));
      }
    } 
  }

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

  if ("yearly" === type) {
    for(; i < len; i++) {
      var d = parseDate(range[i].moment);
      var date = d.valueOf();      
      if (till && date > till) {
        break;
      }

      if (d.month() === m.month() && d.date() === m.date()) {
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

    if ("weekly" === type) {
      s.startOf("week");
      s.add(n, "weeks");
    }

    if ("monthly" === type) {
      s.add(n, "months");
    }

    if ("yearly" === type) {
      s.add(n, "years");
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

