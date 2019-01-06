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
    "Sun",
    "Mon",
    "Tues",
    "Weds",
    "Thur",
    "Fri",
    "Sat"
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
///<reference path= "./formTemplates.ts" />
///<reference path= "../Types/jQuery/blockui.d.ts" />
var FormBuilder = (function () {
    function FormBuilder(autoLoadCss, form, formStyling) {
        var _this = this;
        if (autoLoadCss === void 0) { autoLoadCss = true; }
        this.buildForm = function () {
            var form = document.createElement('div');
            form.style.display = "none";
            form.id = "input-form";
            var formChild = document.createElement('div');
            formChild.classList.add('display-form');
            form.appendChild(formChild);
            /**add  empty header element - to be populated with date on show */
            var header = document.createElement('div');
            header.classList.add('form-header');
            header.id = "form-header";
            formChild.appendChild(header);
            var formRows = _this.defaultForm['rows'];
            for (var i = 0; i < formRows.length; i++) {
                var rowData = formRows[i];
                var rowElement = document.createElement('div');
                rowElement.classList.add('form-row');
                for (var j in rowData) {
                    //form elements
                    var elementData = rowData[j];
                    var container = document.createElement('div');
                    container.classList.add('form-element-container');
                    var label = null;
                    if (elementData.label)
                        label = _this.createLabel(elementData.id, elementData.label);
                    var element = _this.createElement(elementData);
                    if (label)
                        container.appendChild(label);
                    container.appendChild(element);
                    //store simple validations
                    if (elementData.validation) {
                        var vp = {
                            function: elementData.validation,
                            failMessage: elementData.validationErrorMessage,
                            elementId: elementData.id
                        };
                        _this.validationFunctions.push(vp);
                    }
                    rowElement.appendChild(container);
                }
                formChild.appendChild(rowElement);
            }
            document.body.appendChild(form);
            _this.addControlButtons(formChild);
        };
        this.bindFormButtonActions = function () {
            var pointer = _this;
            $(document).on('click', '#form-cancel-button', function () {
                $.unblockUI();
            });
            $(document).on('click', "#form-submit-button", function () {
                var validInput = pointer.validate();
                if (validInput)
                    pointer.submitForm();
            });
        };
        this.addControlButtons = function (formElement) {
            var row = document.createElement("div");
            row.classList.add('form-element-container');
            row.classList.add('button-container');
            var cancelButton = document.createElement('button');
            cancelButton.innerText = "Cancel";
            cancelButton.classList.add('form-button');
            cancelButton.classList.add('cancel-button');
            cancelButton.id = "form-cancel-button";
            var submitButton = document.createElement('button');
            submitButton.innerText = "Submit";
            submitButton.classList.add('form-button');
            submitButton.classList.add('submit-button');
            submitButton.id = "form-submit-button";
            row.appendChild(cancelButton);
            row.appendChild(submitButton);
            formElement.appendChild(row);
        };
        this.createLabel = function (id, text) {
            var label = document.createElement("label");
            label.classList.add('form-element-label');
            label.htmlFor = id;
            label.innerText = text;
            return label;
        };
        this.createElement = function (elementData) {
            var element;
            switch (elementData.type) {
                case "select": {
                    element = document.createElement('select');
                    if (elementData.defaultOption) {
                        var dOpt = document.createElement('option');
                        dOpt.value = elementData.defaultOption.value;
                        dOpt.text = elementData.defaultOption.text;
                        element.appendChild(dOpt);
                        for (var i = 0; i < elementData.opts.length; i++) {
                            var opt = document.createElement('option');
                            opt.value = elementData.opts[i].value;
                            opt.text = elementData.opts[i].text;
                            element.appendChild(opt);
                        }
                    }
                    break;
                }
                case "checkbox": {
                    element = document.createElement('input');
                    element.type = "checkbox";
                    element.checked = !!elementData.checked;
                    break;
                }
                case "text": {
                    element = document.createElement('input');
                    element.type = "text";
                    elementData.placeholder ? element.placeholder = elementData.placeholder : {};
                    break;
                }
                case "textarea": {
                    element = document.createElement('textarea');
                    element.cols = elementData.cols ? elementData.cols : 25;
                    element.rows = elementData.rows ? elementData.rows : 3;
                    element.placeholder = elementData.placeholder ? elementData.placeholder : "";
                }
            }
            var defaultUniqueVal = "input-" + (Math.random() * 100).toFixed(0).toString();
            element.id = elementData.id ? elementData.id : defaultUniqueVal;
            element.name = elementData.name ? elementData.name : defaultUniqueVal;
            element.classList.add('form-element-input');
            // element.style.flex = 1;
            return element;
        };
        this.validate = function () {
            var validationPool = _this.validationFunctions;
            var result = false;
            for (var i = 0; i < _this.validationFunctions.length; i++) {
                var validation = _this.validationFunctions[i];
                var inputValue = document.getElementById(validation.elementId).value;
                if (!validation.function(inputValue)) {
                    var message = validation.failMessage;
                    var header = document.getElementById("form-header");
                    var dateString = header.innerText;
                    header.innerText = message;
                    setTimeout(function () {
                        header.innerText = dateString;
                    }, 2000);
                    return false;
                }
            }
            return true;
        };
        this.submitForm = function () {
            var pointer = _this;
            var rows = _this.defaultForm['rows'];
            var payload = {};
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                for (var j = 0; j < row.length; j++) {
                    var node = row[j];
                    var propName = node.name;
                    var element = document.getElementById(node.id);
                    payload[propName] = element.value;
                }
            }
            /**
             * TODO ajax request do write to .dat
             */
            debugger;
        };
        //modal styles
        this.formStyling = formStyling ? formStyling : {
            width: "40vw",
            left: "30%"
        };
        if (autoLoadCss) {
            var styleLink = document.createElement('link');
            styleLink.id = "auto-load-form-styles";
            styleLink.rel = "stylesheet";
            styleLink.href = "./css/form-styles.css";
            document.body.appendChild(styleLink);
        }
        /**
         * auto-load blockui deps
         */
        var blockUIscript = document.createElement('script');
        blockUIscript.src = "./vendor/js/malsup/blockui.js";
        var pointer = this;
        /**
         * bind click events for form 'submit' and 'cancel' buttons
         * once deendency has loaded
         */
        blockUIscript.onload = function () {
            //define function that calls blockUI only when it is available & loaded
            pointer.showForm = function (date) {
                var header = document.getElementById('form-header');
                var _date = new Date(date).toDateString();
                header.innerText = _date;
                $.blockUI({
                    message: document.getElementById('input-form'),
                    css: this.formStyling
                });
            };
            //onclick handlers added only after blockUI is available
            pointer.bindFormButtonActions();
        };
        document.body.insertBefore(blockUIscript, document.body.firstChild);
        /**define default client input form */
        this.defaultForm = form ? form : {
            rows: [
                [{
                        id: "name-input",
                        name: "name",
                        label: "Name",
                        type: "text",
                        placeholder: "enter your name",
                        validationErrorMessage: "Please enter your name.",
                        validation: function (value) {
                            return value.length && value.length > 1;
                        }
                    }
                ],
                [{
                        id: 'mode-select',
                        name: 'mode-select',
                        type: "select",
                        label: "Event Type",
                        defaultOption: {
                            text: "Select Event Type",
                            value: "default"
                        },
                        opts: [{
                                text: "Portrait Session",
                                value: "portrait-session"
                            }, {
                                text: "Wedding",
                                value: "wedding"
                            }, {
                                text: "Birthday Party",
                                value: "birthday"
                            }
                        ],
                        validationErrorMessage: "Please select an event type.",
                        validation: function (value) {
                            return value != "default";
                        }
                    }
                ],
                [{
                        id: "email-input",
                        name: "email",
                        label: "Email",
                        type: "text",
                        validationErrorMessage: "Please enter your email.",
                        placeholder: "enter your email",
                        validation: function (value) {
                            // let validation = /^[a - zA - Z0-9._ - ] + @[a - zA - Z0-9. - ] + \.[a - zA - Z] {2, 4}$/; 
                            // return validation.test(value); 
                            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                            return re.test(String(value).toLowerCase());
                        }
                    }
                ],
                [
                    {
                        id: "notes",
                        name: "notes",
                        label: "Details",
                        placeholder: "Tell us a little about your request!",
                        type: "textarea",
                        cols: 35,
                        rows: 3
                    }
                ]
            ]
        };
        this.validationFunctions = [];
        this.buildForm();
    }
    return FormBuilder;
})();
///<reference path="./calendarData.ts" />
///<reference path="./formBuilder.ts" />
///<reference path="../Types/jQuery/jquery.d.ts"/>
/**
 * TODO
 * ~implement default auto-load css
 */
