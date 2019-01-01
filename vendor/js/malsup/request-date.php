<?php

    ini_Set('display_errors', 'on');
    //php mailer
    require '../PHPMailerAutoload.php';
    define('DATE_LENGTH', 10); 

    
    $sourceFile = "./booking.dat"; 
    $content = file_get_contents($sourceFile);
    $_64d = base64_decode($content);

    $dates = json_decode($_64d); 

    $errors = [];

    /*gather server vars*/
    if(!($action = filter_input(INPUT_POST, 'action', FILTER_SANITIZE_STRING)))
        {$errors[] = "Invalid Action";}
    if(!($date = filter_input(INPUT_POST, 'date', FILTER_SANITIZE_STRING)))
        {$errors[] = "Invalid Date";}
    if(!($message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING)))
        {$errors[] = "Invalid Message";}
    if(!($type = filter_input(INPUT_POST, 'type', FILTER_SANITIZE_STRING)))
        {$errors[] = "Invalid Session Type";}
    if(!($name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING)))
        {$errors[] = "Invalid Name";}
    if(!($email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL)))
        {$errors[] = "Invalid Email Address";}

        if(!empty($errors))
        {
            $result = [];
            $result['status'] = "error";
            $result['error'] = $errors;
            //echo "error: ";
            echo json_encode($result);
            exit();
        }

    /*is request flag set*/
    if (isset($action) && ($action === "request-date")) {


        /*is string the right length*/
        if (strlen($date) === DATE_LENGTH) {

            /*did we recieve a legitimate date string?*/
            try {
                $_request_date = new DateTime($date);  //make sure we can format a valid date from client input

                //update data file
                $request = [];
                $request['string'] = $date;
                $request['status'] = "requested";

                $dates[] = $request;

                /*lets purge exipred dates from data file while we're here*/
                $new_date_array = [];

                $cur_date = new DateTime();

                foreach($dates as $thisdate)
                {
                    $test_date = new DateTime($thisdate['string']);
                    if($test_date >= $cur_date)
                    {
                        $new_date_array[] = $thisdate;
                    }
                }

                /*write updated list back to file*/
                $data = json_encode($new_date_array, true);
                $encoded = base64_encode($data);

                file_put_contents($sourceFile,$encoded);

                $response = [];
                $response['status']  ="success";
                $response['requested_date'] = $date;

                echo json_encode($response);
                exit();

            }
                 /*fail to create date. either server failure or bas string passed in*/
                 catch(Exception $e) {
                 die('{"status": "date_format_failure", "message": "unable to convert date"}'); 
            }
            //send email
            $mail = new PHPMailer;
            //Tell PHPMailer to use SMTP - requires a local mail server
            //Faster and safer than using mail()
            $mail->isSMTP();
            $mail->Host = 'localhost';
            $mail->Port = 25;

            //Use a fixed address in your own domain as the from address
            //**DO NOT** use the submitter's address here as it will be forgery
            //and will cause your messages to fail SPF checks
            $mail->setFrom('from@example.com', 'First Last');
            //Send the message to yourself, or whoever should receive contact for submissions
            $mail->addAddress('whoto@example.com', 'John Doe');
            //Put the submitter's address in a reply-to header
            //This will fail if the address provided is invalid,
            //in which case we should ignore the whole request

            $mail->Subject = 'Erica Bickel date request form';
            $mail->isHTML(false);
            //Build a simple message body
            $mail->Body = "
            Email: {$email}
            Name: {$name}
            Type: {$type}
            Date: {$date}
            Message: {$message}
            ";

            $result = [];
           // $result['status'] = "error";
           // $result['error'] = $errors;
            
            if (!$mail->send()){
                $msg = 'Sorry, something went wrong. Please try again later.';
                $result['status'] = "mail-send-error";
                $result['error'] = $msg;
            } 
            else{
                $result['status'] = "success";
                $result['error'] = "Your request has been sent";
            }
            echo json_encode($result);
            exit();  
        }
        
    }
?> 

