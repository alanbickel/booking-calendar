<?php
/**
 * Request from client for event booking - 
 */


 /**
  * Shout out to ~ Narayan Prusty   for sitepoint phpmailer setup article
  https://www.sitepoint.com/sending-emails-php-phpmailer/
  */

require_once "../vendor/vendor/autoload.php";

/**
 * use external SMTP mail server - no local mail server 
 */

$mail = new PHPMailer;
$mail->SMTPDebug = 3;                     
$mail->isSMTP();            
$mail->Host = "smtp.gmail.com";
$mail->SMTPAuth = true;                          

/**
 * Your credentials here - this account is where  email will be sent from
 */
$mail->Username = "alan.bickel@gmail.com";                 
$mail->Password = "m3tall1ca"; 
//If SMTP requires TLS encryption then set it
$mail->SMTPSecure = "tls";                           
//Set TCP port to connect to 
$mail->Port = 587;

/**
 * This is the 'from' address that you will see when you recieve automated message.
 */
$mail->From = $mail->Username;

$mail->FromName = "Automated Request Email";

/**
 * This is the target email address - the email account to recieve the request
 */
$mail->addAddress("name@example.com", "Recepient Name");

//dis|en able HTML messages
$mail->isHTML(true);

//return a response status to the client
$response['success'] = $mail->send() ? 200 : 500 ;





?>