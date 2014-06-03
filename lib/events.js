;(function() {
  var moment;
  var Calendr;

  if ('undefined' !== typeof module && 'undefined' !== typeof module.exports) {
    moment = require('moment');
    Calendr = require('..');
    module.exports = {};
  } else {
    if (!('moment' in window)) {
      return console.error("Moment.js is required");
    }

    if (!('Calendr' in window)) {
      return console.error("Calendr.js is required");
    }
    moment = window.moment;
    Calendr = window.Calendr;
  }

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
   * define events for the calendr month
   *
   * @param {Array} events
   * @api public
   */

  Calendr.prototype.events = function(events) {
    if (!this.dayObjects) {
      var msg = 'Calendr must be set with dayObjects = true to use the `events` method';
      throw new Error(msg);
    }

    events = events || [];
    if (0 === events.length) {
      return;
    }

    if ('undefined' === typeof this._grid) {
      this.grid();
    }

    // TODO sorting needs to be done per day basis, repeats will not hold this
    events.sort(sortByNameDate); // sort events by date, name ASC

    var self = this;
    var i = 0;
    var len = events.length;
    for(; i<len; i++) {
      var dates = [];
      var event = events[i];

      event.startson = moment(event.startson);
      event.repeatEndson = event.repeatEndson && moment(event.repeatEndson);

      if (outofBounds('month', self, event.startson, '>=')) {
        continue;
      }

      dates = eventDates(self, event);

      var a = 0;
      var b = dates.length;
      for(; a<b; a++) {
        var date = dates[a];

        // TODO events should be populated to padding days?
        // return if date is larger than the last day in the month
        if (date > self.moment.daysInMonth()) {
          continue;
        }

        var day = self.getDay(date);
        if (day) {
          day.events.push(event);
        }
      }
    }
  };

  /*
   * event dates
   *
   * @param {Calendr} cal
   * @param {Object} event
   * @return {Array}
   * @api private
   */

  function eventDates(cal, event) {
    var dates = [];
    var repeatable = {
      daily: dailyRecurring,
      weekly: weeklyRecurring
    };

    if (event.repeats in repeatable) {
      dates = repeatable[event.repeats](cal, event);
    } else {
      dates = outofBounds('month', cal, event.startson) ?
        [] :
        [event.startson.date()];
    }

    return dates;
  }

  /*
   * operators
   */

  var operators = {
    '===': function(a, b) {
      return a === b;
    },
    '>=': function(a, b) {
      return a >= b;
    },
    '>': function(a, b) {
      return a > b;
    }
  };

  /*
   * cal vs event boundries
   *
   * @param {String} thresh
   * @param {Calendr} cal
   * @param {Moment} date
   * @param {String} op
   * @return {Boolean}
   * @api private
   */

  function outofBounds(thresh, cal, date, op) {
    op = operators[op] || operators['==='];

    switch(thresh) {
      case 'month':
        return !(date &&
          op(cal.moment.year(), date.year()) && op(cal.moment.month(), date.month()));

      case 'month!':
        return !(date && op(cal.moment.month(), date.month()));

      case 'year':
        return !(date && op(cal.moment.year(), date.year()));
    }
  }

  /*
   * sort by date, name ASC
   */

  function sortByNameDate(a, b) {
    var rsec = 100000;
    var aint = parseInt(new Date(a.startson).getTime()/rsec, 10);
    var bint = parseInt(new Date(b.startson).getTime()/rsec, 10);

    if (aint === bint) { // date is the same
      if (a.name > b.name) {
        return 1;
      } else if(a.name < b.name) {
        return -1;
      } else {
        return 0;
      }
    }

    return aint - bint;
  }

  /*
   * return index of day in week, by date name
   *
   * @param {String} dayName
   * @return {Number{
   * @api private
   */

  function dayNameIndex(dayName) {
    return days.indexOf(dayName.toLowerCase());
  }

  /*
   * daily recurring events
   *
   * @param {Calendr} cal
   * @param {Object} event
   * @return {Array}
   * @api private
   */

  function dailyRecurring(cal, event) {
    var dates = [];
    var len;
    var numofdays = cal.numofdays;
    var calendar = cal.moment;
    var starts = event.startson;
    var rends = event.repeatEndson;
    var _month = calendar.month();
    var smonth = starts.month();
    var offset = starts.date();

    var i = (_month > smonth) ? 1 : offset;

    if (!!event.repeatTimes) {
      len = i+event.repeatTimes-1;

      // ensure len actually spans into the next month
      if (_month > smonth && len+offset <= starts.daysInMonth()) {
        return [];
      }

      if (len>numofdays) {
        while(_month>smonth) {
          var daysinmonth = moment([calendar.year(), (_month-1), 1]).daysInMonth();
          len = len-(daysinmonth-1);
          _month--;
        }

        if (len>numofdays) {
          len = numofdays;
        }

        len++; // days are 1 indexed
      }
    } else {
      len = !outofBounds('month', cal, rends) ? rends.date() : numofdays+1;
    }

    for(; i<=len; i++) {
      dates.push(i);
    }

    return dates;
  }

  /*
   * weekly recurring events
   *
   * @param {Calendr} cal
   * @param {Object} event
   * @return {Array}
   * @api private
   */

  function weeklyRecurring(cal, event) {
    var dates = [];
    var offset = indexOfWeek(event.startson);
    var i = offset;
    var len;

    if (cal.moment.month() > event.startson.month()) {
      i = 0;
    }

    if (!!event.repeatTimes) {
      len = offset+event.repeatTimes-1;

      // ensure len actually spans into the next month
      if (cal.moment.month() > event.startson.month()) {
        if (len < numberOfWeeks(event.startson)) {
          return [];
        }
      }

      if (len > cal.grid().length) {
        var thismonth = cal.moment.month();
        while(thismonth>event.startson.month()) {
          var m = moment([cal.moment.year(), cal.moment.month()-thismonth, 1]);
          len = len-(numberOfWeeks(m)-1);
          thismonth--;
        }

        if (len > cal.grid().length) {
          len = cal.grid().length;
        }

        len--; // weeks are 0 indexed
      }
    } else if (!!event.repeatEndson && !outofBounds('month', cal, event.repeatEndson)) {
      len = indexOfWeek(event.repeatEndson);
    } else {
      len = cal.grid().length-1;
    }

    var repeatsOn = event.repeatsOn.map(dayNameIndex);
    var r = repeatsOn.length;
    for(; i<=len; i++) {
      var p = 0;
      for(; p<r; p++) {
        var date = repeatsOn[p]-cal.startson;
        if (i > 0) {
          date = date+(i*7);
        }

        if (date < 0) {
          continue;
        }

        date++;

        // remove dates previous to the start date
        if (event.startson.month() === cal.moment.month()) {
          if (date < event.startson.date()) continue;
        }

        // remove dates after to the repeate ends on date
        if (!outofBounds('year', cal, event.repeatEndson)) {
          if (event.repeatEndson.month() === cal.moment.month()) {
            if (date > event.repeatEndson.date()) continue;
          } else if (event.repeatEndson.month() < cal.moment.month()) {
            continue;
          }
        }

        dates.push(date);
      }
    }

    return dates;
  }

  /*
   * return index of week from date
   *
   * @param {Date} date
   * @return {Number}
   * @api private
   */

  function indexOfWeek(date) {
    var month = moment([date.year(), date.month(), 1]);
    return Math.floor(((date.date()-1)+month.day())/7);
  }

  /*
   * return number of weeks in date month
   *
   * @param {Date} date
   * @return {Number}
   * @api private
   */

  function numberOfWeeks(date) {
    var month = moment([date.year(), date.month(), 1]);
    return Math.ceil((month.day()+month.daysInMonth())/7);
  }
})();

