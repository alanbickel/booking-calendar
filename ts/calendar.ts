///<reference path="./calendarData.ts" />
///<reference path="./formBuilder.ts" />
///<reference path="../Types/jQuery/jquery.d.ts"/>

/**
 * TODO : 
 * clean up render()
 * clean up buildHeader()
 * clean up addNav()
 */

class Calendar {
  //DOM target
  private parent : HTMLElement;
  //location of data file
  private driverLocation:  string;
  private data : any;
  //weekend availability
  private availableOnWeekends: boolean;
  //date component values
  private currentYear : number;
  private baseYear : number;
  private currentMonth : number;
  private baseMonth : number;
  private currentDate :Date;
  private baseDate : Date;
  //manage modal input form
  private form : FormBuilder;
  //display key below table?
  private showLegend: boolean;

  constructor(parentElement : HTMLElement, dateOverride ? : Date){
    //DOM target
    this.parent = parentElement;
    //default to display color key
    this.showLegend = true;
    //set default date
    this.baseDate = dateOverride ? dateOverride : new Date();
    this.currentDate = this.baseDate;
    //month
    this.baseMonth = this.baseDate.getMonth();
    this.currentMonth = this.baseMonth;
    //year
    this.baseYear = this.baseDate.getFullYear();
    this.currentYear = this.baseYear;   
    //default weekend availability
    this.availableOnWeekends = false; 
  }
  //toggle show | hide color key for table
  displayLegend = (state : boolean) => {
    this.showLegend = state;
  }

  //set style location for form 
  loadFormStyles = (stylePath : string): void => {
    this.form.loadStyleSheet(stylePath);
  }
  //set style location for calendar
  loadSelfStyles = (stylePath :string) : void => {
    let styleLink = document.createElement('link');
    styleLink.rel = "stylesheet";
    styleLink.href = stylePath;
    document.body.appendChild(styleLink);
  }
  //set message to display on request return  from server
  /**
   * @param status - 'success | failure ' - custom messaging for either response 
   * @param message - text | HTML to display
   */
  setRequestCompleteMessage = (status : string, message :string) : void => {
    this.form.setResponseMessage(status, message);
  }


  //build user input form
  createModal = (blockUIpath : string,  formData ?: FormControl, formContainerStyles? : any ): void => {
    this.form = new FormBuilder(this, blockUIpath, formData, formContainerStyles);
  }
  //adjust css of modal form
  updateFormPositioning = (formContainerStyles : any): void => {
    this.form.updateContainerStyle(formContainerStyles);
  }
  //point form submit to server
  setEndpoint = (url : string) => {
    this.form.setEndpoint(url);
  }
  //add | change data file location
  setDriverLocation = (driverLocation :string): void => {
    this.driverLocation = driverLocation;
  }
  //retrieve data
  getData = () => {
    let pointer= this;

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
    .fail(xhr => {console.log('data lookup failure: ', xhr);});
  }
  //get adjacent month/year
  getSibling = (movement : string): any => {

    let response = {
      month : this.currentMonth, 
      year : this.currentYear
    }

    if(movement == 'next'){
      if(this.currentMonth < 11)
        response.month++
      else {
        response.month = 0;
         response.year++;
      }
    }
    if(movement == 'prev'){
      if(this.currentMonth > 0)
        response.month --;
      else {
        response.month = 11;
        response.year--;
      }
    }
    return response;
  }
  //construct DOM table body
  render = (): void => {
    this.parent.innerHTML = "";

    let tbl_html = document.createDocumentFragment();
    let counter = 1;

    let daysInThisMonth = this.daysInMonth(this.currentYear, this.currentMonth);
    let prev = this.getSibling('prev');
    let next = this.getSibling('next');
    let daysInPreviousMonth = this.daysInMonth(prev.year, prev.month);
    //get first day of this month
    let firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    let weekdays = firstDay.getDay();
    let weekdays2 = weekdays;
    //define current point in time
    let yearInPast = this.currentYear < this.baseYear;
    let yearInPresent = this.currentYear == this.baseYear;
    let yearInFuture = this.currentYear > this.baseYear;
    let monthInPast = yearInPast || (yearInPresent && this.currentMonth < this.baseMonth);
    let monthInPresent = yearInPresent && this.currentMonth == this.baseMonth;
    let monthInFuture = (yearInFuture || (yearInPresent && this.currentMonth >  this.baseMonth));

    //begin DOM construction
    let tr = document.createElement("tr");
    tbl_html.appendChild(tr);
    //add trailing days of last month
    while(weekdays > 0){
      let dayIsInPast = monthInPast || monthInPresent;
      let trailingDayNumber = (daysInPreviousMonth - (weekdays -1));
      let td = document.createElement('td');
      td.innerText = trailingDayNumber.toString();
      if(dayIsInPast){
        td.classList.add("monthPre");
        td.classList.add("dayPast");
      }
     
      td.classList.add("day");
      tr.appendChild(td);
      let isTrailingSunday = weekdays == weekdays2;
      this.compare(td, this.dateToString(prev.year, prev.month, counter), isTrailingSunday ? 0 : 1);
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
      
      //is today?
      if(yearInPresent && monthInPresent && counter == this.currentDate.getDate())
        td.classList.add('today');
      

      if(monthInFuture)
        td.classList.remove('monthPre');

      if(yearInPast || monthInPast || (monthInPresent && counter < this.baseDate.getDate()))  
        td.classList.add("dayPast");
      if(monthInPresent && (counter == this.baseDate.getDate()) )
        td.classList.add("dayNow");
      if(monthInFuture || monthInPresent && this.currentDate.getDate() > this.baseDate.getDate())
      td.classList.add("dayFuture");
      //persist date value
      (<any>td.dataset).date = this.dateToString(this.currentYear, this.currentMonth, counter);
      
      //add click handler for form display
      this.addOnclick(td);

      //check against datastore for date matches
      if(!!this.data)
        this.compare(td, this.dateToString(this.currentYear, this.currentMonth, counter), weekdays2);

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
      //console.log('nextMonthDate: ', nextMonthDate);
      (<any>td.dataset).date = nextMonthDate;
      td.appendChild(txt);
      tr.appendChild(td);
      //check against datastore for date matches
      if(!!this.data)
        this.compare(td, nextMonthDate, weekdays2);
      //add click handler for form display
      this.addOnclick(td);
      nextMonthCounter ++;
      weekdays2++;
    }
    this.buildTable(tbl_html);
    
    if(this.showLegend) this.buildLegend();
  }

