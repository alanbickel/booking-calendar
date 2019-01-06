<?php
//add date info to datafile

if(isset($_POST) && !empty($_POST)){

  $date = filter_input(INPUT_POST, 'date', FILTER_SANITIZE_STRING);
  $status = filter_input(INPUT_POST, 'date-status', FILTER_SANITIZE_STRING);

  $dataFile = "../dates.dat"; 

  $dates = json_decode(base64_decode(file_get_contents($dataFile)), true);
  //date that is being added to data set
  $updateDate = new DateTime($date);
  //current date
  $currentDate = new DateTime();

  //purge expired dates from dataset
  $cleanedDatesArray = [];
  $match = false;

  //compare against existing date store
  foreach($dates as $thisdate){
    $entryDate = new DateTime($thisdate['string']);

    //add future dates to the list
    if($entryDate >= $currentDate){
      //are we updating an existing entry?
      if($thisdate['string'] == $date){
        $thisdate['status'] = $status;
        $match = true;
      }
        
      $cleanedDatesArray[] = $thisdate;
    } 
  }

  if(!$match)
  $cleanedDatesArray[] = array(
    'string' => $date, 
    'status' => $status
  );
  //write file
  $data = json_encode($cleanedDatesArray, true);
  $encoded = base64_encode($data);
  file_put_contents($dataFile,$encoded);

  $response['status'] = 200;
  echo json_encode($response); 
 
}
?>