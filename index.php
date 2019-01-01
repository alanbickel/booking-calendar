<?php

?>

<head>

 <link rel="stylesheet"  href="./vendor/font-awesome-4.7.0/css/font-awesome.min.css">
 
<script
  src="https://code.jquery.com/jquery-3.3.1.min.js"
  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
  crossorigin="anonymous"></script>
  <script src="js/build.js"></script>

  <script>
    $(document).ready(function(){
      let calendar = new Calendar(document.getElementById('calendar-div'));
      calendar.render();
    });
  </script>
</head>

<body>
  <div id="calendar-div"></div>
</body>