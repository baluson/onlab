<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = $_POST['data'];
    $file = 'project.json';

    if (file_put_contents($file, $data)) {
        echo 'Data saved to ' . $file;
    } else {
        echo 'Error saving data to ' . $file;
    }
}
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $file = 'project.json';

    if (file_exists($file)) {
        $data = file_get_contents($file);
        echo $data;
    } else {
        echo 'File does not exist';
    }
}
