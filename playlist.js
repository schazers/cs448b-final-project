var playlist = new Playlist(genreTree, releaseArray,handleSongAdded);
var playlistDiv = d3.select("#container").append("div")
    .attr("id","playlistDiv")
    .style("float","right")
    .style("font-size","x-large")
    .style("list-style-position","inside")
    .style("list-style-type","none")
    .style("text-align","center");
playlistDiv.append("h1").text("Playlist");


var playlistControllerDiv = playlistDiv.append("div")
    .attr("id","playlistControllerDiv");

var playlistStatusDiv = playlistControllerDiv.append("div")
    .attr("id","playlistStatusDiv")
    .style("float","top")
    .text("Not Playing");

playlistControllerDiv.append("button")
    .attr("id","playlistPlayButton")
    .style("float","left")
    .text("Play")
    .on("click",handlePlayButtonPressed);

playlistControllerDiv.append("button")
    .attr("id","playlistPauseButton")
    .style("float","left")
    .text("Pause")
    .on("click",handlePauseButtonPressed);

playlistControllerDiv.append("button")
    .attr("id","playlistNextButton")
    .style("float","left")
    .text("Next")
    .on("click",playNextSong);


var playerDiv = playlistDiv.append("div").attr("id","player").attr("hidden","true");
playlistDiv.append("ol")
    .attr("id","playlist")
    .style("clear","both");
var player;

function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
	    height: '195',
	    width: '320',
	    videoId: '',
	    events: {
		'onReady': onPlayerReady,
		'onStateChange': onPlayerStateChange
	    }
        });
};

// 4. The API will call this function when the video player is ready.

function handlePlayButtonPressed(){
    playlistStatusDiv.text("Playing")
	player.playVideo();
}

function handlePauseButtonPressed(){
    playlistStatusDiv.text("Paused")
	player.pauseVideo();
}

function onPlayerReady(event) {

}

function playNextSong(){
    playlist.playNext();
    var release = playlist.getCurrentRelease();
    if(release != null){
	var videoId = release.videoId;
	player.loadVideoById(videoId);
    }else{
	//   player.stopVideo();
    }
}
var done = false;
function onPlayerStateChange(event) {
    console.log("event.data: "+event.data);
    if (event.data == YT.PlayerState.ENDED) {
	playNextSong();
    }
}


function handleSongAdded(){
    var numSongs = playlist.getNumSongs();
    var added = numSongs-1;
    if(numSongs==1){
	var release = playlist.getRelease(added);
	var videoId = release.videoId;
	player.cueVideoById(videoId);
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