  buildLegend = () => {
    let states = [
      { state: 'available', text :"Available"},
      { state: 'booked' , text :"Booked"},
      { state: 'pending' , text :"Pending"},
      { state: "unavailable", text :"Unavailable"}
    ]
    let legend = document.createElement('div');
    legend.classList.add('key-container');
    legend.id = "legend-container";

    legend.style.width = document.getElementById('calendar-table').getBoundingClientRect().width+ "px";

    for(let i = 0; i  < states.length; i++){
      let record = states[i];
      let elem = document.createElement('div');
      elem.classList.add('key-pair-container');
      let text = document.createElement('div');
      text.classList.add('key-text');
      text.innerText = record.text;
      let state = document.createElement('div');
      state.classList.add(record.state);
      state.classList.add('key-color-box');

      elem.appendChild(text);
      elem.appendChild(state);
      legend.appendChild(elem);
    }
    this.parent.appendChild(legend);
  }
  //event listener for calendar day button
  addOnclick = (td : HTMLElement) =>{
    if(!td.classList.contains('dayPast')){
      var pointer = this;
      td.onclick = function(){
        pointer.form.showForm((<any>td.dataset).date);
      }
    }  
  }
  //mark known events
  compare = (td: HTMLElement, dateString: string, dayOfWeek) => {

     //strip weekend availability?
     if( !this.availableOnWeekends && (dayOfWeek == 6 || dayOfWeek == 0) ){
      td.classList.remove('available');
      td.classList.add('unavailable');
    }

    for(let i = 0; i  <this.data.length; i++){
      let date = this.data[i];
      //update element classlist on date match
      if(date.string == dateString){
        td.classList.add(date.status);
        if(td.classList.contains('unavailable') && date.status != 'unavailable')
          td.classList.remove('unavailable');
      }
    }
  }
  //construct DOM table head
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
  //wrapper for firing DOM construct functions
  buildTable = (bodyContent : DocumentFragment) => {

    let table = document.createElement('table');
    table.classList.add('calendar');
    table.id = "calendar-table";

    this.buildHeader(table);
   
    table.appendChild(bodyContent);
    this.parent.innerHTML = "";
    this.parent.appendChild(table);
    //navigation
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
  //redraw table
  update = (isRightClick : boolean) => {

    let key = isRightClick ? "next" : "prev";
    let adj = this.getSibling(key);
    this.currentMonth = adj.month;
    this.currentYear = adj.year;

    this.currentDate = new Date(this.currentYear, this.currentMonth);
    this.render();
  }
}