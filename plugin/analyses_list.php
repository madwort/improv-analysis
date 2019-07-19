<?php

function improv_analysis_analyses_list()
{
    ?>
    <div class="wrap">
      <h1>Improv Analysis Administration Panel</h1>

      <p><a href="<?php 
        echo menu_page_url( 'improv-analysis',false)."&csv=1"; 
        ?>">Download analysis metadata CSV</a></p>

      <?php
      
      global $wpdb;    
      $result = $wpdb->get_results( "SELECT * FROM improv_analysis_analyses");
      ?><table>
      <tr>
        <th>Performer</th>
        <th>Title</th>
        <th>Duration(sec)</th>
        <th>Events</th>
        <th>Instruments</th>
        <th>Performer count</th>
        <th>Date filmed</th>
        <th>Date analysed</th>
        <th>Comment</th>
        <th>Links</th>
      </tr>
      <?php
      if(count($result) == 0 &&
         strpos($wpdb->last_error, "improv_analysis_analyses' doesn't exist"))
      {
        ?>Have you created the database tables?<?php
      }

            foreach ($result as $key => $value) {
              ?><tr>
                <td><?php echo $value->performer; ?></td>
                <td><?php echo $value->title; ?></td>
                <td><?php echo $value->duration; ?></td>
                <?php $event_count =
                  improv_analysis_get_event_count($value->id); ?>
                <td><?php echo $event_count; ?></td>
                <td><?php echo $value->instruments; ?></td>
                <td><?php echo $value->performer_count; ?></td>
                <td><?php echo $value->date_filmed; ?></td>
                <td><?php echo $value->date_analysed; ?></td>
                <td><?php echo $value->comment; ?></td>
                <td>
                  <a href="<?php echo
                   improv_analysis_analysis_edit_link($value->url_id); 
                   ?>">Edit</a>
                   <a href="#">View</a>
                  <a href="<?php echo
                   improv_analysis_analysis_edit_link($value->url_id)."&csv=1"; 
                   ?>">CSV</a>
                </td>
              </tr><?php
            }
      ?></table>
      <?php
      ?>
    </div>
    <?php
}

function improv_analysis_list_submit()
{
  if ($_GET['csv'] !== '1'){
    return;
  }

  header('Content-type: text/csv');
  header('Content-Disposition: attachment; filename="analysis-db.csv"');
  header('Pragma: no-cache');
  header('Expires: 0');
 
  $file = fopen('php://output', 'w');
 
  fputcsv($file, 
          array('id', 'name', 'title', 'date filmed', 'date analysed',
                'duration', 'url id', 'instruments', 'performer count',
                'comments', 'media url'));

  global $wpdb;
  $query = "SELECT id, performer, title, date_filmed, date_analysed,
                duration, url_id, instruments, performer_count,
                comment, media_url from improv_analysis_analyses ORDER BY id";
  $analysis_list = $wpdb->get_results($query, ARRAY_N);
  
  foreach ($analysis_list as $analysis)
  {
    fputcsv($file, $analysis);
  }
 
  exit();
}

?>