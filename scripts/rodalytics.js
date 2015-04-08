(function (w, d3) {
	"use strict";

   w["rodalytics"] = function(){

		var stream_names = ["", "Material", "Formal", "Interface", "Interaction"];
		// this is the time format in the CSV files
		var timeFormat = d3.time.format("%M:%S:%L");
		// this is the time format we often want to output
		// perhaps we should use this format in the CSV in future?
		var timeMinsSecs = d3.time.format("%M:%S");
		
		// adds object value duration_all_streams to every element in data
	   function calculate_durations(data) {
			 var previous_time = null;
			 var format = d3.time.format("%M:%S:%L");
			 for (var i = 0; i < data.length; i++) {
				 // console.log(stream_times[data[i].streamid]);
				 if (previous_time != null) {
					 data[i].duration_all_streams = (format.parse(data[i].time) - format.parse(previous_time))/1000;
				 } else {
					 data[i].duration_all_streams = 0;
				 }
				 previous_time = data[i].time;
			 };
		};
	
		// adds object value duration_per_stream to every element in data
		function calculate_durations_per_stream(data) {
			// stream_ids are actually 1-4 so initializing 0-4 but won't use 0.
			 var stream_times = [null, null, null, null, null];
			 var format = d3.time.format("%M:%S:%L");
			 for (var i = 0; i < data.length; i++) {
				 // console.log(stream_times[data[i].streamid]);
				 if (stream_times[data[i].streamid] != null) {
					 data[i].duration_per_stream = 
					 	(format.parse(data[i].time) - format.parse(stream_times[data[i].streamid]))/1000;
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
			data.map(function (d) {
				d.time_offset = (timeFormat.parse(d.time)-timeFormat.parse(minTime))/1000;
			});
			var regressionData = chart.data.map(function (d) {
				return [d.time_offset,d.duration_per_stream];
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
					
		return {
			stream_names: stream_names,
			timeMinsSecs: timeMinsSecs,
			calculate_durations: calculate_durations,
			calculate_durations_per_stream: calculate_durations_per_stream,
			calculate_regression: calculate_regression,
			add_stream_name: add_stream_name
		}
	};
}(window, d3));