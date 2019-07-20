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

				<div class="clear"></div>

        <div class="stats" style="display: none;">
          <h2>Asset files</h2>
          <div>
            <a href="<?php echo $data[1]; ?>">Audio file</a>,
            <a href="<?php echo $data[2]; ?>">CSV file</a>
          </div>
        </div>
		</div>
