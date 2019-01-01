<?php

?>

<head>
<script
  src="https://code.jquery.com/jquery-3.3.1.min.js"
  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
  crossorigin="anonymous"></script>
  <script src="js/build.js"></script>

  <script>
    $(document).ready(function(){
      let calendar = new Calendar(document.getElementById('calendar-div'));
    });
  </script>
</head>

<body>
  <div id="calendar-div"></div>
</body>