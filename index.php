<?php

?>

<head>
  <link rel="stylesheet" href="./css/font-awesome-4.7.0/css/font-awesome.css">


<script
  src="https://code.jquery.com/jquery-3.3.1.min.js"
  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
  crossorigin="anonymous"></script>
  <script src="js/build.js"></script>

  <script>
    $(document).ready(function(){
      let calendar = new Calendar(document.getElementById('calendar-div'));
      //toggle color key display
      calendar.displayLegend(true);
      //build user input form
      calendar.createModal("./js/malsup/blockui.js");
      //style for modal form
      calendar.loadFormStyles('./css/form-styles.css');
      //style for calendar
      calendar.loadSelfStyles("./css/styles.css");
      //data source
      calendar.setDriverLocation("./services/dates.dat");
      //where to send request
      calendar.setEndpoint("./services/request/");
      //get data, render calendar
      calendar.getData();
    });
  </script>
</head>

<body>
  <h4>Event Calendar - Client</h4>
  <div id="calendar-div"></div>
</body>