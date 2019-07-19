<?php

function improv_analysis_stream_radio_button($stream, $value)
{
?>
  <input type="radio" name="stream[<?php echo $value->id; ?>]" 
    value="<?php echo $stream['id'] ?>" <?php 
    if ($stream['id'] == $value->stream) {
      ?>checked="checked"<?php
    } ?>>
<?php
}

function improv_analysis_analysis_edit()
{
  // this is to let you categorise events into streams
  ?>
  <div class="wrap">
    <h1>Improv Analysis Editing</h1>

    <?php
    // Catch bad url_id in improv_analysis_analysis_edit_submit(), not here

    global $wpdb;
    $query = "SELECT * FROM improv_analysis_analyses WHERE ".
             "url_id = '".$wpdb->_real_escape($_GET['analysis'])."'";
    $result = $wpdb->get_results( $query );

    $analysis = $result[0];

    echo "<h2>Editing ".$analysis->title." - ".$analysis->performer."</h2>";

    $query = "SELECT * FROM improv_analysis_events WHERE ".
             "analysis_id = '".$analysis->id."'";
    $result = $wpdb->get_results( $query );

    $streams = improv_analysis_stream_data();

    ?>
    <form action="<?php echo improv_analysis_analysis_edit_link($analysis->url_id) 
      ?>" method="post" 
          accept-charset="utf-8">
      <table>
      <tr>
        <th>Time</th>
        <?php foreach ($streams as $stream) {
          ?><th><?php echo $stream["name"] ?></th><?php
        } ?>
        <th>Comment</th>
      </tr>
      <?php
      foreach ($result as $key => $value) { ?>
        <tr>
          <td><?php echo $value->time; ?></td>
            <?php foreach ($streams as $stream) {
              ?><td class="<?php echo strtolower($stream['name']); ?>"><?php
              improv_analysis_stream_radio_button($stream, $value);
              ?></td><?php
            } ?>
          <td><?php echo $value->comment; ?></td>
        </tr><?php
      }
      ?></table>
    <p><input type="submit" value="Submit changes &rarr;"></p>
    </form>
  </div>
  <?php
}

function improv_analysis_analysis_download_csv()
{
  header('Content-type: text/csv');
  header('Content-Disposition: attachment; filename="'.
          $_GET['analysis'].'.csv"');
  header('Pragma: no-cache');
  header('Expires: 0');
 
  $file = fopen('php://output', 'w');
 
  fputcsv($file, array('time', 'stream', 'comment'));

  global $wpdb;
  $query =
    "SELECT time,stream,comment from improv_analysis_events WHERE analysis_id=".
      "(SELECT id from improv_analysis_analyses WHERE url_id='".
      $wpdb->_real_escape($_GET['analysis'])."' LIMIT 1) ORDER BY id";

  $analysis_list = $wpdb->get_results($query, ARRAY_N);
  
  foreach ($analysis_list as $analysis)
  {
    fputcsv($file, $analysis);
  }
 
  exit();
}

function improv_analysis_analysis_save_changes()
{
  global $wpdb;
  foreach ($_POST['stream'] as $key => $value) {
    $query = "UPDATE improv_analysis_events SET stream = ".
              $wpdb->_real_escape($value)." WHERE ".
             "id = '".$wpdb->_real_escape($key)."'";
    $result = $wpdb->get_results( $query );
    
  }
}

function improv_analysis_analysis_edit_submit()
{
    if (!improv_analysis_url_id_exists($_GET['analysis'])) {
      improv_analysis_redirect_analyses_list();
    };

    if($_GET['csv'] === "1") {
      improv_analysis_analysis_download_csv();
    }

    if('POST' === $_SERVER['REQUEST_METHOD']) {
      improv_analysis_analysis_save_changes();
    };
}

?>