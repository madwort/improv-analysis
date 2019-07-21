// these functions create HTML elements from functions in rodalytics.js
// they should be replaced by a proper templating system!
(function(w, ra){
  "use strict";
   w["stats"] = function(){

  // assumes the data is ordered firstly by time 
  function transitionMatrix(element, stream_transitionMatrix) {
    var mytable = element.append("table");
     var heading_row = mytable.append("tr");
     heading_row.append("th").text("Stream").classed("All", true);
     for (var i = 0; i < 4; i++) {
       var label = heading_row.append("th");
       label.text(ra.stream_names[(i+1)]);
       label.classed(ra.stream_names[(i+1)], "true");
     };
  
     for (var i = 0; i < stream_transitionMatrix.length; i++) {
       var myrow = mytable.append("tr");
       var label = myrow.append("td");
       label.text(ra.stream_names[i+1]);
       label.classed(ra.stream_names[i+1], "true");
       for (var j = 0; j < stream_transitionMatrix[i].length; j++) {
         myrow.append("td").text(stream_transitionMatrix[i][j]);
       }
     }
  }

  function activitySummary(element,activitySummary) {
    var mytable = element.append("table");
    // could refactor & do forEach on streamname list?
    var heading_row = mytable.append("tr");
    heading_row.append("th").text("Stream").classed("All", true);
    heading_row.append("th").text("Instances");

    activitySummary.forEach(function(e){
      var myrow = mytable.append("tr");
      var label = myrow.append("td");
      label.text(e.stream_name);
      label.classed(e.stream_name, "true");

      myrow.append("td").text(e.count);
    })
  }

  function durationPerStream(element, durationStats) {
     var mytable = element.append("table");
     var heading_row = mytable.append("tr");
     heading_row.append("th").text("Stream").classed("All", true);
     heading_row.append("th").text("Min");
     heading_row.append("th").text("Median");
     heading_row.append("th").text("Mean");
     heading_row.append("th").text("Std Dev");
     heading_row.append("th").text("Max");

     var three_sf = d3.format(".3g");

     durationStats.forEach(function(e){
       var myrow = mytable.append("tr");
       var label = myrow.append("td");
       label.text(e.stream_name);
       label.classed(e.stream_name, "true");
        myrow.append("td").text(three_sf(e.min));
        myrow.append("td").text(three_sf(e.median));
        myrow.append("td").text(three_sf(e.mean));
        myrow.append("td").text(three_sf(e.deviation));
        myrow.append("td").text(three_sf(e.max));
     });
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
    transitionMatrix: transitionMatrix,
    activitySummary: activitySummary,
    durationPerStream: durationPerStream,
    activityLog: activityLog
  }
  };
})(window, ra);