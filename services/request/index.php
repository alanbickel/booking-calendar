<?php
/*Request from client for event booking*/


 /** https://github.com/PHPMailer/PHPMailer*/

  use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\Exception;

require_once "../../vendor/autoload.php";

/*define path to .env for email creds - keep outside of server document root*/
/*https://github.com/vlucas/phpdotenv */
$dotenv = Dotenv\Dotenv::create($_SERVER['DOCUMENT_ROOT']."/../event-calendar-env/");
$dotenv->load();

$MAILER_USER = $_ENV['MAILER_USER'];
$MAILER_PASS = $_ENV['MAILER_PASS'];
$MAILER_SMTP_HOST = $_ENV['MAILER_SMTP_HOST'];

$response;

$mail = new PHPMailer(true);                                          //Passing `true` enables exceptions
try {
    //Server settings
    $mail->SMTPDebug = 0;//2;                                         //debug                                 
    $mail->isSMTP();                                                  // Set mailer to use SMTP

    /**
     * SPECIFY YOUR MAIL SERVER HERE
     */
    $mail->Host = $MAILER_SMTP_HOST;                                  //primary [; backup] smpt hosts
    $mail->SMTPAuth = true;                                           // Enable SMTP authentication
    //pass creds
    $mail->Username = $MAILER_USER;                                   // SMTP username
    $mail->Password = $MAILER_PASS;                                   // SMTP password
    //use SSL 
    $mail->SMTPSecure = 'ssl';                                        // Enable TLS encryption, `ssl` also accepted
    $mail->Port = 465;                                                // TCP port 465 for 'ssl', 587 for 'tls'
    //'return' address
    $mail->setFrom($MAILER_USER, 'Automated Event Request');

    //DESTINATION
    $mail->addAddress($MAILER_USER, 'Automated Web Request');

    //Content
    $mail->isHTML(true);                                  
    //add form content to email body
    if(isset($_POST) && !empty($_POST)){

      $message = "\n";

      foreach($_POST as $key => $val){

        $str = filter_input(INPUT_POST, $key, FILTER_SANITIZE_STRING);

        $message.= "$key => $str<br />";
      }

      //append request timestamp
      $today = date("F j, Y, g:i a");                 
      $message .= "<br><br>Request Sent => ".$today;

      $mail->Subject = 'Automated Web Request';
      $mail->Body    = $message;
      $mail->AltBody = $message;
    }

    $mail->send();
    $response['status'] = 200;
    
} catch (Exception $e) {
  $response['status'] = 500;
  $response['message'] = $e->getMessage();
}
echo json_encode($response);
?>

