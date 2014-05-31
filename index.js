;(function() {
  var moment;

  /*
   * expose Calendr
   */

  if ('undefined' !== typeof module && 'undefined' !== typeof module.exports) {
    moment = require('moment');
    exports = module.exports = Calendr;
  } else {
    if (!('moment' in window)) {
      return console.error('Moment.js is required');
    }
    moment = window.moment;
    window.Calendr = Calendr;
  }

  /*
   * days in english
   */

  var days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  /*
   * months in english
   */

  var months = [
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

  /*
   * Calendr
   *
   * @param {Date} origin
   * @param {Object} opts
   * @constructor
   */

  function Calendr(date, opts) {
    this._date = date; // save the original date
    this.moment = moment(this._date);

    opts = opts || {};
    this.auto = opts.auto || false;
    this.dayObjects = opts.dayObjects || false;

    this.build();
  }

  /*
   * build calendar properties
   *
   * @api public
   */

  Calendr.prototype.build = function() {
    this.year = this.moment.year();
    this.month = this.moment.month()+1; // month is 0 indexed
    this.numofdays = this.moment.daysInMonth();
    this.startson = moment(this.year+'-'+this.month, 'YYYY-MM').day();
    this.endson = moment(this.year+'-'+this.month+'-'+this.numofdays, 'YYYY-MM-DD').day();

    if (this.auto) {
      this._grid = this.slice();
    } else {
      delete this._grid; // remove the defined _grid on each build; re-set on next grid call
    }
  };

  /*
   * return the name of the month
   *
   * @api public
   */

  Calendr.prototype.nameOfMonth = function() {
    return months[this.moment.month()];
  };

  /*
   * property alias for #slice
   *
   * @return {Array}
   * @api public
   */

  Calendr.prototype.grid = function() {
    return this._grid || (this._grid = this.slice());
  };

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

    fill.call(this, weeks[numofweeks-1]);

    return weeks;
  };

  /*
   * move forward one month
   *
   * @api public
   */

  Calendr.prototype.goForwardMonth = function() {
    this.moment.add('month', 1);
    this.build();
  };

  /*
   * move back one month
   *
   * @api public
   */

  Calendr.prototype.goBackMonth = function() {
    this.moment.subtract('month', 1);
    this.build();
  };

  /*
   * return today
   *
   * @return {Day|Number}
   * @api public
   */

  Calendr.prototype.getToday = function() {
    var t = new Date();

    // return if it's not the same month as now
    if (this.month !== t.getMonth()+1 || this.year !== t.getFullYear()) {
      return;
    }

    return this.getDay(t.getDate());
  };

  /*
   * return the day
   *
   * @param {Number} date
   * @return {Day}
   * @api public
   */

  Calendr.prototype.getDay = function(date) {
    var dayi = (date-1)+this.startson; // offset with the actual start on index
    var weeki = weekIndex.call(this, date);

    // get the dayi offset if not in the first week
    if (weeki > 0) {
      dayi = dayi-(weeki*7); 
    }

    return this.grid()[weeki][dayi];
  };

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

    if (events.length === 0) {
      return;
    }

    if ('undefined' === typeof this._grid) {
      this.grid();
    }

    // sort events by date, name ASC
    events.sort(function(a, b) {
      var rsec = 100000;
      var aint = parseInt(a.startson.getTime()/rsec, 10);
      var bint = parseInt(b.startson.getTime()/rsec, 10);

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
    });

    // TODO ensure events are in the proper month?

    var self = this;
    var i = 0;
    var len = events.length;
    for(; i<len; i++) {
      var event = events[i];
      var startson = event.startson.getDate();
      var day = self.getDay(startson);

      // event recurrs from the previous month
      if (event.startson.getMonth() < self.moment.month()) {
        startson = 1;
      }

      if (day) {
        switch(event.repeats) {
          case 'daily':
            var endson = self.numofdays;

            if (!!event.repeatTimes) {
              endson = event.repeatTimes;

              // repeat times outside of number days left in the month
              if (event.repeatTimes >= self.numofdays-startson) {

                // subtract # of days in previous months
                var diff = endson;
                var m = event.startson.getMonth();
                var thismonth = self.moment.month();
                for(; m<thismonth; m++) {
                  var numofdays = new Date(self.moment.year(), m+1, 0).getDate();
                  diff = diff-numofdays;
                }

                // we still have more repeating days than month days
                if (diff > self.numofdays) {
                  endson = self.numofdays;
                } else {
                  endson = diff+event.startson.getDate(); // add startson date as offset
                }
              }
            } else if (!!event.repeatEndson) {
              if (event.repeatEndson.getMonth() > self.moment.month()) {
                endson = self.numofdays;
              } else {
                endson = event.repeatEndson.getDate();
              }
            }

            endson++; // add +1 for for loop

            for(; startson<endson; startson++) {
              var _daily = self.getDay(startson);
              _daily.events.push(event);
            }
            break;

          case 'weekly':
            // /* jshint -W004 */
            // calculate the weeks we need to repeat
            var weeki = weekIndex.call(self, startson);
            var weekslen = self.grid().length;
            if (!!event.repeatTimes) {
              weekslen = weeki+event.repeatTimes; // offset with start week index
              if (weekslen >= self.grid().length) {
                var thismonth = self.moment.month();
                while(thismonth>0) {
                  var cal = new Calendr(new Date(self.moment.year(), self.moment.month()-thismonth));
                  weekslen = weekslen-(cal.grid().length-1);
                  thismonth--;
                }

                if (weekslen >= self.grid().length) {
                  weekslen = self.grid().length-1;
                }
              }
              weekslen++; // +1 for for loop
            } else if (!!event.repeatEndson) {
              /* jshint -W018 */
              if (!(event.repeatEndson.getMonth() > self.moment.month())) {
                weekslen = weekIndex.call(self, event.repeatEndson.getDate())+1;
              }
            }

            var dates = [];

            // calculate dates days in each week
            var repeatsOnIndexes = event.repeatsOn.map(dayNameIndex);
            var rlen = repeatsOnIndexes.length;
            for(; weeki<weekslen; weeki++) {
              for(var r=0; r<rlen; r++) {
                var date = repeatsOnIndexes[r]-self.startson;
                if (weeki > 0) date = date+(weeki*7);
                if (date < 0) continue;

                date++;

                if (event.startson.getMonth() === self.moment.month()) {
                  if (date < event.startson.getDate()) continue;
                }

                dates.push(date);
              }
            }

            for(var d=0, dlen=dates.length; d<dlen; d++) {
              var day = self.getDay(dates[d]);
              if (day) {
                day.events.push(event);
              }
            }
            break;

          default:
            day.events.push(event);
            break;
        }
      }
    }
  };

  /*
   * return index of day in week, by date name
   *
   * @param {String} dayName
   * @return {Number{
   * @api private
   */

  function dayNameIndex(dayName) {
    return days.indexOf(dayName);
  }

  /*
   * return the week index of give date
   *
   * @param {Number} date
   * @return {Number}
   * @api private
   */

  function weekIndex(date) {
    var dayi = (date-1)+this.startson; // offset with the actual start on index
    return Math.floor(dayi/7);
  }

  /*
   * create an array of calendar days
   *
   * @return {Array}
   * @api private
   */

  function calendardays() {
    var self = this;
    var month = this.moment;
    var days = Array.apply(null, Array(this.numofdays));
    return days.map(function(d, i) {
      return day.call(self, (i+1), month);
    });
  }

  /*
   * pad days so 1st day starts on same index of day of the week
   *
   * @param {Array} days
   * @api private
   */

  function prepad(days) {
    var self = this;
    var month = moment(new Date(this.moment)).subtract('month', 1);
    var numofdayslastmonth = month.daysInMonth();
    var i = 0;
    var index = this.startson;
    for(; i<index; i++) {
      days.splice(0, 0, day.call(self, (numofdayslastmonth-i), month));
    }
  }

  /*
   * pad the last week to be a full 7 length array
   *
   * @param {Array} week
   * @api private
   */

  function fill(week) {
    var self = this;
    var month = moment(new Date(this.moment)).add('month', 1);
    var i = 0;
    var len = 7-week.length;
    for(; i<len; i++) {
      week.push(day.call(self, (i+1), month));
    }
  }


  /*
   * expose Day
   */

  exports.Day = Day;

  /*
   * Day object
   *
   * @constructor
   */

  function Day(year, month, date) {
    this._toDate = new Date(year, month-1, date);
    this.events = [];
  }

  /*
   * toDate
   *
   * @return {Date}
   */

  Day.prototype.toDate = function() {
    return this._toDate;
  };

  /*
   * date
   *
   * @return {Number}
   * @api public
   */

  Day.prototype.date = function() {
    return this._toDate.getDate();
  };

  /*
   * month
   *
   * @return {Number}
   * @api public
   */

  Day.prototype.month = function() {
    return this._toDate.getMonth()+1; // 1 indexed
  };

  /*
   * year
   *
   * @return {Number}
   * @api public
   */

  Day.prototype.year = function() {
    return this._toDate.getFullYear();
  };

  /*
   * day of the week (Monday, Tuesday, etc...)
   *
   * @return {String}
   * @api public
   */

  Day.prototype.dayOfWeek = function() {
    return days[moment(this._toDate).day()];
  };

  /*
   * month name
   *
   * @return {String}
   * @api public
   */

  Day.prototype.nameOfMonth = function() {
    return months[this.month()-1];
  };

  /*
   * is it today?
   *
   * @return {Boolean}
   * @api public
   */

  Day.prototype.isToday = function() {
    var now = new Date();
    return this._toDate.getTime() ===
      new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  };

  /*
   * return day object or numer
   *
   * @param {Number} date
   * @param {Moment} moment
   * @return {Day|Number}
   * @api private
   */

  function day(date, moment) {
    if (this.dayObjects) {
      return new Day(moment.year(), moment.month()+1, date);
    } else {
      return date;
    }
  }
})();

