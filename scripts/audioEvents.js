(function (w, d) {
	"use strict";

	w["audioEvents"] = function(audioPlayer, playButton, pauseButton){

			function audioPlay() {
				// HACK...!
				var leftBound = $('#range_slider').data().from;
				var rightBound = $('#range_slider').data().to;
				
				if (audioPlayer[0][0].currentTime < leftBound ||
					 audioPlayer[0][0].currentTime > rightBound) {
						 audioPlayer[0][0].currentTime = leftBound;
				}
				audioPlayer[0][0].play();
				playButton.classed("highlight",true);
				pauseButton.classed("highlight",false);
			}

			function audioPause() {
				audioPlayer[0][0].pause();
				playButton.classed("highlight",false);
				pauseButton.classed("highlight",true);
			}

			function audioPlayPause() {
				if(audioPlayer[0][0].paused) {
					audioPlay();
				} else {
					audioPause();
				}
			}

			d.documentElement.addEventListener('keydown', function (e) {
			    if ( ( e.keycode || e.which ) == 32) {
			        e.preventDefault();
			    }
			}, false);
			
			d.addEventListener('keyup',function(e) { 
				switch (e.keyCode) {
					// the letter P
					case 80:
					// the space
					case 32:
						audioPlayPause();
						break;
					// the comma 
					case 188:
					// the left arrow
					case 37:
						audioPlayer[0][0].currentTime -= 10;
						break;
					// the full stop
					case 190:
					// the right arrow
					case 39:
						audioPlayer[0][0].currentTime += 10;
						break;
				}
			});

			playButton.on("click",audioPlay);
			pauseButton.on("click",audioPause);

			return {
				audioPause: audioPause,
			}

		};

}(window, document));