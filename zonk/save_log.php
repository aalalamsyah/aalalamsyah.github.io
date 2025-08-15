<?php
// save_log.php

// Pastikan file log bisa ditulis oleh server
$logFile = 'access_log.txt';

// Ambil data dari pengunjung
$ipAddress = $_SERVER['REMOTE_ADDR'];
$userAgent = $_SERVER['HTTP_USER_AGENT'];
$accessTime = date('Y-m-d H:i:s');
$referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'N/A';

// Format data yang akan disimpan
$logData = "--------------------------------\n";
$logData .= "Time       : " . $accessTime . "\n";
$logData .= "IP Address : " . $ipAddress . "\n";
$logData .= "User Agent : " . $userAgent . "\n";
$logData .= "Referer    : " . $referer . "\n";
$logData .= "--------------------------------\n\n";

// Buka file log dalam mode 'a' (append) untuk menambahkan data di akhir file
// Gunakan LOCK_EX untuk mencegah penulisan log secara bersamaan (race condition)
file_put_contents($logFile, $logData, FILE_APPEND | LOCK_EX);

// Beri respons 200 OK ke browser
http_response_code(200);
?>