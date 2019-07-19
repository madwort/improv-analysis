<?php

function improv_analysis_install(){
  ?>
  <div class="wrap">
    <h1>Install Improv Analysis</h1>

    <?php

    global $wpdb;
    
    $test_query_1 = "SELECT * FROM improv_analysis_analyses;";
    $result = $wpdb->get_results($test_query_1);
    $missing_table_1 =
      strpos($wpdb->last_error, "improv_analysis_analyses' doesn't exist");

    $test_query_2 = "SELECT * FROM improv_analysis_events;";
    $result = $wpdb->get_results($test_query_1);
    $missing_table_2 =
      strpos($wpdb->last_error, "improv_analysis_events' doesn't exist");

    if ($missing_table_1 || $missing_table_2){
      ?>
      <p>Tests indicate that the database tables are missing.</p>
      <form action="<?php menu_page_url( 'improv-analysis-install' ) 
        ?>" method="post" accept-charset="utf-8">
        <input type="submit" name="install" value="Create the database tables!" id="install">
      </form>
        
    <?php
      
    } else {
      ?>Tests indicate that the database tables are in place.<?php
    }
}

function improv_analysis_install_submit()
{
    if('POST' !== $_SERVER['REQUEST_METHOD']) {
      return;
    };

    global $wpdb;

    $query = "CREATE TABLE `improv_analysis_analyses` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(127) COLLATE latin1_general_ci NOT NULL DEFAULT '',
  `performer` varchar(127) COLLATE latin1_general_ci NOT NULL DEFAULT '',
  `duration` float NOT NULL DEFAULT '0',
  `url_id` varchar(127) COLLATE latin1_general_ci NOT NULL DEFAULT '',
  `instruments` varchar(127) COLLATE latin1_general_ci NOT NULL DEFAULT '',
  `performer_count` int(11) NOT NULL DEFAULT '1',
  `comment` varchar(127) COLLATE latin1_general_ci NOT NULL DEFAULT '',
  `date_filmed` date NOT NULL,
  `date_analysed` date NOT NULL,
  `media_url` varchar(127) COLLATE latin1_general_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;";
    $result = $wpdb->get_results( $query );

    $query = "CREATE TABLE `improv_analysis_events` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `analysis_id` int(11) NOT NULL,
  `time` varchar(127) COLLATE latin1_general_ci NOT NULL,
  `stream` tinyint(4) NOT NULL DEFAULT '0',
  `comment` text COLLATE latin1_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;";
    $result = $wpdb->get_results( $query );

}

?>