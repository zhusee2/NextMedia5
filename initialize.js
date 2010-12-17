/*

NextMedia5 Safari Extension
Version 1.0.0
By Zhusee (zhusee@gmail.com)

Visit: http://zhusee2.github.com/nextmedia5

*/

document.addEventListener('beforeload', function(event) {
	if(event.target.tagName==='EMBED' && event.url==='/jwplayer/player.swf') {
    var flashVars = event.target.getAttribute('flashvars');
    var flashVideoSrc = flashVars.match(/file\=(http.+\/).+\.flv/)[1];
    var posterSrc = flashVars.match(/image\=(http.+\.jpg)/)[1];
    var newsID = location.href.match(/art_id\/(\d+)\//)[1];
    
    var videoSrc = flashVideoSrc.replace(/\/video\//,'/wap_video/') + newsID + '.m4v';

    $(event.target.parentElement).append('<video id="nextmedia5Player" width="660" height="420" controls preload="none" poster="' + posterSrc + '"><source src="' + videoSrc +'" /></video>');
    $(event.target).remove();

    event.preventDefault();

  }
}, true);