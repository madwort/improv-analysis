"use strict";

(function(w, ra){
   w["stats"] = function(){

	// assumes the data is ordered firstly by time 
	function cooccurrence(element, data) {
		 // We're translating streamids 1-4 to be 0-3 for our purposes!
		 // Remember this when rendering!!!
		 // stream_cooccurrence[from][to]
		 var stream_cooccurrence = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
		 // assume at least one piece of data!
		 var previous_streamid = (data[0].streamid-1);
		 var this_streamid = -1;
		 
		 data = data.sort(raTime.timeFormatCSVComparison);
		 for (var i = 1; i < data.length; i++) {
			 this_streamid = (data[i].streamid-1);
			 stream_cooccurrence[previous_streamid][this_streamid]++;
			 previous_streamid = this_streamid;
		 }
	 
		 // console.log(stream_cooccurrence);
	 
		 // Output the data that we've calculated
		 // Should really use a proper template system for this...
		 var mytable = element.append("table");
		 var heading_row = mytable.append("tr");
		 heading_row.append("th").text("Stream").classed("All", true);
		 for (var i = 0; i < 4; i++) {
			 var label = heading_row.append("th");
			 label.text(ra.stream_names[(i+1)]);
			 label.classed(ra.stream_names[(i+1)], "true");
		 };
	
		 for (var i = 0; i < stream_cooccurrence.length; i++) {
			 var myrow = mytable.append("tr");
			 var label = myrow.append("td");
			 label.text(ra.stream_names[i+1]);
			 label.classed(ra.stream_names[i+1], "true");
			 for (var j = 0; j < stream_cooccurrence[i].length; j++) {
				 myrow.append("td").text(stream_cooccurrence[i][j]);
			 }
		 }
	}

	function activitySummary(element,data) {
		 var mytable = element.append("table");
		 // could refactor & do forEach on streamname list?
		 var heading_row = mytable.append("tr");
		 heading_row.append("th").text("Stream").classed("All", true);
		 heading_row.append("th").text("Instances");

		 for (var i = 1; i < 5; i++) {
			 var myrow = mytable.append("tr");
			 var label = myrow.append("td");
			 label.text(ra.stream_names[i]);
			 label.classed(ra.stream_names[i], "true");

			 // filter is string not int
			 var stream = dimple.filterData(data, "streamid", ""+i);
			 myrow.append("td").text(stream.length);
		 }
	}

	function durationPerStream(element, data) {
		 ra.calculateDurationsPerStream(data);
 
		 var mytable = element.append("table");
		 // could refactor & do forEach on streamname list?
		 var heading_row = mytable.append("tr");
		 heading_row.append("th").text("Stream").classed("All", true);
		 heading_row.append("th").text("Min");
		 heading_row.append("th").text("Median");
		 heading_row.append("th").text("Mean");
		 heading_row.append("th").text("Std Dev");
		 heading_row.append("th").text("Max");

		 var three_sf = d3.format(".3g");

		 for (var i = 1; i < 5; i++) {
			 var myrow = mytable.append("tr");
			 var label = myrow.append("td");
			 label.text(ra.stream_names[i]);
			 label.classed(ra.stream_names[i], "true");

			 // filter is string not int
			 var stream = dimple.filterData(data, "streamid", ""+i);
			 var get_duration_per_stream = function (d) {
				 return d.duration_per_stream;
			 };
	 
			 myrow.append("td").text(three_sf(d3.min(stream, get_duration_per_stream)));
			 myrow.append("td").text(three_sf(d3.median(stream, get_duration_per_stream)));
			 myrow.append("td").text(three_sf(d3.mean(stream, get_duration_per_stream)));
			 myrow.append("td").text(three_sf(d3.deviation(stream, get_duration_per_stream)));
			 myrow.append("td").text(three_sf(d3.max(stream, get_duration_per_stream)));

		 }
	}
	
	function activityLog(element,data) {
		 var mytable = element.append("table");
		 var heading_row = mytable.append("tr");
		 heading_row.append("th").text("Time");
		 heading_row.append("th").text("Stream");
		 heading_row.append("th").text("Comment");

		 data.forEach(function(d) {
			 var myrow = mytable.append("tr");
			 myrow.append("td").text(d.time).classed("time", "true");
			 myrow.append("td").text(d.stream_name).classed(ra.stream_names[d.streamid], "true");
			 myrow.append("td").text(d.comment).classed("comment", "true");
		 })
	}
	
	
	return {
		cooccurrence: cooccurrence,
		activitySummary: activitySummary,
		durationPerStream: durationPerStream,
		activityLog: activityLog
	}
  };
})(window, ra);