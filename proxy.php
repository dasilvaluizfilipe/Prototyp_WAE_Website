<?php
// DShield benötigt keinen Key für einfache Abfragen
$url = 'https://isc.sans.edu/api/sources/shorthostnames/100?json';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
// User-Agent ist bei DShield Pflicht
curl_setopt($ch, CURLOPT_USERAGENT, 'WAE-Research-Project'); 

$response = curl_exec($ch);
curl_close($ch);

header('Content-Type: application/json');
echo $response;
?>