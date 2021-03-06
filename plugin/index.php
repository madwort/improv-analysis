<?php 

  if (isset($_GET['id']) && $_GET['id'] != '') {
    $url_id = $_GET['id'];
  } else {
    // default to "Everything 1a"
    $url_id = "1a";
  }

?><!doctype html>
<html>
	<head>
		<meta charset="UTF-8">
	  <script src="./bower_components/d3/d3.min.js"></script>
	  <script src="./bower_components/dimple/dist/dimple.v2.1.2.min.js"></script>
	  <script src="./bower_components/regression-js/build/regression.min.js"></script>
		<script src="./bower_components/waveform-data/dist/waveform-data.js"></script>
		<script src="./bower_components/jquery/dist/jquery.min.js"></script>
		<script src="./bower_components/ionrangeslider/js/ion.rangeSlider.min.js"></script>
		<script src="./scripts/time.js"></script>
		<script type="text/javascript">
			// load this before rodalytics.js
			var raTime = rodalyticsTime();
		</script>
		<script src="./scripts/rodalytics.js"></script>
		<script type="text/javascript">
			// load our helper functions
			// need to load this before loading stats.js
			var ra = rodalytics();
		</script>
		
		<script src="./scripts/waveform-layouts.js"></script>
		<script src="./scripts/audioEvents.js"></script>
		<script src="./scripts/stats.js"></script>
		<script src="./scripts/bubbleChart.js"></script>
		<script src="./scripts/trendChart.js"></script>
    <script src="./scripts/client.js"></script>

<!-- DEBUGGING: resources selected <?php 
     echo "using...".$_GET['id']; ?>-->

		<script type="text/javascript">
			// Configuration
      xhr = new XMLHttpRequest();
      xhr.open('GET', "https://madwort.co.uk/wp-content/plugins/improv-analysis-2.0/analysis_json.php?id=<?php echo $url_id; ?>");
      xhr.responseType = 'json';

      var audioUrl = "";
      var data = null;
			var videoUrl = "";
			var analysisName = "";
			var audioLength = 0;

      xhr.onload = function() {
        if (xhr.status == 200) {
          metadata = xhr.response.metadata;
          audioUrl = metadata.media_url;
          data = xhr.response.events;
    			videoUrl = metadata.video_url;
    			analysisName = metadata.title;
    			audioLength = metadata.duration;

          // Get everything going!
          client();

        } else { 
          console.log("JSON data load failed"); 
        }
      };
      xhr.send();


		</script>

		<link rel="stylesheet" href="bower_components/normalize.css/normalize.css" type="text/css" media="screen">
		<link rel="stylesheet" href="bower_components/ionrangeslider/css/ion.rangeSlider.css" type="text/css" media="screen">
		<link rel="stylesheet" href="bower_components/ionrangeslider/css/ion.rangeSlider.skinFlat.css" type="text/css" media="screen">

		<link rel="stylesheet" href="./style/rodalytics.css" type="text/css" media="screen">
		<!-- this is from oncletom's d3 waveform-live -->
		<link rel="stylesheet" href="./style/waveform-view.css" type="text/css" media="screen">
		
	</head>
	
	<body>
    <?php include('./improv-analytics.php'); ?>
	</body>
	
</html>