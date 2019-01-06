///<reference path= "./formTemplates.ts" />
///<reference path= "../Types/jQuery/blockui.d.ts" />

class FormBuilder {

  /**
   * automate construction of 
   * textbox
   * textarea
   * select
   * checkbox 
   * 
   * elements & bind simple client-side validation on form 'submit'
   * 
   * TO DO!
   * ~support Radio group
   * ~ add CSS classes to template and implementation
   * ~ add class to form container, and style width in CSS - not inline when blockUI called.
   */

  private defaultForm:FormControl; 

  private validationFunctions : ValidationPair[];

  public showForm : Function;
  /**
   * override default blockUI positioning?
   */
  private formStyling : any;

  /**
   * url to send request data to 
   */
  private endPoint : string;

  constructor(autoLoadCss: boolean = true, form?:FormControl, formStyling? : any) {
    //modal styles
    this.formStyling = formStyling ? formStyling : {
      width : "40vw", 
      left : "30%"
    };

    if(autoLoadCss){
      let styleLink = document.createElement('link');
      styleLink.id = "auto-load-form-styles";
      styleLink.rel = "stylesheet";
      styleLink.href = "./css/form-styles.css";
      document.body.appendChild(styleLink);
    }

    /**
     * auto-load blockui deps
     */
    let blockUIscript = document.createElement('script');
    blockUIscript.src = "./vendor/js/malsup/blockui.js";
    let pointer = this;
    /**
     * bind click events for form 'submit' and 'cancel' buttons
     * once deendency has loaded
     */
    blockUIscript.onload = function(){

      //define function that calls blockUI only when it is available & loaded
      pointer.showForm = function (date: string) {

        let header = document.getElementById('form-header');
        let _date = new Date(date).toDateString();
        header.innerText = _date;
        $.blockUI({
            message: document.getElementById('input-form'),
            css: this.formStyling
        });
    };
    //onclick handlers added only after blockUI is available
      pointer.bindFormButtonActions();
    }
    document.body.insertBefore(blockUIscript, document.body.firstChild);


    /**define default client input form */
    this.defaultForm = form?form: < FormControl >  {
      rows:[
        [ {
            id:"name-input", 
            name:"name", 
            label:"Name", 
            type:"text", 
            placeholder:"enter your name", 
            validationErrorMessage:"Please enter your name.", 
            validation:(value) =>  {
              return value.length && value.length > 1
            }
           
          }
        ], 
        [ {
            id:'mode-select', 
            name:'mode-select', 
            type:"select", 
            label : "Event Type", 
            defaultOption: {
             text:"Select Event Type", 
             value:"default"
            }, 
            opts:[ {
                text:"Portrait Session", 
                value:"portrait-session"
              },  {
                text:"Wedding", 
                value:"wedding"
              },  {
                text:"Birthday Party", 
                value:"birthday"
              }
            ], 
            validationErrorMessage:"Please select an event type.", 
            validation:(value) =>  {
              return value != "default"; 
            }
          }
        ], 
        [ {
            id:"email-input", 
            name:"email", 
            label:"Email", 
            type:"text", 
            validationErrorMessage:"Please enter your email.", 
            placeholder:"enter your email", 
            validation:(value) =>  {
             // let validation = /^[a - zA - Z0-9._ - ] + @[a - zA - Z0-9. - ] + \.[a - zA - Z] {2, 4}$/; 
             // return validation.test(value); 
              var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              return re.test(String(value).toLowerCase());
            }
          }
        ], 
        [
          {
            id : "notes", 
            name: "notes", 
            label : "Details", 
            placeholder : "Tell us a little about your request!", 
            type: "textarea", 
            cols : 35, 
            rows : 3
          }
        ]
      ]
    }

    this.validationFunctions = [];
    this.buildForm(); 
  }

  buildForm = () =>  {
    let form = document.createElement('div'); 
    
    form.style.display = "none"; 
    form.id = "input-form";

    let formChild = document.createElement('div');
    formChild.classList.add('display-form'); 

    form.appendChild(formChild);

    /**add  empty header element - to be populated with date on show */
    let header = document.createElement('div');
    header.classList.add('form-header');
    header.id = "form-header";

    formChild.appendChild(header);

    let formRows = this.defaultForm['rows'];

    for(let i = 0; i < formRows.length; i++){
      let rowData = formRows[i]; 
      let rowElement = document.createElement('div'); 
      rowElement.classList.add('form-row');     

      for (let j in rowData) {

        //form elements
        let elementData = rowData[j]; 
        let container = document.createElement('div'); 
        container.classList.add('form-element-container');

        let label = null; 
        if (elementData.label)
          label = this.createLabel(elementData.id, elementData.label); 
        let element = this.createElement(elementData);

        if(label) container.appendChild(label);
        container.appendChild(element);

        //store simple validations
        if(elementData.validation){
          let vp : ValidationPair = {
            function : elementData.validation, 
            failMessage : elementData.validationErrorMessage, 
            elementId : elementData.id
          }
          this.validationFunctions.push(vp);
        }
        rowElement.appendChild(container);
      }
      formChild.appendChild(rowElement);
    }
    document.body.appendChild(form);    

    this.addControlButtons(formChild);
  }

