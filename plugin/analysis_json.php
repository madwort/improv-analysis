<?php

// This is to be called directly, not through Wordpress
// So, using plain PHP functions (not Wordpress ones)
// Also, be more wary about safety!

header('Content-type: application/json');
 // header('Content-Disposition: attachment; filename="analysis.json"');
header('Pragma: no-cache');
header('Expires: 0');

include_once('db_config.php');

$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

$data = array();

$query = "SELECT id, performer, title, date_filmed, date_analysed,
              duration, url_id, instruments, performer_count,
              comment, media_url from improv_analysis_analyses ".
              " WHERE url_id='".$conn->escape_string($_GET['id']).
              "' ORDER BY id";

$res = $conn->query($query);
$data['metadata'] = $res->fetch_assoc();

$analysis_id = $data['metadata']['id'];
$query = "SELECT * from improv_analysis_events ".
          " WHERE analysis_id='".
          $conn->escape_string($analysis_id).
          "' ORDER BY id";
$conn->set_charset("utf8");

$res = $conn->query($query);
$events = $res->fetch_all(MYSQLI_ASSOC);

$data['events'] = $events;
echo json_encode($data);

?>