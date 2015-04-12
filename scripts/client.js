(function (w, d3, ra) {
	"use strict";

	w["client"] = function(){
		// glob vars for everyone
		
		var leftBound = 0;
		var rightBound = audioLength;
		var playheadPos = leftBound;
		var playheadTimer = null;
		
		// setup audio element

		// the sooner we do this, the sooner we get the remote file data loaded
		// otherwise could just call applyBounds() now
		d3.select('audio').property("src",audioUrl);
		// setup event handlers
		var raAudioEvents = audioEvents(d3.select('audio'),d3.select("#play"),d3.select("#pause")); 

		// title
		
		var titleObject = $("#title");
		titleObject.html(titleObject.text()+" - \<a href=\""+videoUrl+"\" target=\"_blank\"\>"+analysisName+"\</a\>");

		// create rangeslider
		
		// min interval 12 seconds because less breaks our waveform display
		$("#range_slider").ionRangeSlider({
			type: 'double',
			min: leftBound,
			max: rightBound,
			from: leftBound,
			to: rightBound,
			min_interval: 12,
			prettify_enabled: true,
			prettify: function (num) {
				// suspect this is inconsistent between Safari / Firefox (1900/1970)
				// but as we're not comparing/displaying years we can get away with it?
				return raTime.timeFormatDisplay(new Date(num*1000));
			},
			onFinish: function (data) {
				leftBound = data.from;
				rightBound = data.to;
				applyBounds();
			}
		});


		// waveform display stuff starts here

		var size = { width: 1000, height: 149 };
		var formats = {
		  json: { "extension": "json", "mimeType": "application/json", "responseType": "json" },
		  binary: { "extension": "raw", "mimeType": "application/octet-stream", "responseType": "arraybuffer" }
		};
	
		var waveform_layout = null;
	
		var waveform = d3.select(".graph[data-format]");
		var waveformSvg = waveform.append("svg")
			.attr("width", size.width)
			.attr("height", size.height)
		waveformSvg.append("text").attr("x",0).attr("y",148).attr("id","waveform_position").text("00:00").style("visibility","hidden");


		waveform.attr("data-url",audioUrl);
		var format = formats[waveform.attr("data-format")];
		var config = {
		  event_identifier: ["load", format.extension].join("."),
		  format: format,
		  size: size,
		  layout: waveform.attr("data-layout"),
		  resample: true,
		  data_url: waveform.attr("data-url")
		};

		var layout = layouts(waveformSvg, config);
		waveform_layout = layout;

		var xhr = d3.xhr(config.data_url, format.mimeType);
		xhr.responseType(format.responseType);

		xhr.on(config.event_identifier, layout.init.bind(layout));
		xhr.get();

		waveformSvg.on("mousemove", function(){

			var timeInSeconds = waveform_layout.time(d3.mouse(this)[0])+parseInt(leftBound);
			var datecode = new Date(timeInSeconds*1000);

			var displayX = d3.mouse(this)[0]+5; 
			if (displayX > 960) { displayX = 960; }; 

			// var displayY = d3.mouse(this)[1];
			// if ( displayY < 15) { displayY = 15; };
			// if ( displayY > 148) { displayY = 148; };
			var displayY = 145;

			d3.select("#waveform_position").attr("x",displayX).attr("y",displayY).text(raTime.timeFormatDisplay(datecode));
		});

		waveformSvg.on("mouseover", function(){
			d3.select("#waveform_position").style("visibility","visible");
		});

		waveformSvg.on("mouseout", function(){
			d3.select("#waveform_position").style("visibility","hidden");
		});

		waveformSvg.on("click", function(){
			d3.select('audio').property("currentTime", waveform_layout.time(d3.mouse(this)[0])+parseInt(leftBound));
		});
	
	 	waveformSvg.append("rect")
		.attr("x",0).attr("y",0).attr("width",2).attr("height",150).classed("playhead", true); 

		// do chart 1
		var chart1 = null;
		
		d3.csv(dataUrl, function (data) {
			chart1 = bubbleChart();
			chart1.init(data,leftBound,rightBound);

			// also do stats at the same time!
			createStats(data);
		});

		// do chart 2
		var chart2 = null;

	 	d3.csv(dataUrl, function (data) {
			chart2 = trendChart();
			chart2.init(data,leftBound,rightBound);
	 	});

		// load stats module
		var rodstat = stats();
		
		function createStats(data) {
			rodstat.activitySummary(d3.select("#activitySummary"),data);
			rodstat.cooccurrence(d3.select("#cooccurrence"), data);
		  	rodstat.durationPerStream(d3.select("#durationStats"),data);
			rodstat.activityLog(d3.select("#activityLog"),data);
		}

		// common stuff starts here
		
		// params:
		// index - x pixel value to display
		// jump - whether to jump straight there or wait to catch-up
		function drawPlayhead(index, jump) {
			 if (!jump && index < d3.select(".playhead").attr("x")) {
				 playheadPos = index;
				 return 0;
			 } else {
				 // but don't draw if it's offscreen - this mostly affects charts with SVG offsets
				 if (index>=0) {
					// use this as starting point for timer increment
					 playheadPos = index;
					 if (index > 999) { 
						 // draw offscreen
						 index = 2000; 
					 }
					 // draw on waveform
					 d3.select(".graph svg .playhead").attr("x",Math.floor(index));
				 	// draw on charts, offset x because SVG is wider to contain chart's axis
					 d3.select("#chartContainer svg .playhead").attr("x",Math.floor(index)+61);
					 d3.select("#chartContainer2 svg .playhead").attr("x",Math.floor(index)+61);
				 }
			 }
		}

		// Update everything when we change the zoom of waveform & chart 1
		function applyBounds() {
			
			chart1.applyBounds(leftBound, rightBound);
			chart2.applyBounds(leftBound, rightBound);

			// apply to waveform display
			waveform_layout.setBounds(parseInt(leftBound),parseInt(rightBound));

			// apply to audio playback 
			var audioPlayer = d3.select('audio');
			raAudioEvents.audioPause();
			clearInterval(playheadTimer);
			audioPlayer.property("src", audioUrl+"#t="+leftBound+","+rightBound);
			// this also resets the playback time to zero, so do that too...
			drawPlayhead(0, true);
	
	
			// apply to stats
			// This is a bit inefficient - removing the whole table & re-rendering
			// but it is simple & expendient!
			d3.select('#activitySummary table').remove();
			d3.select('#cooccurrence table').remove();
			d3.select('#durationStats table').remove();
			d3.select('#activityLog table').remove();
			createStats(chart1.currentData());
	
		}


	};

}(window, d3, ra));