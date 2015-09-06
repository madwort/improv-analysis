(function (w, d3, ra, raTime) {
	"use strict";

	w["trendChart"] = function(){
		// chart2 stuff starts here

		 var svg = dimple.newSvg("#chartContainer2", 650, 600);
		 var myChart = null;
		 var myData = null;
		 var mySeries = null;
		 var x,y = null;
		 var currentStream = null;
		 var lines = null;
		 
		 function init(data, lowerBound, upperBound) {
		    myData = data;

			 ra.calculateDurations(myData);
			 ra.calculateDurationsPerStream(myData);
			 myData.map(function (d) {
			 	d.duration = d.duration_all_streams;
			 })
			 ra.add_stream_name(myData);
			 // console.log(myData);

			 myChart = new dimple.chart(svg, myData);
		    myChart.setBounds(60, 30, 550, 530);
		    x = myChart.addTimeAxis("x", "time", raTime.timeFormatCSVString, raTime.timeFormatDisplayString);
			 // x.addOrderRule("Date");
			 x.timePeriod = d3.time.seconds;
			 x.timeInterval = 10;

			 x.overrideMin = raTime.zeroTime;
			 var maxTime = d3.max(myData, function (d) {
				 return d.time;
			 })
			 x.overrideMax = raTime.timeFormatCSV.parse(maxTime);

			 y = myChart.addMeasureAxis("y", "duration");
			 var maxDuration = d3.max(myData, function (d) {
				 return d.duration_per_stream;
			 })
			 y.overrideMax = maxDuration;

			 // myChart.addSeries("comment");
			 mySeries = myChart.addSeries("stream_name", dimple.plot.bubble, [x,y]);
			 mySeries.getTooltipText = function (series) {
				 var events = myChart.data.filter(function (d) {
					 return (( d.time == raTime.timeFormatCSV(series.cx)) && 
						(d.stream_name == series.aggField[0]));
					})
					var tooltip = [ "Time: "+raTime.timeFormatDisplay(series.cx) ];

					events.forEach(function (myevent) {
						tooltip.push("Event type: "+myevent.stream_name);
						tooltip.push("Comment: "+myevent.comment);
					});
					return tooltip;
				};

			 ra.calculate_regression(myChart, myData);

			 var y2 = myChart.addMeasureAxis("y","stream_regression");
			 // set second axis to match first one
			 y2.overrideMax = maxDuration;

			 lines = myChart.addSeries(null, dimple.plot.line, [x,y2]);

			 ra.assignColours(myChart);

		    myChart.draw();
			 applyBounds(lowerBound, upperBound);

			 // this is a bit of a hack, but I couldn't get this to work through dimple
			 lines.shapes.attr("stroke","#00282A");
			 lines.getTooltipText = function () {
				 return null;
			 };

			 svg.append("rect").attr("x",61).attr("y",30).attr("width",2).attr("height",530)
			 	.classed("playhead", true);


			d3.select("#btn2_cat_all").on("click", function() {
				currentStream = null;
			 	lines.shapes.attr("stroke","#00282A");
				// access leftBound & rightBound via the range slider...
				applyBounds($('#range_slider').data().from, $('#range_slider').data().to);
			});

			function create_btn2(index) {
				return function() {
					currentStream = index;
				 	lines.shapes.attr("stroke",ra.stream_colours[index]);
					// access leftBound & rightBound via the range slider...
					applyBounds($('#range_slider').data().from, $('#range_slider').data().to);
				}
			}

			// move this code out into function because of scoping issues in closures!
			for (var i = 1; i < 5; i++) {
				d3.select("#btn2_cat_"+i).on("click", create_btn2(i));				
			}
		
		}
		
		function applyBounds(lowerBound, upperBound) {
			if (currentStream !== null) {
				 myData.map(function (d) {
				 	d.duration = d.duration_per_stream;
				 })
				myChart.data = dimple.filterData(myData, "streamid", currentStream.toString());
				ra.calculate_regression(myChart, myData);
			} else { 
				 myData.map(function (d) {
				 	d.duration = d.duration_all_streams;
				 })
				myChart.data = myData;
			}

			myChart.data = myChart.data.filter(raTime.timeFormatCSVFilter(lowerBound,upperBound));

			ra.calculate_regression(myChart, myData);

			var x = myChart.axes[0];
			// fix the scales on the graph
			x.overrideMin = raTime.timeFromSeconds(lowerBound);
			x.overrideMax = raTime.timeFromSeconds(upperBound);

		 	myChart.draw(550);
			// redo click handlers
			ra.bubbleClickAudio(mySeries,d3.select('audio'));
		}
				
		return {
			init: init,
			applyBounds: applyBounds
		}

	}
	
}(window, d3, ra, window.rodalyticsTime));
