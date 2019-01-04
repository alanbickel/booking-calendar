
interface FormElement {
  id:string; 
  name?:string; 
  type:string; 
  label?:string; 
  placeholder ? : string;
  defaultValue?:any; 
  checked?:boolean; 
  cols?:number;
  rows ? : number; 
  defaultOption?: {
    value:string; 
    text:string; 
  }; 
  opts?: {
    value:string; 
    text:string; 
  }[]; 
  validation?:Function; 
  validationErrorMessage?:string
}

interface FormControl {
  [index:number]:FormElement;
}