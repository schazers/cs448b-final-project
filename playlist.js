var playlist = new Playlist(genreTree, releaseArray,handleSongAdded);
playlist.loop=true;
var playlistDiv = d3.select("#container").append("div")
    .attr("id","playlistDiv")
    .style("float","right")
    .style("font-size","x-large")
    .style("list-style-position","inside")
    .style("list-style-type","none")
    .style("text-align","center");
playlistDiv.append("h1").text("Playlist");
var playerDiv = playlistDiv.append("div").attr("id","player");
playlistDiv.append("ol")
    .attr("id","playlist");
var player;

function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
	
	    height: '195',
	    width: '320',
	    videoId: '',
	    playerVars: {'controls':1,autoplay:0},
	    events: {
		'onReady': onPlayerReady,
		'onStateChange': onPlayerStateChange
	    }
        });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {

}

var done = false;
function onPlayerStateChange(event) {
    console.log("event.data: "+event.data);
    if (event.data == YT.PlayerState.ENDED) {
	playlist.playNext();
	var release = playlist.getCurrentRelease();
	if(release != null){
	    var videoId = release.videoId;
	    player.loadVideoById(videoId);
	}else{
	    //   player.stopVideo();
	}
    }
}
function stopVideo() {
    player.stopVideo();
}

function handleSongAdded(){
    var numSongs = playlist.getNumSongs();
    var added = numSongs-1;
    if(numSongs==1){
	var release = playlist.getRelease(added);
	var videoId = release.videoId;
	player.cueVideoById(videoId)
    }
    displayPlaylist();
}
function displayPlaylist(){
    var pList = d3.select("#playlist");
    var songs = playlist.list;
    pList.selectAll("li")
	.data(songs)
	.enter().append("li")
	.text(getSongBlurb);
}

function getSongBlurb(song,i){
    var release = playlist.getRelease(i);
    var name = release.name;
    var artist =release.artist;
    var blurb = "\""+name +"\" - "+artist;
    return blurb;
}