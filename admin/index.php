<?php

?>

<head>

<link rel="stylesheet"  href="./vendor/font-awesome-4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="./css/styles.css">
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

      calendar = new Calendar(document.getElementById('calendar-div'), formData);
      calendar.setDriverLocation("../services/dates.dat");
      calendar.setEndpoint("../services/update/");
      //get date information & render 
      calendar.getData();
    })
   });
 </script>
</head>


<body>
  <h4>Event Calendar - Admin</h4>
  <div id="calendar-div"></div>
</body>