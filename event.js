;(function(window) {
  var moment, Event;

  function check(k) {
    if (!(k in window)) {
      throw new Error(k+" is required");
    }
  }

  /**
   * expose Event
   */

  if (window) {
    check("moment");
    
    moment = window.moment;
    window.Event = Event;
  } else {
    moment = require("moment");
    module.exports = Event;
  }

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
  * Event
  *
  * @param {Object} obj (should be plain old object, like a JSON parse)
  * @param {Object} config
  * @constructor
  */

  function Event(obj, config) {
    assign.call(this, (obj || {}), config);

    this.starts = parseDate(this.starts);
    this.ends = parseDate(this.ends);
    this.repeatEndsOn = parseDate(this.repeatEndsOn);
    if (!!!this.starts) {
      throw new Error("must have a starts date") ;
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
   * Duration
   *
   * @param {Date} starts
   * @param {Date} ends
   * @constructor
   */

  function Duration(starts, ends) {
    this.starts = starts;
    this.ends = ends;
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
    if (!!!this.ends) {
      return 1;
    }

    var a = this.starts;
    var b = this.ends;
    a.hours(0);
    b.hours(0);

    var offset = 1; // always offset by 1 to account for the day of
    return Math.ceil((b.valueOf() - a.valueOf()) / ms_in_day) + offset; 
  };
})(("undefined" === typeof module && "undefined" === typeof exports) ? window : null);