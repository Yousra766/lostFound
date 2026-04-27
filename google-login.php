<?php
require 'vendor/autoload.php';
require 'config.php';

session_start();

$client = new Google_Client();
$client->setClientId("TON_CLIENT_ID");
$client->setClientSecret("TON_CLIENT_SECRET");
$client->setRedirectUri("http://localhost/projetphp/google-callback.php");
$client->addScope("email");
$client->addScope("profile");

header("Location: " . $client->createAuthUrl());
exit;
?>