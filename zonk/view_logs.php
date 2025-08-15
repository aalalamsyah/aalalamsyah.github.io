<?php
// view_logs.php

$logFile = 'access_log.txt';

// Periksa apakah file log ada
if (file_exists($logFile)) {
    // Baca seluruh isi file log
    $logContent = file_get_contents($logFile);

    echo "<!DOCTYPE html>
          <html lang='id'>
          <head>
              <meta charset='UTF-8'>
              <title>Log Akses</title>
              <style>
                  body { font-family: 'Fira Code', monospace; background-color: #1a1a1a; color: #00ff88; white-space: pre-wrap; }
                  pre { background-color: #0d0d0d; padding: 20px; border: 1px solid #00ff88; }
              </style>
          </head>
          <body>
              <h2>Log Aktivitas Pengunjung</h2>
              <pre>$logContent</pre>
          </body>
          </html>";
} else {
    echo "File log tidak ditemukan.";
}
?>