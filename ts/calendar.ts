///<reference path="./calendarData.ts" />

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
  


  constructor(parentElement : HTMLElement, dateOverride ? : Date){
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
  
  /**
   * override default data file location
   */
  setDriverLocation = (driverLocation :string): void => {
    this.driverLocation = driverLocation;
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
      (<any>td.dataset).date = this.dateToString(this.currentYear, this.currentMonth, this.currentDate.getDate());
      // add conflicts | entries from data file


    }
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
}