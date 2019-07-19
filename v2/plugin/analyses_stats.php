<?php

function improv_analysis_get_event_count($analysis_id, $stream_id = 0)
{
  global $wpdb;    
  $query = "SELECT count(id) AS count FROM improv_analysis_events ".
                       "WHERE analysis_id='".$analysis_id."'";

  if ($stream_id != 0) {
    $query .= " AND stream='".$stream_id."'";
  }

  $result = $wpdb->get_results($query);
  return $result[0]->count;
}

function improv_analysis_analyses_stats()
{
    ?>
    <div class="wrap">
      <h1>Improv Analysis Administration Panel</h1>
      <?php
      
      global $wpdb;    
      $result = $wpdb->get_results( "SELECT * FROM improv_analysis_analyses");
      ?><table>
      <tr>
        <th>Performer</th>
        <th>Title</th>
        <th>Duration(sec)</th>
        <th>Events</th>
        <th>Event/sec</th>
        <?php $streams = improv_analysis_stream_data();
        foreach ($streams as $stream) {
          ?><th class="<?php echo strtolower($stream['name']); ?>"><?php 
            echo $stream['name']; ?></th>
          <?php
        }
        ?>
        <th>Links</th>
      </tr>
      <?php
            foreach ($result as $key => $value) {
              ?><tr>
                <td><?php echo $value->performer; ?></td>
                <td><?php echo $value->title; ?></td>
                <td><?php echo $value->duration; ?></td>
                <?php $event_count =
                  improv_analysis_get_event_count($value->id); ?>
                <td><?php echo $event_count; ?></td>
                <td><?php echo round($event_count/$value->duration,2); ?></td>
                <?php
                foreach ($streams as $stream) {
                  ?><td><?php 
                  echo round(improv_analysis_get_event_count($value->id, 
                                 $stream['id'])/$event_count*100); ?>%</td><?php
                }
                ?>
                <td>
                  <a href="<?php echo
                   improv_analysis_analysis_edit_link($value->url_id); ?>">Edit</a>
                </td>
              </tr><?php
            }
      ?></table><?php
      ?>
    </div>
    <?php
}
?>