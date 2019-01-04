///<reference path="./calendarData.ts" />
///<reference path="./formBuilder.ts" />
///<reference path="../Types/jQuery/jquery.d.ts"/>
class Calendar {
  //element to build calendadr table inside of
  private parent : HTMLElement;
  //location of data file - relative |  absolute path 
  private driverLocation:  string;
  //date component values
  private currentYear : number;
  private baseYear : number;
  private currentMonth : number;
  private baseMonth : number;
  private currentDate :Date;
  private baseDate : Date;
  //retrieve data from file
  private data : any;

  private form : FormBuilder;

  constructor(parentElement : HTMLElement, form? : FormControl,   dateOverride ? : Date){
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
    //initialize submission form
    let autoLoadStyles = true;
    this.form = new FormBuilder(autoLoadStyles, form);
  }
  
  /**
   * override default data file location
   */
  setDriverLocation = (driverLocation :string): void => {
    this.driverLocation = driverLocation;
  }

  getData = () => {
    let pointer= this;
    if(! this.driverLocation){
      throw new Error('data source location must be set via calendar.setDriverLocation(url).');
    }

    $.ajax({
      url: this.driverLocation,
      dataType: "text"
    })
    .done(response => {
      let d = atob(response), e;

      try{e = JSON.parse(d)}
      catch(error){console.log(error)}
      pointer.data = e;
      pointer.render();
    })
    .fail(xhr => {
      console.log('data lookup failure: ', xhr);
    })
  }

  /**
   * step forward | back a month
   */
  getSibling = (movement : string): any => {

    let response = {
      month : this.currentMonth, 
      year : this.currentYear
    }

    switch(movement){
      case "next" : {
        if(this.currentMonth < 11){
          response.month ++;
        } else {
          response.month = 0; 
          response.year++;
        }
        break;
       }
      case "prev": {
        if(this.currentMonth > 0)
        response.month --;
        else {
          response.month = 11;
          response.year--;
        }
      }
    }
    return response;
  }

  /**
   * build calendar table
   */
  render = (): void => {
    this.parent.innerHTML = "";

    let tbl_html = document.createDocumentFragment();
    let html = document.createDocumentFragment();
    let feb_num_days = "";
    let counter = 1;
    let dateNow = null;

    let daysInThisMonth = this.daysInMonth(this.currentYear, this.currentMonth);
    let prev = this.getSibling('prev');
    let next = this.getSibling('next');

    let daysInPreviousMonth = this.daysInMonth(prev.year, prev.month);
    let daysInNextMonth = this.daysInMonth(next.year, next.month);

    let weekdays = this.currentDate.getDay();
    let weekdays2 = weekdays;


    //begin DOM construction
    let tr = document.createElement("tr");
    tbl_html.appendChild(tr);
    //add trailing days of last month
    while(weekdays > 0){
      let trailingDayNumber = (daysInPreviousMonth - (weekdays -1));
      let td = document.createElement('td');
      td.innerText = trailingDayNumber.toString();
      td.classList.add("monthPre");
      td.classList.add("dayPast");
      td.classList.add("day");
      tr.appendChild(td);
      weekdays--;
    }
    //build calendar body
    while (counter <= daysInThisMonth){
      //start new line.
      if (weekdays2 > 6) {
        weekdays2 = 0;
        tr = document.createElement("tr");
        tbl_html.appendChild(tr);
      }
      //create element for each day
      let td = <HTMLElement>document.createElement('td');
      td.classList.add("day");
      td.classList.add("day-current-month");
      //in the past?
      let yearInPast = this.currentYear < this.baseYear;
      let yearInPresent = this.currentYear == this.baseYear;
      let yearInFuture = this.currentYear > this.baseYear;
      let monthInPast = (yearInPast || yearInPresent) && this.currentMonth < this.baseMonth;
      let monthInPresent = yearInPresent && this.currentMonth == this.baseMonth;
      let monthInFuture = (yearInFuture || yearInPresent && this.currentMonth >  this.baseMonth);

      if(yearInPast || monthInPast || (monthInPresent && this.currentDate.getDate() < this.baseDate.getDate()))  
        td.classList.add("dayPast");
      if(monthInPresent && (this.currentDate.getDate() == this.baseDate.getDate()) )
        td.classList.add("dayNow");
      if(monthInFuture || monthInPresent && this.currentDate.getDate() > this.baseDate.getDate())
      td.classList.add("dayFuture");
      //persist date value
      (<any>td.dataset).date = this.dateToString(this.currentYear, this.currentMonth, counter);
      // add conflicts | entries from data file
      console.log(this.dateToString(this.currentYear, this.currentMonth, counter));

      //check against datastore for conflict
      if(!!this.data)
        this.compare(td, this.dateToString(this.currentYear, this.currentMonth, counter));

      var pointer = this;
        td.onclick = function(){
          console.log('moo');
          debugger;
          pointer.form.showForm();
        }

      var txt = document.createElement("span");
        txt.innerText = counter.toString();
        td.appendChild(txt);
        tr.appendChild(td);
        weekdays2++;
        counter++;
    }
    //need to pad last row? 
    let nextMonthCounter = 1;
    while(weekdays2 < 7){
      var txt = document.createElement("span");
      txt.innerText = nextMonthCounter.toString();
      var td = document.createElement("td");
      td.classList.add("day");
      td.classList.add('day-nextmonth');
      td.classList.add("dayFuture");

      let nextMonthDate = this.dateToString(next.year, next.month, nextMonthCounter);
      console.log('nextMonthDate: ', nextMonthDate);
      (<any>td.dataset).date = nextMonthDate;
      td.appendChild(txt);
      tr.appendChild(td);
      nextMonthCounter ++;
      weekdays2++;
    }

   



    this.buildTable(tbl_html);
  }

