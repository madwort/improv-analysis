(function (w, d3) {
	"use strict";

   w["rodalytics"] = function(){

		var stream_names = ["", "Material", "Formal", "Interface", "Interaction"];
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
		
		// adds object value stream_name to every element in data
		function add_stream_name(data) {
			for (var i = 0; i < data.length; i++) {
				data[i].stream_name = stream_names[data[i].streamid];
			}
		}
			
		return {
			calculate_durations: calculate_durations,
			calculate_durations_per_stream: calculate_durations_per_stream,
			add_stream_name: add_stream_name,
			stream_names: stream_names,
			timeMinsSecs: timeMinsSecs
		}
	};
}(window, d3));