var Calendar = (function () {
    function Calendar(parentElement, form, formPosition, dateOverride) {
        var _this = this;
        /**
         * override default data file location
         */
        this.setDriverLocation = function (driverLocation) {
            _this.driverLocation = driverLocation;
        };
        this.getData = function () {
            var pointer = _this;
            if (!_this.driverLocation) {
                throw new Error('data source location must be set via calendar.setDriverLocation(url).');
            }
            $.ajax({
                url: _this.driverLocation,
                dataType: "text"
            })
                .done(function (response) {
                var d = atob(response), e;
                try {
                    e = JSON.parse(d);
                }
                catch (error) {
                    console.log(error);
                }
                pointer.data = e;
                pointer.render();
            })
                .fail(function (xhr) {
                console.log('data lookup failure: ', xhr);
            });
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
                //add click handler for form display
                _this.addOnclick(td_2);
                //check against datastore for date matches
                if (!!_this.data)
                    _this.compare(td_2, _this.dateToString(_this.currentYear, _this.currentMonth, counter));
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
                //console.log('nextMonthDate: ', nextMonthDate);
                td.dataset.date = nextMonthDate;
                td.appendChild(txt);
                tr.appendChild(td);
                //add click handler for form display
                _this.addOnclick(td);
                nextMonthCounter++;
                weekdays2++;
            }
            _this.buildTable(tbl_html);
        };
        //event listener calendar day button
        this.addOnclick = function (td) {
            //dont 
            if (td.classList.contains('dayPast'))
                return;
            var pointer = _this;
            td.onclick = function () {
                pointer.form.showForm(td.dataset.date);
            };
        };
        /**
         * check current td's date against known events
         */
        this.compare = function (td, dateString) {
            for (var i = 0; i < _this.data.length; i++) {
                var date = _this.data[i];
                //update element classlist on date match
                if (date.string == dateString) {
                    //let iconClasses = date.glyphicon;
                    var status_1 = date.status;
                    td.classList.add(status_1);
                }
            }
        };
        this.buildHeader = function (table) {
            var header = document.createElement('thead');
            var hr = document.createElement('tr');
            hr.classList.add('cal-label-row');
            var th = document.createElement('th');
            th.classList.add("cal-header");
            th.id = "cal-tbl-header";
            th.colSpan = 7;
            var text = document.createElement('div');
            text.innerText = monthNames[_this.currentMonth] + " " + _this.currentYear;
            hr.appendChild(th);
            th.appendChild(text);
            header.appendChild(hr);
            // add day names
            var dayRow = document.createElement('tr');
            dayRow.classList.add('dayNames');
            for (var i in dayNames) {
                var th_1 = document.createElement("td");
                th_1.classList.add("header");
                th_1.innerText = dayNames[i];
                dayRow.appendChild(th_1);
            }
            header.appendChild(dayRow);
            table.appendChild(header);
        };
        this.buildTable = function (bodyContent) {
            var table = document.createElement('table');
            table.classList.add('calendar');
            table.id = "calendar-table";
            _this.buildHeader(table);
            table.appendChild(bodyContent);
            _this.parent.appendChild(table);
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
            var key = isRightClick ? "next" : "prev";
            var adj = _this.getSibling(key);
            _this.currentMonth = adj.month;
            _this.currentYear = adj.year;
            _this.currentDate = new Date(_this.currentYear, _this.currentMonth);
            _this.render();
        };
        this.parent = parentElement;
        this.formPosition = formPosition ? formPosition : null;
        //set default date
        this.baseDate = dateOverride ? dateOverride : new Date();
        this.currentDate = this.baseDate;
        //month
        this.baseMonth = this.baseDate.getMonth();
        this.currentMonth = this.baseMonth;
        //year
        this.baseYear = this.baseDate.getFullYear();
        this.currentYear = this.baseYear;
        //initialize submission form
        var autoLoadStyles = true;
        this.form = new FormBuilder(autoLoadStyles, form);
    }
    return Calendar;
})();
