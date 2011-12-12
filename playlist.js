var BACKGROUND_COLOR = "#FFFFFF";
var PLAY_IMAGE = "play.png";
var PAUSE_IMAGE = "pause.png";
var PLAYLIST_ITEM_HIGHLIGHT_COLOR = "#5CB3FF";
var PLAYLIST_ITEM_SELECT_COLOR = "#2B60DE";
var playlist = new Playlist(genreTree, releaseArray);

playlist.songAddedListeners.push(handlePlaylistSongAdded);
playlist.selectedListeners.push(handlePlaylistSelectedChanged);
playlist.playingListeners.push(handlePlaylistPlayingChanged);
playlist.startedListeners.push(handlePlaylistStartedChanged);
playlist.curListeners.push(handlePlaylistCurChanged);





var playlistDiv = d3.select("#playlistDiv")
    .attr("id","playlistDiv")
    .style("float","left")
    .style("width","280px")
    .style("font-size","x-large");

playlistDiv.append("h1").text("Playlist");

var selectedSongBoxDiv = playlistDiv.append("div")
    .attr("id","selectedSongBox")
    .style("height","60px")
    .style("margin-top","20px")
    .style("margin-bottom","20px")
    .style("clear","both")
    .style("text-align","left");

selectedSongBoxDiv.append("div")
    .style("clear","both")
    .style("float","left")
    .text("Artist: ");

selectedSongBoxDiv.append("div")
    .attr("id","artistInfoBox")
    .style("float","left");


selectedSongBoxDiv.append("div")
    .style("clear","both")
    .style("float","left")
    .text("Genre:");

selectedSongBoxDiv.append("div")
    .attr("id","genreInfoBox")
    .style("float","left");

selectedSongBoxDiv.append("div")
    .style("clear","both")
    .style("float","left")
    .text("Style:");

selectedSongBoxDiv.append("div")
    .attr("id","styleInfoBox")
    .style("float","left");





playlistDiv.append("div")
    .attr("id","player")
    .attr("hidden","true");

var playlistControllerDiv = playlistDiv.append("div")
    .style("clear","both")
    .attr("id","playlistControllerDiv");


playlistControllerDiv.append("button")
    .attr("id","playlistPlayButton")
    .style("clear","both")
    .style("float","left")
    .text("Play")
    .attr("disabled","true")
    .on("click",play);

playlistControllerDiv.append("button")
    .attr("id","playlistPauseButton")
    .style("float","left")
    .text("Pause")
    .attr("disabled","true")
    .on("click",pause);

playlistControllerDiv.append("button")
    .attr("id","playlistStopButton")
    .style("float","left")
    .text("Stop")
    .attr("disabled","true")
    .on("click",stop);

playlistControllerDiv.append("button")
    .attr("id","playlistNextButton")
    .style("float","left")
    .text("Next")
    .attr("disabled","true")
    .on("click",next);

playlistDiv.append("div")
    .style("clear","both")
    .attr("id","playlist")
    .style("text-align","left");

var player;
function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
	    height: '0',
	    width: '0',
	    videoId: '',
	    events: {
		'onReady': onPlayerReady,
		'onError': handleVideoError,
		'onStateChange': onPlayerStateChange
	    }
        });
};

function handleVideoError(){
    console.log("SONG NOT AVAILABLE");
    next();
}

// 4. The API will call this function when the video player is ready.
function handlePlaylistSongAdded(songIndex){
    // first Song added
    if(songIndex==0){
	d3.select("#playlistPlayButton")
	    .attr("disabled",null);
	var song = playlist.getSong(songIndex);
	var releaseIndex = song.releaseIndex;
	var release = playlist.getRelease(releaseIndex);
	var videoId = release.videoId;
	try{
	    player.cueVideoById(videoId);
	}catch(error){
	    console.log(error);
	    playlist.list=[];
	}
    }
    displayPlaylist();
}

function handlePlaylistCurChanged(songIndex){
    var song = playlist.getSong(songIndex);
    var releaseIndex = song.releaseIndex;
    var release = playlist.getRelease(releaseIndex);
    if(release != null){
	var videoId = release.videoId;
	if(playlist.playing){
	    player.loadVideoById(videoId);
	}else{
	    player.cueVideoById(videoId);
	}
    }else{
	stop();
    }
    displayPlaylist();
}

function handlePlaylistStartedChanged(){
    if(!playlist.started){
	player.stopVideo();
	var release = playlist.getCurrentRelease();
	if(release != null){
	    var videoId = release.videoId;
	    player.cueVideoById(videoId);
	}
	
	d3.select("#playlistPlayButton")
	    .attr("disabled",null);
	d3.select("#playlistPauseButton")
	    .attr("disabled","true");
	d3.select("#playlistStopButton")
	    .attr("disabled","true");
	d3.select("#playlistNextButton")
	    .attr("disabled","true");
	displayPlaylist();
    }
}

