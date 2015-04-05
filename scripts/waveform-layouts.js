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
      (config.data_url && !config.programme)
        ? WaveformData.builders.webaudio(xhr.response, onDataProcessed)
        : onDataProcessed(WaveformData.create(xhr));

      // Processing parsed data
      function onDataProcessed(data){
        graph.append("path");
        waveform_data = data;

        //clamping internal data
		  // if we do this resample, we can't zoom in any further
        // if (config.resample){
        //   waveform_data = waveform_data.resample({width: config.size.width})
        // }
        // else{
          waveform_data.offset(offsetX, config.size.width);
        // }
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
		  // console.log(values.max.length);
        x.domain([0, values.max.length]).rangeRound([0, config.size.width]);
        y.domain([d3.min(values.min), d3.max(values.max)]).rangeRound([offsetY, -offsetY]);

        renderer(values);
		  
		  // redraw it showing the whole waveform
		  setBounds(0,waveform_data.duration);

      });
    }

    function navigate(offset, scale){
      var data = waveform_data;
      var renderer = this.renderers[config.layout];

      if (scale > waveform_data.adapter.scale){
        data = waveform_data.resample({scale: scale});
      }

      data.offset(offset, config.size.width);

      var values = {
        min: data.min,
        max: data.max
      };

      renderer(values);
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

	 function time(index) {
		 return current_waveform_data.time(index);
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
      navigate: navigate,
      nextOffset: function nextOffset(){
        offsetX = Math.floor(offsetX + config.size.width / 2);

        if (offsetX + config.size.width > waveform_data.adapter.length){
          offsetX = waveform_data.adapter.length - config.size.width;
        }

        if (config.size.width > waveform_data.adapter.length){
          offsetX = 0;
        }

        this.navigate(offsetX, scale);
      },
      previousOffset: function previousOffset(){
        offsetX = Math.floor(offsetX - config.size.width / 2);

        if (offsetX < 0){
          offsetX = 0;
        }

        this.navigate(offsetX, scale);
      },
      init: init,
      zoomIn: function zoomIn(){
        scale = Math.floor(scale / 2);
        offsetX = Math.floor(offsetX / 2);

        if (scale < waveform_data.adapter.scale){
          scale = waveform_data.adapter.scale;
        }

        this.navigate(offsetX, scale);
      },
      zoomOut: function zoomOut(){
        scale = Math.floor(scale * 2);
        offsetX = Math.floor(offsetX * 2);

        this.navigate(offsetX, scale);
      },
		setBounds: setBounds,
		time: time
    };
  };
})(window, d3);