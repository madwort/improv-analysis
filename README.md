# Improv Analysis

Interactive visualisation for Rodrigo Constanzo's improvisation self-reflection framework.

## Contents

* a Wordpress plugin to store improv analyses in a database
  * mostly written in PHP/MySQL, but uses $wpdb object & hides behind the Wordpress login
* a standalone PHP script to dump out analyses as JSON
* analysis visulation 
  * written in JS

## Install

### Wordpress plugin

* get plugin files to Wordpress install
  * e.g. `cp -r plugin/ $WORDPRESS_PATH/wp-content/plugins/improv-analysis-2.0`
  * OR `ln -s ~user/improv-analysis-2.0/plugin $WORDPRESS_PATH/wp-content/plugins/improv-analysis-2.0`
* enable plugin
* go to the "install" page of the plugin & create the tables!

### Standalone PHP script

* create `plugin/db_config.php` from the template in `plugin/db_config_sample.php`

### Analysis visualisation

* install nodejs 
	* ubuntu12: https://rtcamp.com/tutorials/nodejs/node-js-npm-install-ubuntu/
  * ubuntu18: https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04
* `sudo npm install -g bower` 
* `bower install`
* `mv bower_components plugin/`

## Datafiles

* audio file readable by Web Audio API in your browser of choice (eg. MP3) 

### CSV file - improv analysis format

```
"time","streamid","comment"
00:02.000,3,"Rhythm not responding like I would like. Adjust."
00:04.000,3,"Rhythm density to liking, prepare to play percussion."
00:06.000,1,"Reset mind."
```

* time is mm:ss.0000
* streamid is
	* 1: Material
	* 2: Formal
	* 3: Interface
	* 4: Interaction

### CSV file - Reaper format

```
#,Name,Start
M1,Not Sure what to do,0:01.729
M2,Initial hesitation,0:02.716
M3,"Impulsive start (Inner monologue: ""Just GO, FFS"")",0:03.500
```

* time is mm:ss.0000

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
