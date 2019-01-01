var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
var dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thrusday",
    "Friday",
    "Saturday"
];
var calendarHeaders = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
];
var daysPerMonth = [
    "31",
    "0",
    "31",
    "30",
    "31",
    "30",
    "31",
    "31",
    "30",
    "31",
    "30",
    "31"];
///<reference path="./calendarData.ts" />
var Calendar = (function () {
    function Calendar(parentElement, dateOverride) {
        var _this = this;
        /**
         * override default data file location
         */
        this.setDriverLocation = function (driverLocation) {
            _this.driverLocation = driverLocation;
        };
        /**
         * step forward | back a month
         */
        this.getSiblingMonth = function (movement) {
            var response = {
                month: _this.currentMonth,
                year: _this.currentYear
            };
            switch (movement) {
                case "next": {
                    if (_this.currentMonth < 11) {
                        response.month++;
                    }
                    else {
                        response.month = 0;
                        response.year++;
                    }
                    break;
                }
                case "prev": {
                    if (_this.currentMonth > 0)
                        response.month--;
                    else {
                        response.month = 11;
                        response.year--;
                    }
                }
            }
            return response;
        };
        /**
         * build calendar table
         */
        this.render = function () {
        };
        this.parent = parentElement;
        //set default date
        this.baseDate = dateOverride ? dateOverride : new Date();
        debugger;
        this.currentDate = this.baseDate;
        //month
        this.baseMonth = this.baseDate.getMonth();
        this.currentMonth = this.baseMonth;
        //year
        this.baseYear = this.baseDate.getFullYear();
        this.currentYear = this.baseYear;
    }
    return Calendar;
})();
