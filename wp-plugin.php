<?php
/*
Plugin Name: Improv Analysis
Plugin URI: http://www.rodrigoconstanzo.com/thesis/
Description: Package Improv Analysis tool for WP
Version: 0.4
Author: MADWORT
Author URI: http://www.madwort.co.uk
*/

function improv_analysis_scripts()
{
    wp_register_script( 'd3', plugins_url( 'bower_components/d3/d3.js', __FILE__ ) );
		wp_enqueue_script( 'd3' );
    wp_register_script( 'dimple', plugins_url( 'bower_components/dimple/dist/dimple.v2.1.2.min.js', __FILE__ ) );
		wp_enqueue_script( 'dimple' );
    wp_register_script( 'regression-js', plugins_url( 'bower_components/regression-js/build/regression.min.js', __FILE__ ) );
		wp_enqueue_script( 'regression-js' );
    wp_register_script( 'waveform-data', plugins_url( 'bower_components/waveform-data/dist/waveform-data.js', __FILE__ ) );
		wp_enqueue_script( 'waveform-data' );
    wp_register_script( 'jquery', plugins_url( 'bower_components/jquery/dist/jquery.min.js', __FILE__ ) );
		wp_enqueue_script( 'jquery' );
    wp_register_script( 'ionrangeslider', plugins_url( 'bower_components/ionrangeslider/js/ion.rangeSlider.min.js', __FILE__ ) );
		wp_enqueue_script( 'ionrangeslider' );

    wp_register_script( 'rodalytics-time', plugins_url( 'scripts/time.js', __FILE__ ) );
		wp_enqueue_script( 'rodalytics-time' );
    wp_register_script( 'rodalytics-rodalytics', plugins_url( 'scripts/rodalytics.js', __FILE__ , array('jquery')) );
		wp_enqueue_script( 'rodalytics-rodalytics' );
    wp_register_script( 'rodalytics-waveform-layouts', plugins_url( 'scripts/waveform-layouts.js', __FILE__ ) );
		wp_enqueue_script( 'rodalytics-waveform-layouts' );
    wp_register_script( 'rodalytics-audioEvents', plugins_url( 'scripts/audioEvents.js', __FILE__ ) );
		wp_enqueue_script( 'rodalytics-audioEvents' );
    wp_register_script( 'rodalytics-stats', plugins_url( 'scripts/stats.js', __FILE__ ) );
		wp_enqueue_script( 'rodalytics-stats' );
    wp_register_script( 'rodalytics-bubbleChart', plugins_url( 'scripts/bubbleChart.js', __FILE__ ) );
		wp_enqueue_script( 'rodalytics-bubbleChart' );
    wp_register_script( 'rodalytics-trendChart', plugins_url( 'scripts/trendChart.js', __FILE__ ) );
		wp_enqueue_script( 'rodalytics-trendChart' );
    wp_register_script( 'rodalytics-client', plugins_url( 'scripts/client.js', __FILE__ ) );
		wp_enqueue_script( 'rodalytics-client' );
	
}
add_action( 'wp_enqueue_scripts', 'improv_analysis_scripts' );

function improv_analysis_style()
{
    // wp_register_style( 'normalize.css', plugins_url( 'bower_components/normalize.css/normalize.css', __FILE__ ));
    // wp_enqueue_style( 'normalize.css' );
    wp_register_style( 'ionrangeslider', plugins_url( 'bower_components/ionrangeslider/css/ion.rangeSlider.css', __FILE__ ));
    wp_enqueue_style( 'ionrangeslider' );
    wp_register_style( 'ionrangeslider-skin', plugins_url( 'bower_components/ionrangeslider/css/ion.rangeSlider.skinFlat.css', __FILE__ ));
    wp_enqueue_style( 'ionrangeslider-skin' );

    wp_register_style( 'rodalytics.css', plugins_url( 'style/rodalytics.css', __FILE__ ));
    wp_enqueue_style( 'rodalytics.css' );
    wp_register_style( 'waveform-view.css', plugins_url( 'style/waveform-view.css', __FILE__ ));
    wp_enqueue_style( 'waveform-view.css' );

}
add_action( 'wp_enqueue_scripts', 'improv_analysis_style' );

add_shortcode('improv-analysis', 'improv_analysis_handler');

