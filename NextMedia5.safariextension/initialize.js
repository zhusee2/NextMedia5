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
  }
  if (location.href.match(/^https?:\/\/(www\.)?nexttv\.com\.tw\/\S+\/\d+/i)) {
    parseTWNextTVVideoSrc();
  }
}


function parseTWAppleDailyVideoSrc(event) {
  var scriptElemet = $('.mediabox script, #playerVideo script'),
      rawScript = "", videoSrc = "", posterSrc = "",
      videoSources = [];

  var renderPlayer = function() {
        var playerDOM = $('#flow_player');
        createHTML5Player(playerDOM[0], videoSources, posterSrc);
      };

  if (scriptElemet.length > 0) {
    rawScript = scriptElemet[0].innerHTML;
    videoSrc = rawScript.match(/http\:\/\/.+\.mp4/)[0];
    posterSrc = rawScript.match(/setInitialImage\('(.+)'\)/)[1];

    videoSources.pushVideo('mp4', videoSrc);

    if ($('#flow_player').length > 0) {
      renderPlayer();
    } else {
      $('.mediabox, #playerVideo').on('click', '.yes', function(event) {
        setTimeout(renderPlayer, 100);
      });
    }
  }
}

function parseTWNextTVVideoSrc(event) {
  if ($('#ntt-vod-src-detailview').length > 0) {
    var videoSrc = $('#ntt-vod-src-detailview').val(),
        posterSrc = $('#ntt-vod-img-src').val(),
        playerDOM = $('#flow_player');

    createHTML5Player(playerDOM[0], videoSrc, posterSrc);
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