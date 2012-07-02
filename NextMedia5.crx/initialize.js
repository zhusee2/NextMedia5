/*

NextMedia5 Safari Extension
Version 1.4

Visit: https://github.com/zhusee2/NextMedia5

*/

// Custom helper to push videoSrc object to array
Array.prototype.pushVideo = function pushVideoToArray(format, src) {
  this.push({'format': format, 'src': src});
}

// Listen to BeforeLoad events
if (window.self == window.top) {
  if (location.href.match(/^https?:\/\/www\.appledaily\.com\.tw/i)) {
    document.addEventListener('beforeload', parseTWAppleDailyVideoSrc, true);
  } else if (location.href.match(/^https?:\/\/www\.nexttv\.com\.tw\/vod\/\d+/i)) {
    document.addEventListener('beforeload', parseTWNextTVVideoSrc, true);
  } else {
    document.addEventListener('beforeload', parseHKAppleDailyVideoSrc, true);
  }
}


function parseTWAppleDailyVideoSrc(event) {
  if (event.target.nodeName === 'IFRAME' && event.url.match(/http\:\/\/tw\.nextmedia\.com\/playeriframe/)) {
    var videoDate = event.url.match(/\/IssueID\/(\d+)\/Photo/)[1],
        posterID = event.url.match(/Photo\/(.+\.jpg)\/Video/)[1],
        videoID = event.url.match(/Video\/(.+\.mp4)/)[1];
    
    var videoSrc = 'http://video.appledaily.com.tw/video/' + videoDate + '/' + videoID,
        posterSrc = 'http://twimg.edgesuite.net/www/extfile/artvideo/' + videoDate + '/' + posterID;
    
    var videoSources = [];
    videoSources.pushVideo('mp4', videoSrc);
    
    createHTML5Player(event.target, videoSources, posterSrc);
    
    event.preventDefault();

  }

}

function parseHKAppleDailyVideoSrc(event) {

  if(event.target.tagName==='EMBED' && event.url==='osmf/ApplePlayer.swf') {
    var flashVars = event.target.getAttribute('flashvars'),
        videoSrc = flashVars.match(/\&src=(http:.+\.mp4)\&/)[1],
        posterSrc = flashVars.match(/\&poster=(\/images.+\.jpg)\&/)[1];

    createHTML5Player(event.target, videoSrc, posterSrc);
    event.preventDefault();
  }
}

function parseTWNextTVVideoSrc(event) {
  if(event.target.tagName==='OBJECT' && event.url.match(/:\/\/.*nexttv.com.tw\/.+StrobeMediaPlayback\.swf/)) {
    var videoSrc = document.querySelector('#ntt-vod-src-detailview').value,
        posterSrc = document.querySelector('#ntt-vod-img-src').value;

    createHTML5Player(event.target, videoSrc, posterSrc);
    event.preventDefault();
  }
}

function createHTML5Player(flashPlayerDOM, videoSrc, posterSrc) {
  if (typeof videoSrc == 'string') videoSrc = [{format: 'mp4', src: videoSrc}];
  
  // Initialize <video> element
  var videoElement = $('<video id="nextmedia5Player" preload="none">');
  
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