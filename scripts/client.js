(function (w, $, d3, ra, raTime) {
  "use strict";

  w["client"] = function(parentName, config){
    // glob vars for everyone

    var leftBound = 0;
    var rightBound = config.audioLength;

    var playheadPos = leftBound;
    var playheadTimer = null;
    var waveform_layout = null;

    var parent = d3.select(parentName);
    
    // setup audio element

    // the sooner we do this, the sooner we get the remote file data loaded
    // otherwise could just call applyBounds() now
    parent.select('audio').property("src",config.audioUrl);
    // setup event handlers
    var raAudioEvents = audioEvents(parent.select('audio'),parent.select("#play"),parent.select("#pause")); 

    // title
    
    var titleObject = parent.select('#title');
    titleObject.html("\<a href=\""+config.videoUrl+"\" target=\"_blank\"\>"+config.analysisName+"\</a\>");

    // create rangeslider
    
    // TODO: remove jQuery!
    // min interval 12 seconds because less breaks our waveform display
    $(parentName+" #range_slider").ionRangeSlider({
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
        return raTime.timeFormatDisplay(new Date(num*550));
      },
      onFinish: function (data) {
        leftBound = data.from;
        rightBound = data.to;
        applyBounds();
      }
    });


    // waveform display stuff starts here
    parent.select(".graph[data-format]").each(function(d, i){
      var waveform = d3.select(this);
      var size = { width: 550, height: 149 };
      var formats = {
        json: { 
          "extension": "json", 
          "mimeType": "application/json", 
          "responseType": "json" 
        },
        binary: { 
          "extension": "raw", 
          "mimeType": "application/octet-stream", 
          "responseType": "arraybuffer" 
        }
      };
  
      var waveformSvg = waveform.append("svg")
        .attr("width", size.width)
        .attr("height", size.height)
      waveformSvg.append("text")
        .attr("x",0)
        .attr("y",148)
        .attr("id","waveform_position")
        .text("00:00")
        .style("visibility","hidden");

      waveform.attr("data-url",config.audioUrl);
      var format = formats[waveform.attr("data-format")];
      var audio_config = {
        event_identifier: ["load", format.extension].join("."),
        format: format,
        size: size,
        layout: waveform.attr("data-layout"),
        resample: true,
        data_url: waveform.attr("data-url")
      };

      var layout = layouts(waveformSvg, audio_config);
      waveform_layout = layout;

      var xhr = d3.xhr(audio_config.data_url, format.mimeType);
      xhr.responseType(format.responseType);

      xhr.on(audio_config.event_identifier, layout.init.bind(layout));
      xhr.get();

      waveformSvg.on("mousemove", function(){

        var timeInSeconds = waveform_layout.time(d3.mouse(this)[0])+parseInt(leftBound);
        var datecode = new Date(timeInSeconds*550);

        var displayX = d3.mouse(this)[0]+5; 
        if (displayX > 960) { displayX = 960; }; 

        // var displayY = d3.mouse(this)[1];
        // if ( displayY < 15) { displayY = 15; };
        // if ( displayY > 148) { displayY = 148; };
        var displayY = 145;

        parent.select("#waveform_position").attr("x",displayX).attr("y",displayY).text(raTime.timeFormatDisplay(datecode));
      });

      waveformSvg.on("mouseover", function(){
        parent.select("#waveform_position").style("visibility","visible");
      });

      waveformSvg.on("mouseout", function(){
        parent.select("#waveform_position").style("visibility","hidden");
      });

      waveformSvg.on("click", function(){
        parent.select('audio').property("currentTime", waveform_layout.time(d3.mouse(this)[0])+parseInt(leftBound));
      });
  
       waveformSvg.append("rect")
      .attr("x",0).attr("y",0).attr("width",2).attr("height",150).classed("playhead", true); 
      
    });

    // do chart 1
    var chart1 = null;

    parent.select("#chartContainer").each(function(d, i){
      // retain this reference for the inner function
      var container = this;

      d3.csv(config.dataUrl, function (data) {
        chart1 = ra.bubbleChart(container);
        chart1.init(data,leftBound,rightBound);
      });

    });
    
    // do chart 2
    var chart2 = null;

    parent.select("#chartContainer2").each(function(d, i){
      // retain this reference for the inner function
      var container = this;
      
      d3.csv(config.dataUrl, function (data) {
       chart2 = ra.trendChart(container);
       chart2.init(data,leftBound,rightBound);
      });
    });

    parent.select(".stats").each(function(d, i){
      // retain this reference for the inner function
      var container = this;

      d3.csv(config.dataUrl, function (data) {
        createStats(data);
      });

    });

    function createStats(data) {
      ra.stats.activitySummary(parent.select("#activitySummary"),ra.activitySummary(data));
      ra.stats.cooccurrence(parent.select("#cooccurrence"), ra.cooccurrence(data));
      ra.stats.durationPerStream(parent.select("#durationStats"),ra.durationPerStream(data));
      ra.stats.activityLog(parent.select("#activityLog"),data);
    }

    // common stuff starts here
    
    // params:
    // index - x pixel value to display
    // jump - whether to jump straight there or wait to catch-up
    function drawPlayhead(index, jump) {
       if (!jump && index < parent.select(".playhead").attr("x")) {
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
           parent.select(".graph svg .playhead").attr("x",Math.floor(index));
           // draw on charts, offset x because SVG is wider to contain chart's axis
           parent.select("#chartContainer svg .playhead").attr("x",Math.floor(index)+61);
           parent.select("#chartContainer2 svg .playhead").attr("x",Math.floor(index)+61);
         }
       }
    }

    parent.select('audio').on("play", function () {
      // We don't need to maintain our state in playheadPos, we can use
      // something like this & get it directly from the attribute instead...
      // console.log(parent.select(".playhead").attr("x"));
      playheadTimer = setInterval(function() { 
        playheadPos++;
        drawPlayhead(playheadPos, false);
      }, waveform_layout.timePerPixel()*550);
    })

    parent.select('audio').on("pause", function () {
      clearInterval(playheadTimer);
    })
 
     parent.select('audio').on("seeked", function () {
       drawPlayhead(waveform_layout.indexOfTime(this.currentTime-leftBound), true);
     })

     parent.select('audio').on("timeupdate", function () {
       drawPlayhead(waveform_layout.indexOfTime(this.currentTime-leftBound), false);
       // audio element might automatically stop if it has url set correctly
       // but seemingly not always, so ensure in JS
       if (this.currentTime > rightBound) {
         raAudioEvents.audioPause();
       }
     })

    // Update everything when we change the zoom of waveform & chart 1
    function applyBounds() {
      
      chart1.applyBounds(leftBound, rightBound);
      chart2.applyBounds(leftBound, rightBound);

      // apply to waveform display
      waveform_layout.setBounds(parseInt(leftBound),parseInt(rightBound));

      // apply to audio playback 
      var audioPlayer = parent.select('audio');
      raAudioEvents.audioPause();
      clearInterval(playheadTimer);
      audioPlayer.property("src", config.audioUrl+"#t="+leftBound+","+rightBound);
      // this also resets the playback time to zero, so do that too...
      drawPlayhead(0, true);

      // apply to stats
      // This is a bit inefficient - removing the whole table & re-rendering
      // but it is simple & expendient!
      parent.select('#activitySummary table').remove();
      parent.select('#cooccurrence table').remove();
      parent.select('#durationStats table').remove();
      parent.select('#activityLog table').remove();
      createStats(chart1.currentData());
  
    }

    // Final step: apply any bounds as specified in the config
    if (typeof config.leftBound != 'undefined') {
      leftBound = config.leftBound;
    }

    if (typeof config.rightBound != 'undefined') {
      rightBound = config.rightBound;
    }

    applyBounds();

  };

}(window, jQuery, d3, window.rodalytics, window.rodalyticsTime));