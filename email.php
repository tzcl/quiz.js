<?php
// CHANGE THIS for other sites!!
ini_set("include_path", '/home/meetdi/php:' . ini_get("include_path") ); 

require_once "Mail.php";

$from = "FROM";
// destination email
$to = "TO";

function died($error) {
    // your error code can go here
    echo "We are very sorry, but there were error(s) found with the form you submitted. " . $error;
    die();
    }

// validation expected data exists
if(!isset($_POST['name']) ||
    !isset($_POST['email']) ||
    !isset($_POST['subject']) ||
    !isset($_POST['message'])) {
        died('Something wasn\'t posted!');
}

$name = strip_tags(trim($_POST["name"]));
$name = str_replace(array("\r", "\n"), array(" ", " "), $name);

$email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);

// $company = strip_tags(trim($_POST['company']));
// $phone = strip_tags(trim($_POST['phone']));

$subject = strip_tags(trim($_POST['subject']));
$message = trim($_POST['message']);

$message = "Name: " . $name . "\r\n" . "Email: " . $email . "\r\n" . "\r\n" . "Message: " . "\r\n" . $message; 

$host = "smtp-relay.gmail.com";
$port = "587";
$username = "INSERT USERNAME";
$password = "INSERT PASSWORD";

$headers = array ('From' => $from,
  'To' => $to,
  'Subject' => $subject);
$smtp = Mail::factory('smtp',
  array ('host' => $host,
    'port' => $port,
    'auth' => true,
    'username' => $username,
    'password' => $password));
$mail = $smtp->send($to, $headers, $message);
if (PEAR::isError($mail)) {
  echo("" . $mail->getMessage() . "");
 } else {
  echo("Message successfully sent!");
 }
?>
