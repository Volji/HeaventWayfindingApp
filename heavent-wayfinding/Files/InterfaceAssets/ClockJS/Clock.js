/**
* @license
* Copyright © 2015 Intuilab
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
* to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
* and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
* 
* The Software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, 
* fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, 
* whether in an action of contract, tort or otherwise, arising from, out of or in connection with the Software or the use or other dealings in the Software.
* 
* Except as contained in this notice, the name of Intuilab shall not be used in advertising or otherwise to promote the sale, 
* use or other dealings in this Software without prior written authorization from Intuilab.
*/

/**
* Inheritance on EventEmitter base class
* @type {EventEmitter}
*/
Clock.prototype = new EventEmitter();        // Here's where the inheritance occurs
Clock.prototype.constructor = Clock;
    
/**
* @constructor
*/
function Clock() {
    this.language = "en-US";
    this.timezone = "local";
	this.am_pm = false;
	this.resume();
};

/**
* Start the clock
*/
Clock.prototype.resume = function() {
    if (this.timer == null) {
        // Update now and then every second
        this._update();
        
        var self = this;
        this.timer = setInterval(function() { self._update(); }, 1000);
    }
};

/**
* Set the timezone
*/
Clock.prototype.setTimezone = function(timezone) {
    // Compatibility with previous release
	switch (timezone)
	{
		case "-12:00" : { this.timezone = "Pacific/Wallis"; break;}
		case "-11:00" : { this.timezone = "Pacific/Midway"; break;}
		case "-10:00" : { this.timezone = "Pacific/Honolulu"; break;}
		case "-09:00" : { this.timezone = "America/Anchorage"; break;}
		case "-08:00" : { this.timezone = "America/Los_Angeles"; break;}
		case "-07:00" : { this.timezone = "America/Denver"; break;}
		case "-06:00" : { this.timezone = "America/Chicago"; break;}
		case "-05:00" : { this.timezone = "America/New_York"; break;}
		case "-04:00" : { this.timezone = "America/Goose_Bay"; break;}
		case "-03:00" : { this.timezone = "America/Sao_Paulo"; break;}
		case "-02:00" : { this.timezone = "Atlantic/Cape_Verde"; break;}
		case "-01:00" : { this.timezone = "Atlantic/Azores"; break;}
		case "00:00" : { this.timezone = "Europe/London"; break;}
		case "+01:00" : { this.timezone = "Europe/Paris"; break;}
		case "+02:00" : { this.timezone = "Europe/Athens"; break;}
		case "+03:00" : { this.timezone = "Europe/Moscow"; break;}
		case "+04:00" : { this.timezone = "Asia/Tbilisi"; break;}
		case "+05:00" : { this.timezone = "Asia/Karachi"; break;}
		case "+06:00" : { this.timezone = "Asia/Dhaka"; break;}
		case "+07:00" : { this.timezone = "Asia/Bangkok"; break;}
		case "+08:00" : { this.timezone = "Asia/Hong_Kong"; break;}
		case "+09:00" : { this.timezone = "Asia/Tokyo"; break;}
		case "+10:00" : { this.timezone = "Australia/Sydney"; break;}
		case "+11:00" : { this.timezone = "Asia/Magadan"; break;}
		case "+12:00" : { this.timezone = "Pacific/Fiji"; break;}
		case "+13:00" : { this.timezone = "Pacific/Samoa"; break;}
		default : { this.timezone = timezone; }
	}
};

/**
* Pause the clock
*/
Clock.prototype.pause = function () 
{
    if (this.timer != null) {
        clearInterval(this.timer);
        this.timer = null;
    }
};

/**
* Update the clock
*/
Clock.prototype._update = function() {

	// Set language before formatting
    moment.lang(this.language);

	var date = new Date();
    var now = moment(date);

    // Set timezone if any
    if (this.timezone.length > 0 && this.timezone != "local") {
        now.zone(this._computeTimezoneOffset());
    }
	
    // Get new date
    this._formatDate(now);

    // Update fields
    if (this.seconds != now.seconds()) {
        this.seconds = now.seconds();
        this.emit('secondsChanged');
    }

    if (this.minutes != now.minutes()) {
        this.minutes = now.minutes();
        this.emit('minutesChanged');
    }

    if (this.hours != now.hours()) {
        this.hours = now.hours();
        this.emit('hoursChanged');
    }

    // Draw date in angle
    this._drawDateInAngle();
};

/**
 * Draw date in angle.
 * @private
 */
Clock.prototype._drawDateInAngle = function () {

    var newSecondsInAngle = (this.seconds * 6 + 270) % 360;
    if (this.secondsInAngle != newSecondsInAngle)
    {
        this.secondsInAngle = newSecondsInAngle;
        this.emit('secondsInAngleChanged');
    }

    var newMinutesInAngle = (this.minutes * 6 + 270) % 360;
    if (this.minutesInAngle != newMinutesInAngle)
    {
        this.minutesInAngle = newMinutesInAngle;
        this.emit('minutesInAngleChanged');
    }

    var newHoursInAngle = ((this.hours % 12) * 30 + (this.minutes / 2) + 270) % 360;
    if (this.hoursInAngle != newHoursInAngle)
    {
        this.hoursInAngle = newHoursInAngle;
        this.emit('hoursInAngleChanged');
    }
};

/*
 * Format the date
 */
Clock.prototype._formatDate = function (now) {

    this.iso8601 = now.format();
    this.emit('iso8601Changed');

    this.dateTime = now.format("LLLL");
    this.emit('dateTimeChanged');

    var shortDate = now.format("L");
    if (this.shortDate != shortDate) {
        this.shortDate = shortDate;
        this.emit('shortDateChanged');
    }
    
    var date = now.format("dddd L");
    if (this.date != date) {
        this.date = date;
        this.emit('dateChanged');
    }
    
	this.time = this.am_pm == true ? now.format("h:mm:ss A") : now.format("HH:mm:ss");
    this.emit('timeChanged', [this.hours, this.minutes, this.seconds]);

    var shortTime = this.am_pm == true ? now.format("h:mm A") : now.format("HH:mm");
    if (this.shortTime != shortTime){
        this.shortTime = shortTime;
        this.emit('shortTimeChanged');
    }


    // Notify change of day, month and year
    if (this.dayNum != now.date()) {
        this.dayNum = now.date();
        this.emit('dayNumChanged');
    }
	
	// Always notify that formatted string has changed to handle language dynamic change
	var dayString = now.format("dddd");
    if (this.dayString != dayString){
        this.dayString = dayString;
        this.emit('dayStringChanged');
    }


	var month = now.month() + 1;
    if (this.monthNum != month) {
        this.monthNum = month;
        this.emit('monthNumChanged');
    }

    var monthString = now.format("MMMM");
    if (this.monthString != monthString){
        this.monthString = monthString;
        this.emit('monthStringChanged');
    }

    
	var year = now.year();
    if (this.year != year) {
        this.year = year;
        this.emit('yearChanged');
    }
};

/*
 * Compute timezone offset
 */
Clock.prototype._computeTimezoneOffset = function () {
	// Compute timezone offset
	return moment(new Date()).tz(this.timezone).format('Z');
};