(function (w, d3) {
	"use strict";

   w["rodalyticsTime"] = function(){

		// this is the time format in the CSV files
		var timeFormatCSVString = "%M:%S.%L";
		var timeFormatCSV = d3.time.format(timeFormatCSVString);

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
				
		var zeroTime = timeFormatCSV.parse("00:00.000");

		function timeFromSeconds(seconds) {
			return timeFormatCSV.parse(Math.floor(seconds/60)+":"+(Math.floor(seconds%60))+"."+(seconds-Math.floor(seconds)))
		}

		return {
			timeFormatCSVString: timeFormatCSVString,
			timeFormatCSV: timeFormatCSV,
			timeFormatCSVComparison: timeFormatCSVComparison,
			timeFormatCSVFilter: timeFormatCSVFilter,

			timeFormatDisplayString: timeFormatDisplayString,
			timeFormatDisplay: timeFormatDisplay,

			zeroTime: zeroTime,
			
			timeFromSeconds: timeFromSeconds

		}

	};

}(window, d3));