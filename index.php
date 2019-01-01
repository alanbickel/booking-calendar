<?php

?>

<head>

 <link rel="stylesheet"  href="./vendor/font-awesome-4.7.0/css/font-awesome.min.css">
 <link rel="stylesheet" href="./css/styles.css">
<script
  src="https://code.jquery.com/jquery-3.3.1.min.js"
  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
  crossorigin="anonymous"></script>
  <script src="js/build.js"></script>

  <script>
    $(document).ready(function(){
      let calendar = new Calendar(document.getElementById('calendar-div'));
      calendar.setDriverLocation("./services/dates.dat");
      calendar.getData();
     // calendar.render();
    });
  </script>
</head>

<body>
  <h4>Event Calendar - Client</h4>
  <div id="calendar-div"></div>
</body>