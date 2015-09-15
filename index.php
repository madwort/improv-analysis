<!doctype html>
<html>
	<head>
		<meta charset="UTF-8">
	   <script src="./bower_components/d3/d3.min.js"></script>
	   <script src="./bower_components/dimple/dist/dimple.v2.1.2.min.js"></script>
	   <script src="./bower_components/regression-js/build/regression.min.js"></script>
		<script src="./bower_components/waveform-data/dist/waveform-data.js"></script>
		
		<script src="./bower_components/jquery/dist/jquery.min.js"></script>
		<script src="./bower_components/ionrangeslider/js/ion.rangeSlider.min.js"></script>

		<script type="text/javascript">
			// Configuration
			<?php 
		switch ($_GET['q']) {
			
			case '1a':
			?>
			var audioUrl = "./Everything 1a.mp3";
			var dataUrl = "./Everything 1a.csv";
			var videoUrl = "https://www.youtube.com/watch?v=i3tYa2N9fm4";
			var analysisName = "Constanzo - Everything at once. (1a)";
			var audioLength = 209.629;
			<?php
				break;
			
			case '1b': 
			?>
		    var audioUrl = "./Everything 1b.mp3";
		 	var dataUrl = "./Everything 1b.csv";
			var videoUrl = "https://www.youtube.com/watch?v=1FKE3D7swWY";
			var analysisName = "Constanzo - Everything at once. (1b)";
			var audioLength = 165.887;
			<?php 
				break;
					
			case '1c': 
			?>
			var audioUrl = "./Everything 1c.mp3";
			var dataUrl = "./Everything 1c.csv";
			var videoUrl = "https://www.youtube.com/watch?v=bQf1lFEdr9w";
			var analysisName = "Constanzo - Everything at once. (1c)";
			var audioLength = 162.456;
			<?php 
				break;
				
			case 'pa1': 
			?>
			var audioUrl = "./PA 1.mp3";
			var dataUrl = "./PA 1.csv";
			var videoUrl = "#";
			var analysisName = "Tremblay - Bass + Laptop improvisation (1)";
			var audioLength = 363.408;
			<?php 
				break;
				
			case 'pa2': 
			?>
			var audioUrl = "./PA 2.mp3";
			var dataUrl = "./PA 2.csv";
			var videoUrl = "#";
			var analysisName = "Tremblay - Bass + Laptop improvisation (2)";
			var audioLength = 228.048;
			<?php 
				break;
				
			case 'anton': 
			?>
			var audioUrl = "./anton.mp3";
			var dataUrl = "./anton.csv";
			var videoUrl = "#";
			var analysisName = "Hunter - Guitar + Pedals improvisation";
			var audioLength = 224.760;
			<?php 
				break;
				
			case 'ucb': 
			?>
			var audioUrl = "./ucb.mp3";
			var dataUrl = "./ucb.csv";
			var videoUrl = "https://youtu.be/1otcGrYVSag?t=22m55s";
			var analysisName = "ASSSSCAT! - Buzzards";
			var audioLength = 156.709;
			<?php 
				break;
				
			case 'feldman': 
			?>
			var audioUrl = "./feldman.mp3";
			var dataUrl = "./feldman.csv";
			var videoUrl = "https://www.youtube.com/watch?v=bQf1lFEdr9w";
			var analysisName = "Feldman - Triadic Memories";
			var audioLength = 1553.914;
			<?php 
				break;	
				
			case 'thf1': 
			?>
			var audioUrl = "./thf1.mp3";
			var dataUrl = "./thf1.csv";
			var videoUrl = "https://www.youtube.com/watch?v=qTvBkYGRqXk";
			var analysisName = "THF Drenching - Invention of Duct Tape";
			var audioLength = 399.649;
			<?php 
				break;	
				
			case 'thf2': 
			?>
			var audioUrl = "./thf2.mp3";
			var dataUrl = "./thf2.csv";
			var videoUrl = "https://www.youtube.com/watch?v=gxVBVGqByEw";
			var analysisName = "THF Drenching - Skimming of Black Milk";
			var audioLength = 339.464;
			<?php 
				break;	
				
			case 'otto1': 
			?>
			var audioUrl = "./otto1.mp3";
			var dataUrl = "./otto1.csv";
			var videoUrl = "https://www.youtube.com/watch?v=DfLe41_Ed9g";
			var analysisName = "Willberg - all weather";
			var audioLength = 206.623;
			<?php 
				break;	
			
			default:
			?>
			var audioUrl = "./Everything 1a.mp3";
			var dataUrl = "./Everything 1a.csv";
			var videoUrl = "#";
			var analysisName = "Everything. Everything at once. Once. (1a)";
			var audioLength = 209.629;
			<?php
				break;
				
		} ?>
		</script>

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

		<link rel="stylesheet" href="bower_components/normalize.css/normalize.css" type="text/css" media="screen">
		<link rel="stylesheet" href="bower_components/ionrangeslider/css/ion.rangeSlider.css" type="text/css" media="screen">
		<link rel="stylesheet" href="bower_components/ionrangeslider/css/ion.rangeSlider.skinFlat.css" type="text/css" media="screen">

		<link rel="stylesheet" href="./style/rodalytics.css" type="text/css" media="screen">
		<!-- this is from oncletom's d3 waveform-live -->
		<link rel="stylesheet" href="./style/waveform-view.css" type="text/css" media="screen">
		
	</head>
	
	<body onload="client();">
		<div id="topbar">
			<div id="wrapper">
				<span id="title">Improv Analysis</span>
				
				<div class="sliderContainer">
					<input type="text" name="range_slider" value="" id="range_slider">
				</div>

				<span id="audioPlayer">
					<audio src=""></audio>Use keyboard shortcuts to control playback: , &amp; . to skip ±10sec, p to play/pause, or use these buttons: 
					<button id="play" class="playPause">Play</button><button id="pause" class="playPause highlight">Pause</button>
				</span>
			</div>
		</div>

		<div id="content">
				<!-- waveform -->
				<div id="waveform">
					<div class="graph" id="waveform-graph" data-format="binary" data-url="" data-layout="area"></div>
				</div>
		
				<div class="clear"></div>
		
				<!-- chart 1 -->
				<div id="chartContainer" class="chartContainer">
				</div>
				<div id="chartControls" class="chartControls">
					<input type="button" name="btn_no_cat" value="No duration" id="btn_no_cat" class="chart1btn enabled">
					<input type="button" name="btn_all_cat" value="Duration all cats." id="btn_all_cat" class="chart1btn">
					<input type="button" name="btn_same_cat" value="Duration same cat." id="btn_same_cat" class="chart1btn">
				</div>
				
				<div class="clear"></div>
		
				<!-- chart2  -->
				<div id="chartControls2" class="">
					<span class="chartTitle" id="trendChart">Trend chart</span>
					<input type="button" name="btn2_cat_all" value="All streams" id="btn2_cat_all" class="All streamSelection">
					<input type="button" name="btn2_cat_1" value="Material" id="btn2_cat_1" class="Material streamSelection">
					<input type="button" name="btn2_cat_2" value="Formal" id="btn2_cat_2" class="Formal streamSelection">
					<input type="button" name="btn2_cat_3" value="Interface" id="btn2_cat_3" class="Interface streamSelection">
					<input type="button" name="btn2_cat_4" value="Interaction" id="btn2_cat_4" class="Interaction streamSelection"> 
				</div>
				
				<div class="clear"></div>
				
				<div id="chartContainer2" class="chartContainer">
				</div>

				<div class="clear"></div>

				<!-- stats -->
				<div class="stats">
					<h2>Activity Summary</h2>
					<div id="activitySummary"></div>
				</div>		
				
				<div class="stats">
					<h2>Transition Matrix</h2>
					<div id="transitionMatrix"></div>		
				</div>
							
				<div class="stats">
					<h2>Duration stats per stream</h2>
					<div id="durationStats"></div>
				</div>
				
				<div class="clear"></div>
				
				<div class="stats">
					<h2>Activity log</h2>
					<div id="activityLog"></div>
				</div>
		</div>
	</body>
	
</html>