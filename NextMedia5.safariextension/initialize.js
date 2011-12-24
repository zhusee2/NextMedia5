/*

NextMedia5 Safari Extension
Version 1.3

Visit: https://github.com/zhusee2/NextMedia5

*/

// Custom helper to push videoSrc object to array
Array.prototype.pushVideo = function pushVideoToArray(format, src) {
  this.push({'format': format, 'src': src});
}

// Listen to BeforeLoad events
if (window.self == window.top) {
  if (location.href.match(/^https?:\/\/tw\.nextmedia\.com/i)) {
    document.addEventListener('beforeload', parseTWAppleDailyVideoSrc, true);
  }
}


function parseTWAppleDailyVideoSrc(event) {

	if(event.target.tagName==='EMBED' && event.url==='/jwplayer/player.swf') {
    var flashVars = event.target.getAttribute('flashvars');
    var flashVideoSrc = flashVars.match(/file\=(http.+\/.+\.flv)/);
    if(flashVideoSrc) flashVideoSrc= flashVideoSrc[1];
    var posterSrc = flashVars.match(/image\=(http.+\.jpg)/i)[1];
    
    var videoSources = [];
    
    if (flashVideoSrc) {
        //legacy version
        var videoHash = posterSrc.match(/\d\/(.*)_\d*.jpg/)[1];
        var videoSrcCandidate = flashVideoSrc.replace(/\/video\/\//,'/wap_video/')
                              .replace(/\.flv$/,'.m4v');
        var videoSrc = videoSrcCandidate.replace(/\w*.m4v/,videoHash + '.m4v');
        
        videoSources.pushVideo('mp4', videoSrc);
        videoSources.pushVideo('x-flv', flashVideoSrc);
        videoSources.pushVideo('mp4', videoSrcCandidate);
    } else {
        //new version(2011-Mar)
        var videoSrc = flashVars.match(/file\=(http.+\/.+\.mp4)/)[1];
        videoSources.pushVideo('mp4', videoSrc);
    }
    
    createHTML5Player(event.target, videoSources, posterSrc);
    
    event.preventDefault();

  }

}



function createHTML5Player(flashPlayerDOM, videoSrc, posterSrc) {
  if (typeof videoSrc == 'string') videoSrc = [{format: 'mp4', src: videoSrc}];
  
  // Initialize <video> element
  var videoElement = $('<video id="nextmedia5Player" width="630" height="355" preload="none">');
  
  if (posterSrc) $(videoElement).attr('poster', posterSrc);
  for (var i = 0; i < videoSrc.length; i++) {
    $(videoElement).append('<source src="' + videoSrc[i].src +'" type="video/' + videoSrc[i].format + '" />')
  }

  $(flashPlayerDOM.parentElement)
      .addClass('nextmedia5Container')
      .append(videoElement)
      .append('<div id="nextmedia5PlayButton"><a href="#">▲</a></div>');

    $(flashPlayerDOM).remove();

    $('#nextmedia5PlayButton a').live('click', function(e) {
      var player = $('#nextmedia5Player')[0];
      
      player.controls = true;
      player.play();
      
      $(this.parentElement).remove();
      e.preventDefault();
    });
  
}