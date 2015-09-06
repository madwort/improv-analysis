(function (w, d3) {
	"use strict";

   w["rodalyticsTime"] = (function(){

		// this is the time format in the CSV files
		var timeFormatCSVString = "%M:%S.%L";
		var timeFormatCSV = d3.time.format(timeFormatCSVString);

		var zeroTime = timeFormatCSV.parse("00:00.000");

		function timeFormatCSVComparison(a,b) {
			return (timeFormatCSV.parse(a.time)-timeFormatCSV.parse(b.time));
		}

		function timeFormatCSVFilter(lowerBound, upperBound) {
			return function (d, index) {
				return ((((timeFormatCSV.parse(d.time)-zeroTime)/1000) >= lowerBound ) &&
							((timeFormatCSV.parse(d.time)-zeroTime)/1000) <= upperBound);
			}
		}

		// this is the time format we often want to output
		var timeFormatDisplayString = "%M:%S";
		var timeFormatDisplay = d3.time.format(timeFormatDisplayString);
				
		function timeFromSeconds(seconds) {
			var remainder = (seconds%60).toFixed(3);
			return timeFormatCSV.parse(Math.floor(seconds/60)+":"+remainder);
		}

		return {
			timeFormatCSVString: timeFormatCSVString,
			timeFormatCSV: timeFormatCSV,

			zeroTime: zeroTime,

			timeFormatCSVComparison: timeFormatCSVComparison,
			timeFormatCSVFilter: timeFormatCSVFilter,

			timeFormatDisplayString: timeFormatDisplayString,
			timeFormatDisplay: timeFormatDisplay,

			timeFromSeconds: timeFromSeconds

		}

	})();

}(window, d3));