  /**
   * check current td's date against known events
   */
  compare = (td: HTMLElement, dateString: string) => {

    for(let i = 0; i  <this.data.length; i++){
      let date = this.data[i];
      //update element classlist on date match
      if(date.string == dateString){
        //let iconClasses = date.glyphicon;
        let status = date.status;
        td.classList.add(status);
      }
    }
  }

  buildHeader = (table : HTMLTableElement) => {
    let header = document.createElement('thead');
    let hr = document.createElement('tr');
    hr.classList.add('cal-label-row');
    let th = <HTMLTableHeaderCellElement>document.createElement('th');
    th.classList.add("cal-header");
    th.id = "cal-tbl-header";
    th.colSpan = 7;

    let text = document.createElement('div');
    text.innerText = monthNames[this.currentMonth] + " " + this.currentYear;

    hr.appendChild(th);
    th.appendChild(text);
    header.appendChild(hr);

    // add day names
    let dayRow = document.createElement('tr');
    dayRow.classList.add('dayNames');

    for (var i in dayNames) {
      let th = document.createElement("td");
      th.classList.add("header");
      th.innerText = dayNames[i];
      dayRow.appendChild(th);
    }
    header.appendChild(dayRow);

    table.appendChild(header);

  }

  buildTable = (bodyContent : DocumentFragment) => {

    let table = document.createElement('table');
    table.classList.add('calendar');
    table.id = "calendar-table";

    this.buildHeader(table);
   
    table.appendChild(bodyContent);
    this.parent.appendChild(table);
    //add day of week bar
    this.addNav();
  }

  dateToString = (y:number, m: number, d: number): string => {
    var yy = y.toString(),
        mm = (m + 1).toString(),
        dd = d.toString();
      while (mm.length < 2) mm = "0" + mm;
      while (dd.length < 2) dd = "0" + dd;
      return yy + "-" + mm + "-" + dd;
  }

  daysInMonth = (year: number, month : number): number=> {
    if (month === 1) return this.febLength(year);
      else return parseInt(daysPerMonth[month]);
  }

  febLength = (year : number): number => {
    if ((year % 100 != 0 && year % 4 == 0) || year % 400 == 0) return 29;
    else return 28;
  }

  addNav = () => {
    let pointer = this;
    let navLeft = document.createElement('div');
    let navRight = document.createElement('div');

    navLeft.classList.add("nav-arrow", "nav-left");
    navRight.classList.add("nav-arrow", "nav-right");

    navLeft.onclick = function(){
      pointer.update(false);
    };

    navRight.onclick = function(){
      pointer.update(true);
    };
    let arrowLeft = document.createElement('i');
    arrowLeft.classList.add('fa');
    arrowLeft.classList.add('fa-arrow-left');
    let arrowRight = document.createElement('i');
    arrowRight.classList.add('fa');
    arrowRight.classList.add('fa-arrow-right');

    navLeft.appendChild(arrowLeft);
    navRight.appendChild(arrowRight);

    let header = document.getElementById('cal-tbl-header');
    header.insertBefore(navLeft, header.firstChild);
    header.appendChild(navRight);
  }

  update = (isRightClick : boolean) => {

    let key = isRightClick ? "next" : "prev";
    let adj = this.getSibling(key);
    this.currentMonth = adj.month;
    this.currentYear = adj.year;

    this.currentDate = new Date(this.currentYear, this.currentMonth);
    this.render();
  }
}