  bindFormButtonActions = () => {
    let pointer = this;

    $(document).on('click', '#form-cancel-button', function(){
      $.unblockUI();
    });
    $(document).on('click', "#form-submit-button", function(){
     let validInput =  pointer.validate();
     let dateString = document.getElementById("form-header").innerText;
    
     if(! validInput) return false;

    pointer.submitForm(dateString);
     
    })
  }

  addControlButtons  = (formElement : HTMLElement) : void => {

    let row = document.createElement("div");
    row.classList.add('form-element-container');
    row.classList.add('button-container');

    let cancelButton = document.createElement('button');
    cancelButton.innerText = "Cancel";
    cancelButton.classList.add('form-button');
    cancelButton.classList.add('cancel-button');
    cancelButton.id = "form-cancel-button";

    let submitButton = document.createElement('button');
    submitButton.innerText = "Submit";
    submitButton.classList.add('form-button');
    submitButton.classList.add('submit-button');
    submitButton.id = "form-submit-button";

    row.appendChild(cancelButton);
    row.appendChild(submitButton);
    formElement.appendChild(row);
  }

  createLabel = (id, text):HTMLLabelElement =>  {

    let label = document.createElement("label"); 
    label.classList.add('form-element-label');
    label.htmlFor = id; 
    label.innerText = text; 
    return label; 
  }

  createElement = (elementData:FormElement):HTMLElement =>  {
    let element; 
    switch (elementData.type) {

      case "select": {

        element = document.createElement('select'); 
        if (elementData.defaultOption) {
          let dOpt = document.createElement('option'); 
          dOpt.value = elementData.defaultOption.value; 
          dOpt.text = elementData.defaultOption.text; 
          element.appendChild(dOpt); 

          for (let i = 0; i < elementData.opts.length; i++) {
            let opt = document.createElement('option'); 
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
        elementData.placeholder?element.placeholder = elementData.placeholder: {}; 
        break; 
      }
      case "textarea": {
        element = document.createElement('textarea'); 
        element.cols = elementData.cols ? elementData.cols : 25;
        element.rows = elementData.rows ? elementData.rows : 3;
        element.placeholder = elementData.placeholder ? elementData.placeholder : ""; 
      }

    }
    let defaultUniqueVal = "input-" + (Math.random() * 100).toFixed(0).toString(); 
    element.id = elementData.id?elementData.id:defaultUniqueVal; 
    element.name = elementData.name?elementData.name:defaultUniqueVal; 
    element.classList.add('form-element-input');
   // element.style.flex = 1;
    return element; 
  }

  validate = () => {
    let validationPool = this.validationFunctions;
    let result = false;
    for(let i = 0; i < this.validationFunctions.length; i++){
      let validation = this.validationFunctions[i];
      let inputValue = (<HTMLInputElement>document.getElementById(validation.elementId)).value;

      if(!validation.function(inputValue)){
        let message = validation.failMessage;
        var header = document.getElementById("form-header");
        var dateString = header.innerText;
        header.innerText = message;
        setTimeout(function(){
          header.innerText = dateString;
        }, 2000);

        return false;
      }
    }
    return true;
  }

  submitForm = (date: string) => {
    let pointer = this;
    let rows =  this.defaultForm['rows'];
    let payload: any = {};

    payload.date = date;

    for(let i = 0; i  < rows.length; i++){
      let row = rows[i];

      for(let j = 0; j < row.length; j++){
        let node = row[j];
        let propName = node.name;
        let element = document.getElementById(node.id);
        payload[propName] = (<any>element).value;
      }

      $.ajax({
        url : this.endPoint, 
        method:  "POST",
        data  : payload, 
        dataType : "JSON"
      })
      .done(response => {

      })
      .fail(xhr => {
        //unable to reach server
        console.log('XHR failure: ', xhr);
        $.blockUI({message : "Unable to connect to server.  ", timeout : 2000});
      })
    }

    /**
     * TODO ajax request do write to .dat
     */
    
     debugger;
  }

  setEndpoint = (url :string) => {
    this.endPoint = url;
  }
}

interface ValidationPair {
  function : Function;
  failMessage: string;

  elementId : string;
}


