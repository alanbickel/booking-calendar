
# Event Calendar

A simple JS (TypeScript) | PHP application for a booking calendar, with minimal dependencies. The current incarnation supports full-day booking, and offers at-a-glance information about your availability. User friendly, fully customize-able input forms allow potential customers to request your services with just a few clicks. You control the layout, content, and validation, through a simple `.JSON` form object.

  

An administrative page allows you to quickly set the status for a given date.

  

If you just need a simple calendar for your page, you can implement with minimal configuration and zero server-side scripting.

The client-side calendar is based on | inspired by [Era Balliu's javascript calendar](https://www.webcodegeeks.com/javascript/javascript-calendar-example/), it also leverages [Malsup's BlockUI jQuery Plugin](http://malsup.com/jquery/block/) for modal input forms.

Server side, it leverages [PHPMailer](https://github.com/PHPMailer/PHPMailer) for sending messages to your desired email account, and [phpdotenv](https://github.com/vlucas/phpdotenv) to store email credentials safely outside the document root.

  

## configuring server endpoints

All components are included in the repo, but do not need to retain relative structure.

- For server-side code, you will need one directory, which we will (arbitrarily) call `calendar-root/`

- Move `composer.json, composer.lock`, and the `services/` folder into `calendar-root/`.

- run `composer-install`

-  [phpdotenv](https://github.com/vlucas/phpdotenv) will look for a `.env` file located one directory above your server's document root, called `event-calendar-env`. This can be changed in `services/request/index.php [ln 14]`

- in you `.env` file, you'll need:

```

MAILER_USER = " your.email@address"

MAILER_PASS = "your*password";

MAILER_SMTP_HOST = "your.smtp.server"

```

- Depending on your email host, you may need to alter the `PHPMailer` configuration in `services/request/index.php` (gmail, for instance, does **not** play nicely with default ssl authentication...)

- Additionally, you'll need to ensure that PHP has write access to `services/dates.dat`

  
  

## Client Side

  

For simply displaying a calendar, you need nothing more than:

```

let tgtElement= document.getElementById('target-element');

let calendar = new Calendar(tgtElement);

calendar.render();

```

For enabling requests, and for more detailed configuration, read on.

# API

  

### creating the web-form

Event Calendar utilizes a dynamic form-builder, which lets you quickly customize the forms that your user sees when they click a date , provide custom validation, and easily tweak design layouts. Here's a quick synopsis of the form structure:

Each element you want in your form is represented by a FormElement object.

(properties tagged with a ? are optional)

```

FormElement {

id: //string : element id

name?: //string : element name

type: //string : text | select | textArea | checkbox

label?: // string :label element for this input?

placeholder? //string : placeholder for text-type inputs

defaultValue? // any : the default value of this input

checked? //boolean : for checkbox input type

cols? //bumber : columns for textArea

rows? //number: rows for text area

defaultOption?: { //default select option

value: ""

text:""

};

opts?: { //object array of values for select boxes

value:string

text:string;

}[];

//validation is an optional function that accepts 1 argument when called : the input's value. must return boolean.

validation?:Function;

//message to display if validation function returns false

validationErrorMessage?:string

}

```

The Form control object, which is suppled to the form builder is an object as such :

```{ rows : [

[{formElement}, {formElement}...]

[]...

]

```

where rows is an array of object arrays; each object constitutes a column in the row, and each array of objects represents a row in the form.

The default form for the client calendar displays a demo form for a photographer,

and the default form for the admin calendar displays a simple status update form.

view `admin/resources/form.json` for an example of how the FormControl objct is built.

  

The form builder only includes the blockUI library on initialization, so we need to pass it the path relative to where calendar is initialized. The default location is

`./js/malsup/blockui.js`.

  
the form generator is initialized as follows

```javascript
let calendar = new Calendar(document.getElementById('calendar-div')tgtElement);

let myCustomFormControlObject = {...};
let pathToBlockUI = "./js/malsup/blockui.js";
calendar.createModal(pathToBlockUI, myCustomFormControlObject);
```

### Adding Styles

Now, we need to provide some styles for the form.  
`calendar.loadFormStyles('./css/form-styles.css');`
Minimal styles here - just enough to get you rolling

We can load styles for the calendar in a similar fashion
`calendar.loadSelfStyles("./css/styles.css");`

### Loading Dates  - (Showing status)

Remember the  `calendar-root/` forlder from way up in the server configuration? 
The default path to the dates file is `calendar-root/services/dates.dat`

```javascript
let path = "path\to\date-file"
calendar.setDriverLocation(path);
```
We'll also need to point to the PHP script which actually sends the request.
The default location is `calendar-root/services/requests/`.

```javascript
let endpointPath = "path\to\request-endpoint";
calendar.setEndpoint("./services/request/");
```
Now, you're all wired up, and ready to render the calendar.

`calendar.getData();`
This function retrieves data file contents, parses the dates, and then renders the calendar 


