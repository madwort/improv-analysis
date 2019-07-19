<?php 

function improv_analysis_upload_analysis()
{
  // upload csv files, set links to media files etc
  ?>
  <div class="wrap">
    <h1>Upload an improv analysis</h1>
    <form action="<?php menu_page_url( 'upload-analysis-upload' ) ?>" method="post" accept-charset="utf-8" enctype="multipart/form-data">
      <p><label for="csv">CSV</label><input type="file" name="csv" value="" id="csv"></p>
      <p><label for="performer">Performer</label><input type="text" name="performer" value="" id="performer"></p>
      <p><label for="title">Title</label><input type="text" name="title" value="" id="title"></p>
      <p><label for="duration">Duration</label><input type="text" name="duration" value="" id="duration"></p>
      <p><label for="url_id">URL id</label><input type="text" name="url_id" value="" id="url_id"></p>
      <p><label for="instruments">Instruments</label><input type="text" name="instruments" value="" id="instruments"></p>
      <p><label for="performer_count">Performer count</label><input type="text" name="performer_count" value="" id="performer_count"></p>
      <p><label for="date_filmed">Date filmed</label><input type="date" name="date_filmed" value="" id="date_filmed"></p>
      <p><label for="date_analysed">Date analysed</label><input type="date" name="date_analysed" value="" id="date_analysed"> </p>
      <p><label for="media_url">Media URL</label><input type="text" name="media_url" value="" id="media_url"></p>
      <p><label for="comment">Comment</label><input type="text" name="comment" value="" id="comment"></p>
      <p><input type="submit" value="Upload &rarr;"></p>
    </form>
    <?php

    ?>
  </div>
  <?php
}

// Expects to find data in $_POST
function improv_analysis_upload_metadata()
{
  global $wpdb;
  
  $query = 
    "INSERT INTO improv_analysis_analyses ".
    "(title, performer, duration, url_id, instruments, performer_count, ".
    "comment, date_filmed, date_analysed, media_url) VALUES('". 
      $wpdb->_real_escape($_POST['title'])."','".
      $wpdb->_real_escape($_POST['performer'])."',".
      $wpdb->_real_escape($_POST['duration']).",'".
      $wpdb->_real_escape($_POST['url_id'])."','".
      $wpdb->_real_escape($_POST['instruments'])."',".
      $wpdb->_real_escape($_POST['performer_count']).",'".
      $wpdb->_real_escape($_POST['comment'])."','".
      $wpdb->_real_escape($_POST['date_filmed'])."','".
      $wpdb->_real_escape($_POST['date_analysed'])."','".
      $wpdb->_real_escape($_POST['media_url'])."'".
    ")";

  $result = $wpdb->get_results( $query );

  $query = 
    "SELECT id FROM improv_analysis_analyses ".
    "WHERE url_id = '".$wpdb->_real_escape($_POST['url_id'])."'";

  $result = $wpdb->get_results( $query );

  $analysis_id = $result[0]->id;

  if ($analysis_id === 0) {
    die("Invalid analysis id, aborting.");
  }

  return $analysis_id;
}

function improv_analysis_upload_csv_data($analysis_id, $file_name)
{
  global $wpdb;
  
  if (($handle = fopen($file_name, "r")) !== FALSE) {
      while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
          $num = count($data);
          // empty or malformed line
          if ($num !== 3) { continue; }
          // header row
          if($data[0] === 'time') { continue; }
          $query = 
            "INSERT INTO improv_analysis_events ".
            "(analysis_id, time, stream, comment) VALUES".
            "('". $analysis_id ."','".
            $wpdb->_real_escape($data[0])."',".
            $wpdb->_real_escape($data[1]).",'".
            $wpdb->_real_escape($data[2])."')";

          $wpdb->get_results( $query );
      }
      fclose($handle);
  }  
}

function improv_analysis_upload_submit()
{
  if('POST' !== $_SERVER['REQUEST_METHOD']) {
    return;
  };

  if (improv_analysis_url_id_exists($_POST['url_id'])) {
    echo ("URL id is already taken! Go back & try again...");
    die();
    return;
  }

  $analysis_id = improv_analysis_upload_metadata();

  improv_analysis_upload_csv_data($analysis_id, $_FILES['csv']['tmp_name']);
  
  improv_analysis_redirect_analyses_list();
  
}
?>
