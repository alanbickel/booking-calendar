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
        this.getSibling = function (movement) {
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
            _this.parent.innerHTML = "";
            var tbl_html = document.createDocumentFragment();
            var html = document.createDocumentFragment();
            var feb_num_days = "";
            var counter = 1;
            var dateNow = null;
            var daysInThisMonth = _this.daysInMonth(_this.currentYear, _this.currentMonth);
            var prev = _this.getSibling('prev');
            var next = _this.getSibling('next');
            var daysInPreviousMonth = _this.daysInMonth(prev.year, prev.month);
            var daysInNextMonth = _this.daysInMonth(next.year, next.month);
            var weekdays = _this.currentDate.getDay();
            var weekdays2 = weekdays;
            //begin DOM construction
            var tr = document.createElement("tr");
            tbl_html.appendChild(tr);
            //add trailing days of last month
            while (weekdays > 0) {
                var trailingDayNumber = (daysInPreviousMonth - (weekdays - 1));
                var td_1 = document.createElement('td');
                td_1.innerText = trailingDayNumber.toString();
                td_1.classList.add("monthPre");
                td_1.classList.add("dayPast");
                td_1.classList.add("day");
                tr.appendChild(td_1);
                weekdays--;
            }
            //build calendar body
            while (counter <= daysInThisMonth) {
                //start new line.
                if (weekdays2 > 6) {
                    weekdays2 = 0;
                    tr = document.createElement("tr");
                    tbl_html.appendChild(tr);
                }
                //create element for each day
                var td_2 = document.createElement('td');
                td_2.classList.add("day");
                td_2.classList.add("day-current-month");
                //in the past?
                var yearInPast = _this.currentYear < _this.baseYear;
                var yearInPresent = _this.currentYear == _this.baseYear;
                var yearInFuture = _this.currentYear > _this.baseYear;
                var monthInPast = (yearInPast || yearInPresent) && _this.currentMonth < _this.baseMonth;
                var monthInPresent = yearInPresent && _this.currentMonth == _this.baseMonth;
                var monthInFuture = (yearInFuture || yearInPresent && _this.currentMonth > _this.baseMonth);
                if (yearInPast || monthInPast || (monthInPresent && _this.currentDate.getDate() < _this.baseDate.getDate()))
                    td_2.classList.add("dayPast");
                if (monthInPresent && (_this.currentDate.getDate() == _this.baseDate.getDate()))
                    td_2.classList.add("dayNow");
                if (monthInFuture || monthInPresent && _this.currentDate.getDate() > _this.baseDate.getDate())
                    td_2.classList.add("dayFuture");
                //persist date value
                td_2.dataset.date = _this.dateToString(_this.currentYear, _this.currentMonth, counter);
                // add conflicts | entries from data file
                console.log(_this.dateToString(_this.currentYear, _this.currentMonth, counter));
                var txt = document.createElement("span");
                txt.innerText = counter.toString();
                td_2.appendChild(txt);
                tr.appendChild(td_2);
                weekdays2++;
                counter++;
            }
            //need to pad last row? 
            var nextMonthCounter = 1;
            while (weekdays2 < 7) {
                var txt = document.createElement("span");
                txt.innerText = nextMonthCounter.toString();
                var td = document.createElement("td");
                td.classList.add("day");
                td.classList.add('day-nextmonth');
                td.classList.add("dayFuture");
                var nextMonthDate = _this.dateToString(next.year, next.month, nextMonthCounter);
                console.log('nextMonthDate: ', nextMonthDate);
                td.dataset.date = nextMonthDate;
                td.appendChild(txt);
                tr.appendChild(td);
                nextMonthCounter++;
                weekdays2++;
            }
            _this.buildTable(tbl_html);
        };
        this.buildTable = function (docFrag) {
            //construct Table
            var cal_tbl = document.createElement("table");
            cal_tbl.id = "calendar-table";
            cal_tbl.classList.add("calendar");
            //header
            var tbl_hdr = document.createElement("th");
            tbl_hdr.classList.add("cal-header");
            tbl_hdr.id = "cal-tbl-header";
            tbl_hdr.colSpan = 7;
            var hdr_txt = document.createElement("div");
            hdr_txt.innerText = monthNames[_this.currentMonth] + " " + _this.currentYear;
            tbl_hdr.appendChild(hdr_txt);
            var day_row = document.createElement("tr");
            day_row.classList.add("dayNames");
            for (var i in dayNames) {
                var temp = document.createElement("td");
                temp.classList.add("header-row");
                temp.innerText = dayNames[i];
                day_row.appendChild(temp);
            }
            //append calendar sections
            cal_tbl.appendChild(tbl_hdr);
            cal_tbl.appendChild(day_row);
            cal_tbl.appendChild(docFrag);
            _this.parent.appendChild(cal_tbl);
            //add day of week bar
            _this.addNav();
        };
        this.dateToString = function (y, m, d) {
            var yy = y.toString(), mm = (m + 1).toString(), dd = d.toString();
            while (mm.length < 2)
                mm = "0" + mm;
            while (dd.length < 2)
                dd = "0" + dd;
            return yy + "-" + mm + "-" + dd;
        };
        this.daysInMonth = function (year, month) {
            if (month === 1)
                return _this.febLength(year);
            else
                return parseInt(daysPerMonth[month]);
        };
        this.febLength = function (year) {
            if ((year % 100 != 0 && year % 4 == 0) || year % 400 == 0)
                return 29;
            else
                return 28;
        };
        this.addNav = function () {
            var pointer = _this;
            var navLeft = document.createElement('div');
            var navRight = document.createElement('div');
            navLeft.classList.add("nav-arrow", "nav-left");
            navRight.classList.add("nav-arrow", "nav-right");
            navLeft.onclick = function () {
                pointer.update(false);
            };
            navRight.onclick = function () {
                pointer.update(true);
            };
            var arrowLeft = document.createElement('i');
            arrowLeft.classList.add('fa');
            arrowLeft.classList.add('fa-arrow-left');
            var arrowRight = document.createElement('i');
            arrowRight.classList.add('fa');
            arrowRight.classList.add('fa-arrow-right');
            navLeft.appendChild(arrowLeft);
            navRight.appendChild(arrowRight);
            var header = document.getElementById('cal-tbl-header');
            header.insertBefore(navLeft, header.firstChild);
            header.appendChild(navRight);
        };
        this.update = function (isRightClick) {
        };
        this.parent = parentElement;
        //set default date
        this.baseDate = dateOverride ? dateOverride : new Date();
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
