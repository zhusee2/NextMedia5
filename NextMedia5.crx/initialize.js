/*

NextMedia5 Safari Extension
Version 1.1.2
By Zhusee (zhusee@gmail.com)

Visit: http://zhusee2.github.com/nextmedia5

*/

document.addEventListener('beforeload', function(event) {
	if(event.target.tagName==='EMBED' && event.url==='/jwplayer/player.swf') {
    var flashVars = event.target.getAttribute('flashvars');
    var flashVideoSrc = flashVars.match(/file\=(http.+\/.+\.flv)/)[1];
    var posterSrc = flashVars.match(/image\=(http.+\.jpg)/)[1];
    
    var videoSrc = flashVideoSrc.replace(/\/video\/\//,'/wap_video/')
                   .replace(/\.flv$/,'.m4v');

    $(event.target.parentElement)
      .addClass('nextmedia5Container')
      .append('<video id="nextmedia5Player" width="630" height="355" preload="none" poster="' + posterSrc + '"><source src="' + videoSrc +'" type="video/mp4" /><source src="' + flashVideoSrc +'" type="video/x-flv" /></video>')
      .append('<div id="nextmedia5PlayButton"><a href="#">▲</a></div>');
    $(event.target).remove();

    $('#nextmedia5PlayButton a').live('click', function(e) {
      var player = $('#nextmedia5Player').dom[0];
      
      player.controls = true;
      player.play();
      
      $(this.parentElement).remove();
      e.preventDefault();
    });

    event.preventDefault();

  }
}, true);