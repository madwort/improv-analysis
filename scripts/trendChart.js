(function (w, d3, ra) {
	"use strict";

	w["trendChart"] = function(){
		// chart2 stuff starts here

		 var svg2 = dimple.newSvg("#chartContainer2", 1100, 600);
		 var myChart2 = null;
		 var myData2 = null;
		 var mySeries2 = null;
		 var x,y = null;
		 var currentStream = null;
		 var lines = null;
		 
		 function init(data, lowerBound, upperBound) {
		  	 // data = dimple.filterData(data, "id", "3");
		 	 // console.log(data);

		    myData2 = data;

			 // possibly change csv file format using this
			 ra.calculateDurations(myData2);
			 ra.calculateDurationsPerStream(myData2);
			 myData2.map(function (d) {
			 	d.duration = d.duration_all_streams;
			 })
			 ra.add_stream_name(myData2);
			 // console.log(myData2);

			 myChart2 = new dimple.chart(svg2, myData2);
		    myChart2.setBounds(60, 30, 1000, 530);
		    x = myChart2.addTimeAxis("x", "time", raTime.timeFormatCSVString, raTime.timeFormatDisplayString);
			 // x.addOrderRule("Date");
			 x.timePeriod = d3.time.seconds;
			 x.timeInterval = 10;

			 x.overrideMin = raTime.zeroTime;
			 var maxTime = d3.max(myData2, function (d) {
				 return d.time;
			 })
			 x.overrideMax = raTime.timeFormatCSV.parse(maxTime);

			 y = myChart2.addMeasureAxis("y", "duration");
			 var maxDuration = d3.max(myData2, function (d) {
				 return d.duration_per_stream;
			 })
			 y.overrideMax = maxDuration;

			 // myChart2.addSeries("comment");
			 mySeries2 = myChart2.addSeries("stream_name", dimple.plot.bubble, [x,y]);
			 mySeries2.getTooltipText = function (series) {
				 var events = myChart2.data.filter(function (d) {
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

			 ra.calculate_regression(myChart2, myData2);

			 var y2 = myChart2.addMeasureAxis("y","stream_regression");
			 // set second axis to match first one
			 y2.overrideMax = maxDuration;

			 lines = myChart2.addSeries(null, dimple.plot.line, [x,y2]);

			 ra.assignColours(myChart2);

			 // myChart2.addLegend(140, 10, 360, 20, "left");
		    myChart2.draw();
			 // this is a bit of a hack, but I couldn't get this to work through dimple
			 lines.shapes.attr("stroke","#00282A");
			 lines.getTooltipText = function () {
				 return null;
			 };
			 ra.bubbleClickAudio(mySeries2,d3.select('audio'));

			 svg2.append("rect").attr("x",61).attr("y",30).attr("width",2).attr("height",530)
			 	.classed("playhead", true);

			 applyBoundsChart2(lowerBound, upperBound);

			d3.select("#btn2_cat_all").on("click", function() {
				currentStream = null;
			 	lines.shapes.attr("stroke","#00282A");
				applyBoundsChart2(lowerBound, upperBound);
			});

			function create_btn2(index) {
				return function() {
					currentStream = index;
				 	lines.shapes.attr("stroke",ra.stream_colours[index]);
					applyBoundsChart2(lowerBound, upperBound);
				}
			}

			// move this code out into function because of scoping issues in closures!
			for (var i = 1; i < 5; i++) {
				d3.select("#btn2_cat_"+i).on("click", create_btn2(i));				
			}
		
		}
		
		function applyBoundsChart2(lowerBound, upperBound) {
			// apply to chart 2

			if (currentStream !== null) {
				 myData2.map(function (d) {
				 	d.duration = d.duration_per_stream;
				 })
				myChart2.data = dimple.filterData(myData2, "streamid", currentStream.toString());
				ra.calculate_regression(myChart2, myData2);
			} else { 
				 myData2.map(function (d) {
				 	d.duration = d.duration_all_streams;
				 })
				myChart2.data = myData2;
			}

			myChart2.data = myChart2.data.filter(raTime.timeFormatCSVFilter(lowerBound,upperBound));

			ra.calculate_regression(myChart2, myData2);

			var x = myChart2.axes[0];
			// fix the scales on the graph
			x.overrideMin = raTime.timeFromSeconds(lowerBound);
			x.overrideMax = raTime.timeFromSeconds(upperBound);

		 	myChart2.draw(1000);
			// redo click handlers
			ra.bubbleClickAudio(mySeries2,d3.select('audio'));
		}
				
		return {
			init: init,
			applyBounds: applyBoundsChart2
		}

	}
	
}(window, d3, ra));
