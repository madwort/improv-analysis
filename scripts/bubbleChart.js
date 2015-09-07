(function (w, d3, ra, raTime) {
	"use strict";

	ra["bubbleChart"] = function(container){
		// chart1 stuff starts here

		var svg = d3.select(container)
                .append('svg')
                .attr("width", 650)
                .attr("height", 500);
		var myChart = null;
		var myData = null;
		var mySeries = null;
		var z = null;
		 
		function init(data, leftBound, rightBound) {
			myData = data;

			ra.calculateDurations(myData);
			ra.calculateDurationsPerStream(myData);
			myData.map(function (d) {
				d.duration = 1;
			})
			ra.add_stream_name(myData);

			myChart = new dimple.chart(svg, myData);
			myChart.setBounds(60, 0, 550, 430);
			var x = myChart.addTimeAxis("x", "time", raTime.timeFormatCSVString, raTime.timeFormatDisplayString);
			x.timePeriod = d3.time.seconds;
			x.timeInterval = 15;
			x.overrideMin = raTime.zeroTime;

		   var y = myChart.addCategoryAxis("y", "stream_name");
			y.addOrderRule(ra.stream_names, true);

			z = myChart.addMeasureAxis("z", "duration");
			// default is equally sized bubbles
			z.overrideMin = 0;
			z.overrideMax = 10;

			mySeries = myChart.addSeries("stream_name");

			// replace the tooltip with our custom handler
			// main job is to correctly get simultaneous events & 
			// to enrich display with comments without causing recolouring
			mySeries.getTooltipText = function (series) {
				var events = myData.filter(function (d) {
					return (( d.time == raTime.timeFormatCSV(series.cx)) && 
						(d.stream_name == series.cy));
					})
					var tooltip = [ "Time: "+raTime.timeFormatDisplay(series.cx) ];

					events.forEach(function (myevent) {
						tooltip.push("Event type: "+myevent.stream_name);
						tooltip.push("Comment: "+myevent.comment);
					});
					return tooltip;
				};

			ra.assignColours(myChart);
	 
		   myChart.draw();
			applyBounds(leftBound, rightBound);

			 svg.append("rect").attr("x",61).attr("y",0).attr("width",2).attr("height",430)
			 	.classed("playhead", true);

			 function createChart1Btn(selector,min,max,durationFunction) {
				d3.select(container).select(selector).on("click", function() {
					z.overrideMin = min;
					z.overrideMax = max;
					myData.map(durationFunction);
				 	d3.select(container).selectAll('.chart1btn').classed("enabled", false);
					d3.select(container).select(selector).classed("enabled",true);
					myChart.draw(550);
					// don't need to redo the click handlers because bounds don't change 
				});

			 }
			 createChart1Btn("#btn_no_cat",0,10,function (d) { d.duration = 1; });
			 createChart1Btn("#btn_all_cat",null,null,function (d) { d.duration = d.duration_all_streams; });
			 createChart1Btn("#btn_same_cat",null,null,function (d) { d.duration = d.duration_per_stream; });
		} // init
		
		function applyBounds(leftBound, rightBound) {
			myChart.data = myData.filter(raTime.timeFormatCSVFilter(leftBound,rightBound));

			var x = myChart.axes[0];
			// fix the scales on the graph
			x.overrideMin = raTime.timeFromSeconds(leftBound);
			x.overrideMax = raTime.timeFromSeconds(rightBound);

		 	myChart.draw(550);
			// redo click handlers
			ra.bubbleClickAudio(mySeries,d3.select(container).select('audio'));
		}
		
		function currentData() {
			return myChart.data;
		} 
		
 		return {
 			init: init,
 			applyBounds: applyBounds,
			currentData: currentData
 		}

 	}
	
 }(window, d3, window.rodalytics, window.rodalyticsTime));