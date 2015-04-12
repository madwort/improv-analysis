(function (w, d3) {
	"use strict";

   w["rodalytics"] = function(raTime){

		var stream_names = ["", "Material", "Formal", "Interface", "Interaction"];
		var stream_colours = ["", "#fea18d","#93d1ff","#b7e695","#fefca2"];

		var myTime = raTime;
		
		// adds object value duration_all_streams to every element in data
	   function calculateDurations(data) {
			 var previous_time = null;
			 for (var i = 0; i < data.length; i++) {
				 // console.log(stream_times[data[i].streamid]);
				 if (previous_time != null) {
					 data[i].duration_all_streams = (myTime.timeFormatCSV.parse(data[i].time) - myTime.timeFormatCSV.parse(previous_time))/1000;
				 } else {
					 data[i].duration_all_streams = 0;
				 }
				 previous_time = data[i].time;
			 };
		};
	
		// adds object value duration_per_stream to every element in data
		function calculateDurationsPerStream(data) {
			// stream_ids are actually 1-4 so initializing 0-4 but won't use 0.
			 var stream_times = [null, null, null, null, null];
			 for (var i = 0; i < data.length; i++) {
				 // console.log(stream_times[data[i].streamid]);
				 if (stream_times[data[i].streamid] != null) {
					 data[i].duration_per_stream = 
					 	(myTime.timeFormatCSV.parse(data[i].time) - myTime.timeFormatCSV.parse(stream_times[data[i].streamid]))/1000;
				 } else {
					 data[i].duration_per_stream = 0;
				 }
				 stream_times[data[i].streamid] = data[i].time;
			 };
		};
		
		// Unlike the above functions, this does not enrich the data object in place
		// Instead, it adds the appropriate data to the chart
		// This is done to ensure duplicates graph correctly using dimple
		function calculate_regression(chart, data) {
  			var minTime = d3.min(data, function (d) {
  			 return d.time;
  		 	});
			
			data.map(function (d) {
				d.time_offset = (myTime.timeFormatCSV.parse(d.time)-myTime.timeFormatCSV.parse(minTime))/1000;
			});
			var regressionData = chart.data.map(function (d) {
				return [d.time_offset,d.duration];
			});

			var regression = window.regression('linear', regressionData );
			
			// chart.data can arrive unsorted by time_offset in some casse
			// therefore we have to check all time_offsets as our current graphing method
			// will error if we have two entries at the same time_offset
			// there's almost certainly a faster way to do this! 
			var previous_time_offsets = [];
			
			for (var j = 0; j < chart.data.length; j++) {
				if (previous_time_offsets.indexOf(chart.data[j].time_offset) == -1) { 
					chart.data[j].stream_regression = regression.points[j][1];
				} else {
					delete chart.data[j].stream_regression;
				} 
				previous_time_offsets.push(chart.data[j].time_offset);
			}
		}
		
		// adds object value stream_name to every element in data
		function add_stream_name(data) {
			for (var i = 0; i < data.length; i++) {
				data[i].stream_name = stream_names[data[i].streamid];
			}
		}
				
		function assignColours(chart) {
			for (var i = 1; i < stream_names.length; i++) {
				chart.assignColor(stream_names[i], stream_colours[i]);
			}
		}
		
		return {
			stream_names: stream_names,
			stream_colours: stream_colours,
			calculateDurations: calculateDurations,
			calculateDurationsPerStream: calculateDurationsPerStream,
			calculate_regression: calculate_regression,
			add_stream_name: add_stream_name,
			assignColours: assignColours
		}
	};
}(window, d3));