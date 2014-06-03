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

    // sort events by date, name ASC
    events.sort(sortByNameDate);

    var self = this;
    var i = 0;
    var len = events.length;
    for(; i<len; i++) {
      var dates = [];
      var event = events[i];
      event.startson = new Date(event.startson);
      event.repeatEndson = new Date(event.repeatEndson);

      if (!(self.moment.year() >= event.startson.getFullYear() &&
        self.moment.month() >= event.startson.getMonth())) {
        continue;
      }

      var startson = (event.startson.getMonth() < self.moment.month()) ?
        1 : // event recurrs from the previous month
        event.startson.getDate();

      if (self.getDay(startson)) {
        if ('daily' === event.repeats) {
          dates = dailyRecurring(self, event);
        } else if ('weekly' === event.repeats) {
          dates = weeklyRecurring(self, event);
        } else {
          if (self.moment.year() === event.startson.getFullYear() &&
            self.moment.month() === event.startson.getMonth()) {
            dates = [startson];
          } else {
            dates = [];
          }
        }

        // iterate through given dates and set events
        for(var a=0, b=dates.length; a<b; a++) {
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
    }
  };

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
    var offset = event.startson.getDate();
    var i = offset;
    var len;

    if (cal.moment.month() > event.startson.getMonth()) {
      i = 1;
    }

    if (!!event.repeatTimes) {
      len = i+event.repeatTimes-1;

      // ensure len actually spans into the next month
      if (cal.moment.month() > event.startson.getMonth()) {
        var startMonth = moment(event.startson);
        if (len+offset <= startMonth.daysInMonth()) {
          return [];
        }
      }

      if (len > cal.numofdays) {
        var thismonth = cal.moment.month();
        while(thismonth>event.startson.getMonth()) {
          var numofdays = new Date(cal.moment.year(), thismonth, 0).getDate();
          len = len-(numofdays-1);
          thismonth--;
        }

        if (len > cal.numofdays) {
          len = cal.numofdays;
        }

        len++; // days are 1 indexed
      }
    } else if(!!event.repeatEndson &&
      event.repeatEndson.getFullYear() === cal.moment.year() &&
      event.repeatEndson.getMonth() === cal.moment.month()) {

      len = event.repeatEndson.getDate();
    } else {
      len = cal.numofdays+1;
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

    if (cal.moment.month() > event.startson.getMonth()) {
      i = 0;
    }

    if (!!event.repeatTimes) {
      len = offset+event.repeatTimes-1;

      // ensure len actually spans into the next month
      if (cal.moment.month() > event.startson.getMonth()) {
        if (len < numberOfWeeks(event.startson)) {
          return [];
        }
      }

      if (len > cal.grid().length) {
        var thismonth = cal.moment.month();
        while(thismonth>event.startson.getMonth()) {
          var m = new Date(cal.moment.year(), cal.moment.month()-thismonth);
          len = len-(numberOfWeeks(m)-1);
          thismonth--;
        }

        if (len > cal.grid().length) {
          len = cal.grid().length;
        }

        len--; // weeks are 0 indexed
      }
    } else if (!!event.repeatEndson &&
      event.repeatEndson.getFullYear() === cal.moment.year() &&
      event.repeatEndson.getMonth() === cal.moment.month()) {

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
        if (event.startson.getMonth() === cal.moment.month()) {
          if (date < event.startson.getDate()) continue;
        }

        // remove dates after to the repeate ends on date
        if (event.repeatEndson &&
          event.repeatEndson.getFullYear() === cal.moment.year()) {

          if (event.repeatEndson.getMonth() === cal.moment.month()) {
            if (date > event.repeatEndson.getDate()) continue;
          } else if (event.repeatEndson.getMonth() < cal.moment.month()) {
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
    date = moment(date);
    var month = moment(new Date(date.year(), date.month(), 1));
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
    date = moment(date);
    var month = moment(new Date(date.year(), date.month(), 1));
    return Math.ceil((month.day()+month.daysInMonth())/7);
  }
})();
