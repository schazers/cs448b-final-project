var playlist = new Playlist(genreTree, releaseArray,displayPlaylist);
var playlistDiv = d3.select("#container").append("div");
playlistDiv.style("float","right")
    .style("font-size","x-large")
    .style("list-style-position","inside")
    .style("list-style-type","none")
    .style("text-align","center")
    .text("Playlist")
    .append("ol")
    .attr("id","playlist");

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