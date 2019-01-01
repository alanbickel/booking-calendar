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
    debugger;
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
  getSiblingMonth = (movement : string): any => {

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

  }
}