function handlePlaylistPlayingChanged(){
    var playing = playlist.playing;
    if(!playing){
	player.pauseVideo();
	d3.select("#playlistPlayButton")
	    .attr("disabled",null);
	d3.select("#playlistPauseButton")
	    .attr("disabled","true");
	d3.select("#playlistStopButton")
	    .attr("disabled",null);

    }else{
	player.playVideo();
	d3.select("#playlistPlayButton")
	    .attr("disabled","true");
	d3.select("#playlistPauseButton")
	    .attr("disabled",null);
	d3.select("#playlistStopButton")
	    .attr("disabled",null);
	d3.select("#playlistNextButton")
	    .attr("disabled",null);
    }
    displayPlaylist();
};

function handlePlaylistSelectedChanged(){
    var selectedSongIndex = playlist.getSelected();
    var song = playlist.getSong(selectedSongIndex);
    var releaseIndex = song.releaseIndex;
    var release = playlist.getRelease(releaseIndex);
    var artist = release.artist;
    var genre = release.genre;
    var style = release.style;

    d3.select("#artistInfoBox")
	.text(artist);
    d3.select("#genreInfoBox")
	.text(genre);
    d3.select("#styleInfoBox")
	.text(style);
    displayPlaylist();
};

function pause(){
    playlist.pause();

};
function play(){
    playlist.play();

};
function stop(){
    playlist.stop();
};
function next(){
    playlist.playNext();
};

function onPlayerReady(event) {

}

var done = false;
function onPlayerStateChange(event) {
    console.log("event.data: "+event.data);
    if (event.data == YT.PlayerState.ENDED ) {
	next();
    }
}




function displayPlaylist(){
    var pList = d3.select("#playlist");
    var songs = playlist.list;

    var items = pList.selectAll(".playlistItem")
	.data(songs)
	.enter().append("div")
	.attr("class","playlistItem")
	.on("mouseover",highlightPlaylistItem)
	.on("mouseout",deHighlightPlaylistItem)
	.on("click",selectSong)
	.on("dblclick",playSelectedSong);

    items.selectAll(".playlistAnnotate")
	.data(function(d,i){return [d]})
	.enter().append("div")
	.attr("class","playlistAnnotate")
	.style("float","left")
	.style("width","20px")
	.style("height","20px")
	.style("background-repeat","no-repeat")
	.style("background-position","left top");


    items.selectAll(".playlistBlurb")
	.data(function(d,i){return [d];})
	.attr("class","playlistBlurb")
	.enter().append("div")
	.text(getSongBlurb);

    if(playlist.started){
	var cur = playlist.cur;
	if(playlist.playing){
	    annotatePlayItem(cur);
	}else{
	    annotatePauseItem(cur);
	}
    }else{
	deAnnotateAllItems();
    }
}

function annotatePlayItem(index){
    var pList = d3.select("#playlist");
    pList.selectAll(".playlistAnnotate")
	.filter(function(d,i){return i==index ? true : false;})
	.style("background-image","url('"+PLAY_IMAGE+"')");

    pList.selectAll(".playlistAnnotate")
	.filter(function(d,i){return i!=index ? true : false;})
	.style("background-image", null);
    
}
function annotatePauseItem(index){
    var pList = d3.select("#playlist");
    pList.selectAll(".playlistAnnotate")
	.filter(function(d,i){
		return i==index ? true : false;})
	.style("background-image","url('"+PAUSE_IMAGE+"')");

    pList.selectAll(".playlistAnnotate")
	.filter(function(d,i){return i!=index ? true : false;})
	.style("background-image", null);
}


function deAnnotateAllItems(){
    var pList = d3.select("#playlist");
    pList.selectAll("div")
	.style("background-image", null);
}

function selectSong(d,i){
    var prevSelected = playlist.getSelected();
    d3.select("#playlist").selectAll(".playlistItem")
	.filter(function(d,i){return i==prevSelected})
	.style( "background",BACKGROUND_COLOR );
    d3.select( this ).style( "background",PLAYLIST_ITEM_SELECT_COLOR );
    playlist.setSelected(i);
}

function playSelectedSong(d,i){
    playlist.setCur(i);
    playlist.play();
}

function highlightPlaylistItem(d,i){
    d3.select( this ).style( "background",PLAYLIST_ITEM_HIGHLIGHT_COLOR );
    playlist.setHighlighted(i);
}

function deHighlightPlaylistItem(d,i){
    var isSelected = (playlist.selected == i);
    playlist.setHighlighted(null);
    if(isSelected){
	d3.select( this ).style( "background",PLAYLIST_ITEM_SELECT_COLOR );
    }else{
	d3.select( this ).style( "background",BACKGROUND_COLOR );
    }
}

function getSongBlurb(song){
    var releaseIndex = song.releaseIndex;
    var release = playlist.getRelease(releaseIndex);
    var name = release.name;
    var artist =release.artist;
    var blurb = "\""+name +"\" - "+artist;
    return blurb;
}

function addSong(d){
    if(d instanceof Genre){
	var genre = d;
	if(genre!=null){
	    playlist.addGenreSong(genre.name);
	}
    }else if(d instanceof Style){
	var style = d;
	if(style!=null){
	    playlist.addStyleSong(style.genreName,style.name);
	}
    }else if(d instanceof Artist){
	var artist = d;
	if(artist!=null){
	    playlist.addArtistSong(artist.genreName,artist.styleName,artist.name);
	}
    }
}