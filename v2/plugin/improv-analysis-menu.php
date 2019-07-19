<?php
/*
Plugin Name: Improv Analysis Database & Menu
Plugin URI: http://www.rodrigoconstanzo.com
Description: Store Rodrigo's Improv Analysis data in the db
Version: 0.6
Author: MADWORT
Author URI: http://www.madwort.co.uk
*/

function improv_analysis_stream_data(){
  return array(
      array("id"=>"1", "name"=>"Material"),
      array("id"=>"2", "name"=>"Formal"),
      array("id"=>"3", "name"=>"Interface"),
      array("id"=>"4", "name"=>"Interaction")
    );
}

function improv_analysis_url_id_exists($url_id)
{
  global $wpdb;

  $query = "SELECT * FROM improv_analysis_analyses WHERE url_id = '".
            $wpdb->_real_escape($url_id)."';";
  $result = $wpdb->get_results( $query );
  return (sizeof($result)!=0);
}

function improv_analysis_redirect_analyses_list()
{
  header("Location: ".menu_page_url( 'improv-analysis' ));
  die("");
}

include_once('analyses_list.php');
include_once('analyses_stats.php');
include_once('analysis_edit.php');
include_once('analysis_upload.php');
include_once('improv-analysis-install.php');

function improv_analysis_css_load(){
  wp_enqueue_style( 'improv_analysis_css' );
}

function improv_analysis_analysis_edit_link($url_id){
  return menu_page_url( 'improv-analysis-edit', false )."&analysis=".$url_id;
}

function improv_analysis_options_page() {
  wp_register_style( 'improv_analysis_css', 
                     plugins_url('improv-analysis-2.0/css/style.css'));

  $list_hookname = add_menu_page(
    "Improv Analysis",
    "Improv Analysis",
    "improv-analysis-options",
    'improv-analysis',
    'improv_analysis_analyses_list'
  );
  add_action( 'load-' . $list_hookname, 'improv_analysis_list_submit' );
  add_action( 'load-' . $list_hookname, 'improv_analysis_css_load' );
  
  $stats_hookname = add_submenu_page(
    'improv-analysis',
    'Analysis stats',
    'Stats',
    'improv-analysis-options',
    'improv-analysis-stats',
    'improv_analysis_analyses_stats'
  );
  add_action( 'load-' . $stats_hookname, 'improv_analysis_css_load' );

  $analysis_edit_hookname = add_submenu_page(
      'improv-analysis',
      'Analysis editor',
      'Editor',
      'improv-analysis-options',
      'improv-analysis-edit',
      'improv_analysis_analysis_edit'
  );
  add_action( 'load-' . $analysis_edit_hookname, 
             'improv_analysis_analysis_edit_submit' );
  add_action( 'load-' . $analysis_edit_hookname, 'improv_analysis_css_load' );

  $upload_hookname = add_submenu_page(
      'improv-analysis',
      'Upload analysis',
      'Upload',
      'improv-analysis-options',
      'improv-analysis-upload',
      'improv_analysis_upload_analysis'
  );
  add_action( 'load-' . $upload_hookname, 'improv_analysis_upload_submit' );
  add_action( 'load-' . $upload_hookname, 'improv_analysis_css_load' );
  
  $install_hookname = add_submenu_page(
      'improv-analysis',
      'Install',
      'Install',
      'improv-analysis-options',
      'improv-analysis-install',
      'improv_analysis_install'
  );
  add_action( 'load-' . $install_hookname, 
             'improv_analysis_install_submit' );
  add_action( 'load-' . $install_hookname, 'improv_analysis_css_load' );
}

add_action( 'admin_menu', 'improv_analysis_options_page' );

?>
