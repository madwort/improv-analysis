// based on demo by oncletom http://bl.ocks.org/oncletom/5822102  
// developed by madwort
"use strict";

(function(w, d3){
  w["layouts"] = function(graph, config){
    var x = d3.scale.linear();
    var y = d3.scale.linear();
    var offsetY = config.size.height / 2;
    var offsetX = 0;
    var scale = null;
    var waveform_data;
	 var myRenderer = null;
	 var current_waveform_data;

    function setup(xhr, done){
      var arrayBufferAdapter = WaveformData.adapters.arraybuffer;

      // Asynchronous parsing
		WaveformData.builders.webaudio(xhr.response, onDataProcessed);

      // Processing parsed data
      function onDataProcessed(data){
        graph.append("path");
        waveform_data = data;

		  waveform_data.offset(offsetX, config.size.width);

        done(waveform_data);
      }
    }

    function init(xhr){
      var renderer = this.renderers[config.layout];
		myRenderer = renderer;

      setup(xhr, function onSetupDone(waveform_data){
        scale = waveform_data.adapter.scale;

        var values = {
          min: waveform_data.min,
          max: waveform_data.max
        };

        //scaling
        x.domain([0, values.max.length]).rangeRound([0, config.size.width]);
        y.domain([d3.min(values.min), d3.max(values.max)]).rangeRound([offsetY, -offsetY]);

        renderer(values);
		  
		  // redraw it showing the whole waveform
		  setBounds(0,waveform_data.duration);

      });
    }
	 
	 // bounds are in seconds
	 function setBounds(leftBound,rightBound) {
		 // check these values!
		 leftBound = parseInt(leftBound);
		 rightBound = parseInt(rightBound);
		 
		 // console.log("bounds",leftBound,rightBound);
       
		 var renderer = myRenderer;
		 var newScale = ((rightBound-leftBound)*waveform_data.adapter.sample_rate/config.size.width);
		 // console.log("new scale",newScale);
		 current_waveform_data = waveform_data.resample({scale: newScale});

		 var leftOffset = current_waveform_data.at_time(leftBound);
		 var rightOffset = current_waveform_data.at_time(rightBound);
		 // console.log("Offsets displayed", leftOffset, rightOffset);

		 current_waveform_data.offset(leftOffset, rightOffset);

        var values = {
          min: current_waveform_data.min,
          max: current_waveform_data.max
        };
		  
        y.domain([d3.min(values.min), d3.max(values.max)]).rangeRound([offsetY, -offsetY]);
		  
        renderer(values);
		 
	 }

	 // might want to remove all these wrapper functions & replace with ref to object?
	 function time(index) {
		 return current_waveform_data.time(index);
	 }

	 function timePerPixel() {
		 return current_waveform_data.seconds_per_pixel;
	 }

	 // param is seconds, returns pixel index
	 function indexOfTime(time) {
		 // corrects for leftBound when viewing a portion of the waveform
		 // hacky way to get the bound though!
		 var leftBound = $('#range_slider').data().from;
		 return current_waveform_data.at_time(time-leftBound);
	 }

    /**
     * Displays data as area
     *
     * @param {d3.xhr} xhr
     */
    function areaLayoutRenderer(values){
      var area = d3.svg.area()
        .x(function(d, i){ return x(i) })
        .y0(function(d, i){ return y(values.min[i]) })
        .y1(function(d, i){ return y(d) });

      graph.select("path")
        .datum(values.max)
        .attr("transform", function(){ return "translate(0, "+offsetY+")"; })
        .attr("d", area);
    }

    /**
     * Displays data as barchart
     *
     * @param {d3.xhr} xhr
     */
    function barchartLayoutRenderer(values){
      graph.selectAll("rect")
        .data(values.max)
        .enter()
          .append("rect")
          .attr("x", function(d, i){ return x(i) })
          .attr("y", function(){ return (config.size.height / 2) })
          .attr("width", 1)
          .attr("height", function(d, i) {
            return Math.abs( y(d) + y(Math.abs(values.min[i])) );
          })
          .attr("transform", function(d){ return "translate(0, -"+Math.abs(y(d))+")"; });
    }

    return {
      renderers: {
        area: areaLayoutRenderer,
        barchart: barchartLayoutRenderer
      },
      init: init,
		setBounds: setBounds,
		time: time,
		timePerPixel: timePerPixel,
		indexOfTime: indexOfTime
    };
  };
})(window, d3);