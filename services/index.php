<?php

$sourceFile = "./dates.dat"; 
$dates = json_decode(base64_decode(file_get_contents($sourceFile))); 

$action = $action = filter_input(INPUT_POST, 'action', FILTER_SANITIZE_STRING);
$source = filter_input(INPUT_POST, 'source', FILTER_SANITIZE_STRING);

if(!empty($action)){

  switch($action){
    case "read":{

      break;
    }
  }

}
?>