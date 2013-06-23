/*

NextMedia5 Safari Extension
Version 1.5.3

Visit: https://github.com/zhusee2/NextMedia5

*/

// Custom helper to push videoSrc object to array
Array.prototype.pushVideo = function pushVideoToArray(format, src) {
  this.push({'format': format, 'src': src});
}

var flashAvailability = (navigator.plugins["Shockwave Flash"]) && (navigator.mimeTypes["application/x-shockwave-flash"]);

// Listen to BeforeLoad events
if (window.self == window.top) {
  if (location.href.match(/^https?:\/\/(www\.)?appledaily\.com\.tw/i)) {
    parseTWAppleDailyVideoSrc();
  } else if (location.href.match(/^https?:\/\/(www\.)?nexttv\.com\.tw\/\S+\/\d+/i)) {
    document.addEventListener('beforeload', parseTWNextTVVideoSrc, true);
  } else {
    document.addEventListener('beforeload', parseHKAppleDailyVideoSrc, true);
  }
}


function parseTWAppleDailyVideoSrc(event) {
  var scriptElemet = $('.mediabox script, #playerVideo script'),
      rawScript = "", videoSrc = "", posterSrc = "",
      videoSources = [],
      playerDom = $('#flow_player');

  if (scriptElemet.length > 0) {
    rawScript = scriptElemet[0].innerHTML;
    videoSrc = rawScript.match(/http\:\/\/.+\.mp4/)[0];
    posterSrc = rawScript.match(/setInitialImage\('(.+)'\)/)[1];

    videoSources.pushVideo('mp4', videoSrc);
    createHTML5Player(playerDom[0], videoSources, posterSrc);
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
  if(event.target.tagName==='OBJECT' && event.url.match(/flowplayer.+\.swf/)) {
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

  $('.nextmedia5Container').on('click', 'a', function(e) {
    var player = $('#nextmedia5Player')[0];

    player.controls = true;
    player.play();

    $(this.parentElement).remove();
    e.preventDefault();
  });

}