function improv_analysis_handler($atts)
{
  $a = shortcode_atts( array(
			'unique_name' => 'analysis1',
      'audio_url' => plugins_url( '/assets/Everything 1a.mp3', __FILE__ ),
      'data_url' => plugins_url( '/assets/Everything 1a.csv', __FILE__ ),
			'audio_length' => "209.6",
			'waveform' => 'false',
			'trend_chart' => 'false',
			'bubble_chart' => 'false',
			'stats' => 'false',
			'activity_log' => 'false'
  ), $atts );

	$a['waveform'] = 'true' === $a['waveform'];
	$a['trend_chart'] = 'true' === $a['trend_chart'];
	$a['bubble_chart'] = 'true' === $a['bubble_chart'];
	$a['stats'] = 'true' === $a['stats'];
	$a['activity_log'] = 'true' === $a['activity_log'];

	$html = "
			<div id=\"".$a['unique_name']."\">";

	if($a['waveform']) {
		$html .= "
					<!-- waveform -->
				  <div id=\"waveform\">
				    <div class=\"graph\" id=\"waveform-graph\" data-format=\"binary\" data-url=\"\" data-layout=\"area\"></div>
				  </div>
					<div class=\"clear\"></div>";
	}

	if($a['trend_chart']) {
		$html .= "
					<!-- chart 1 -->
	        <div id=\"chartContainer\" class=\"chartContainer\"";

		if($a['waveform']) {
			// bump up the chart to the bottom of the waveform
			$html .= " style='position: relative; top: -24px;'";
		}

		$html .= ">
		        <div id=\"chartControls\" class=\"chartControls\">
		          <input type=\"button\" name=\"btn_no_cat\" value=\"No duration\" id=\"btn_no_cat\" class=\"chart1btn enabled\">
		          <input type=\"button\" name=\"btn_all_cat\" value=\"Duration all cats.\" id=\"btn_all_cat\" class=\"chart1btn\">
		          <input type=\"button\" name=\"btn_same_cat\" value=\"Duration same cat.\" id=\"btn_same_cat\" class=\"chart1btn\">
		        </div>
	        </div>

	        <div class=\"clear\"></div>"; 
	};

	if($a['bubble_chart']) {
		$html .= "
				<!-- chart2  -->
        <div id=\"chartContainer2\" class=\"chartContainer\">
	        <div id=\"chartControls2\" class=\"\">
	          <span class=\"chartTitle\" id=\"trendChart\">Trend chart</span>
	          <input type=\"button\" name=\"btn2_cat_all\" value=\"All streams\" id=\"btn2_cat_all\" class=\"All streamSelection\">
	          <input type=\"button\" name=\"btn2_cat_1\" value=\"Material\" id=\"btn2_cat_1\" class=\"Material streamSelection\">
	          <input type=\"button\" name=\"btn2_cat_2\" value=\"Formal\" id=\"btn2_cat_2\" class=\"Formal streamSelection\">
	          <input type=\"button\" name=\"btn2_cat_3\" value=\"Interface\" id=\"btn2_cat_3\" class=\"Interface streamSelection\">
	          <input type=\"button\" name=\"btn2_cat_4\" value=\"Interaction\" id=\"btn2_cat_4\" class=\"Interaction streamSelection\"> 
	        </div>
        </div>
 
        <div class=\"clear\"></div>";
	};

	if($a['stats']) {
		$html .= "
        <!-- stats -->
        <div class=\"stats\">
          <h2>Activity Summary</h2>
          <div id=\"activitySummary\"></div>
        </div>    
      
        <div class=\"stats\">
          <h2>Co-occurrence</h2>
          <div id=\"cooccurrence\"></div>    
        </div>
            
        <div class=\"stats\">
          <h2>Duration stats per stream</h2>
          <div id=\"durationStats\"></div>
        </div>
      
        <div class=\"clear\"></div>";
	};

	if($a['activity_log']) {
				$html .= "
        <div class=\"stats\">
          <h2>Activity log</h2>
          <div id=\"activityLog\"></div>
        </div>

        <div class=\"clear\"></div>";
	};
				
	$html .= "
        <script type=\"text/javascript\">
          document.addEventListener('DOMContentLoaded',
            function(){
              client(\"#".$a['unique_name']."\", {
                \"audioUrl\": \"".$a['audio_url']."\",
                \"dataUrl\": \"".$a['data_url']."\",
                \"videoUrl\": \"https://vimeo.com/77930437\",
                \"analysisName\": \"Everything. Everything at once. Once. (1a)\",
                \"audioLength\": ".$a['audio_length']."
              });
            }
          );
        </script>

      </div>";
			
	return $html;
}

?>
