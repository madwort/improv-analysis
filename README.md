# Rodalytics

## Interactive visualisation for Rodrigo Constanzo's improvisation self-reflection

## Install

* install nodejs 
	* ubuntu12: https://rtcamp.com/tutorials/nodejs/node-js-npm-install-ubuntu/
* sudo npm install -g bower 
* bower install

## Datafiles

* audio file readable by Web Audio API in your browser of choice (eg. MP3) 
* CSV file of format:

"time","streamid","comment"
00:02.000,3,"Rhythm not responding like I would like. Adjust."
00:04.000,3,"Rhythm density to liking, prepare to play percussion."
00:06.000,1,"Reset mind."

* time is mm:ss.0000
* streamid is
	* 1: Material
	* 2: Formal
	* 3: Interface
	* 4: Interaction

##Wordpress plugin usage

eg:
```
 [improv-analysis unique\_name="analysis1" 
   audio\_url="http://madwort.co.uk/wp-content/plugins/improv-analysis/assets/Everything 1a.mp3" 
   data\_url="http://madwort.co.uk/wp-content/plugins/improv-analysis/assets/Everything 1a.csv" 
   trend\_chart=true bubble\_chart=true]
```

## Licence

* New code: Not known... 
* Portions written by oncletom under unknown licence

## References

### d3 
http://d3js.org

### charts
https://github.com/PMSI-AlignAlytics/dimple/wiki/dimple
http://dc-js.github.io/dc.js/ (alternative, not used)

### data processing
https://github.com/mbostock/d3/wiki/CSV#parse
http://misoproject.com/dataset/examples.html (alternative, not used)

### time formats
http://en.wikipedia.org/wiki/ISO_8601
https://github.com/mbostock/d3/wiki/Time-Formatting
https://github.com/mbostock/d3/wiki/Time-Intervals

### js range sliders
http://ionden.com/a/plugins/ion.rangeSlider/demo.html 
http://refreshless.com/nouislider/ (alternative, not used)

### waveform-view
https://github.com/bbcrd/waveform-data.js
http://bl.ocks.org/oncletom/5822102
http://waveform.prototyping.bbc.co.uk

### html5 audio playback
https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_HTML5_audio_and_video
