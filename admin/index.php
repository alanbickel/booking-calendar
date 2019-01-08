<?php

?>

<head>

<link rel="stylesheet" href="../css/font-awesome-4.7.0/css/font-awesome.css">
<script
 src="https://code.jquery.com/jquery-3.3.1.min.js"
 integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
 crossorigin="anonymous"></script>
 <script src="../js/build.js"></script>

 <script>
   $(document).ready(function(){

    let calendar;
    
    //get form construct
    $.ajax({
      url : "./resources/form.json", 
      method : "GET", 
      dataType : "JSON"
    })
    .done((formData) => {
      //initialize calendar, provide form template
      calendar = new Calendar(document.getElementById('calendar-div') );
      //build user input form
      calendar.createModal("../js/malsup/blockui.js",formData );
      //style for modal form
      calendar.loadFormStyles('../css/form-styles.css');
      //style for calendar
      calendar.loadSelfStyles("../css/styles.css");
      //data source
      calendar.setDriverLocation("../services/dates.dat");
      //where to send updates
      calendar.setEndpoint("../services/update/");
      //customise form response messages
      calendar.setRequestCompleteMessage('success', "Date status has been updated.");
      calendar.setRequestCompleteMessage('failure', "Unable to update date status.");
      //get data, render calendar
      calendar.getData();
    })
   });
 </script>
</head>


<body>
  <h4>Event Calendar - Admin</h4>
  <div id="calendar-div"></div>
</body>