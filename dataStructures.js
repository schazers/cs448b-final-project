/************************
 ******* Release ********
 ************************/

function Release(name, year, videoId,genre,style,artist){
    this.name = name;
    this.artist = artist;
    this.genre = genre;
    this.style = style;
    this.year = year;
    this.videoId = videoId;
};




/*****************************
 ******* ReleaseArray ********
 *****************************/


function ReleaseArray(){
    this.releases=[];
};

ReleaseArray.prototype.getRelease= function(releaseIndex){
    var release;
    try{
	release = this.releases[releaseIndex];
    }catch(error){
	console.log("Error: ReleaseArray.getRelease: ",error);
    }
    return release;
};

ReleaseArray.prototype.appendRelease= function(release){
    this.releases.push(release);
    return this;
};

ReleaseArray.prototype.importFromJson = function(releaseArrayJson){
    for(var i in releaseArrayJson){
	var jRelease = releaseArrayJson[i];
	var name = jRelease["name"];
	var year = jRelease["year"];
	var videoId = jRelease["videoId"];
	var artist = jRelease["artist"];
	var style = jRelease["style"];
	var genre = jRelease["genre"];

	var release = new Release(name,year,videoId,genre,style,artist);
	this.appendRelease(release);
    }
    return this;
};

/*****************************
 *********** Artist **********
 *****************************/


function Artist (genreName,styleName,name,parent){
    this.styleName =styleName;
    this.genreName = genreName;
    this.name = name;
    this.releaseIndicies = [];
    this.parent=parent;
    this.type = "Artist";
};

Artist.prototype.addReleaseIndex = function(releaseIndex){
    this.releaseIndicies.push(releaseIndex);
    return this;
};

Artist.prototype.equals = function(artist){
    if(!(artist instanceof Artist)){
	return false;
    }else if(this.genreName != artist.genreName){
	return false;
    }else if(this.styleName != artist.styleName){
	return false;
    }else if(this.name != artist.name){
	return false;
    }else{
	return true;
    }
};
Artist.prototype.toString = function(){
    var out = "G:"+this.genreName+"S:"+this.styleName+"A:"+this.name;
    out = out.replace(/\W+/g,"_");
    return out;
};

/*****************************
 *********** Style ***********
 *****************************/

function Style(genreName,name,parent){
    this.genreName = genreName;
    this.name = name;
    this.artists = {};
    this.parent = parent;
    this.type = "Style";
};
Style.prototype.toString = function(){
    var out= "G:"+this.genreName+"S:"+this.name;
    out = out.replace(/\W+/g,"_");
    return out;
};
Style.prototype.equals = function(style){
    if(!(style instanceof Style)){
	return false;
    }else if(this.genreName != style.genreName){
	return false;
    }else if(this.name != style.name){
	return false;
    }else{
	return true;
    }
}
    Style.prototype.addArtist = function(artist){
	var artistName = artist.name;
	this.artists[artistName]=artist;
	return this;
    };

Style.prototype.getArtist = function(artistName){
    return this.artists[artistName];
};

Style.prototype.getArtists = function(){
    var artists = [];
    for(var artistName in this.artists){
	var artist = this.artists[artistName];
	artists.push(artist);
    }
    return artists;
};


Style.prototype.importFromJson= function(genreName,styleName,jStyle){
    for(var artistName in jStyle){
	var artist = new Artist(genreName,styleName,artistName,this);
	var releaseIndicies = jStyle[artistName];
	for(var i in releaseIndicies){
	    var releaseIndex = releaseIndicies[i];
	    artist.addReleaseIndex(releaseIndex);
	}
	this.addArtist(artist);
    }
};

/*****************************
 *********** Genre ***********
 *****************************/

function Genre(name,parent){
    this.name = name;
    this.parent = parent;
    this.styles = {};
    this.type = "Genre";
};

Genre.prototype.addStyle = function(style){
    var styleName = style.name;
    this.styles[styleName]=style;
    return this;
};

Genre.prototype.getStyle = function(styleName){
    return this.styles[styleName];
};

Genre.prototype.addArtist = function(styleName,artist){
    var style = this.getStyle(styleName);
    try{
	style.addArtist(artist);
    }catch(error){
	console.log("Error: Genre.addArtist: ",error);
    }
    return this;
};

Genre.prototype.getArtist = function(styleName,artistName){
    var style = this.getStyle(styleName);
    var artist;
    try{
	artist = style.getArtist(artistName);
    }catch(error){
	console.log("Error: Genre.getArtist: ",error);
    }
    return artist;
};

Genre.prototype.getStyle = function(styleName){
    return this.styles[styleName];
};

Genre.prototype.getStyles = function(){
    var styles = [];
    for(var styleName in this.styles){
	var style = this.styles[styleName];
	styles.push(style);
    }
    return styles;
};

Genre.prototype.importFromJson = function(genreName,jGenre){
    for(var styleName in jGenre){
	var jStyle = jGenre[styleName];
	var style = new Style(genreName,styleName,this);
	style.importFromJson(genreName,styleName,jStyle);
	this.addStyle(style);
    }
};


Genre.prototype.toString = function(){
    var out= "G:"+this.name ;
    out = out.replace(/\W+/g,"_");
    return out;
};
Genre.prototype.equals = function(genre){
    if(!(genre instanceof Genre)){
	return false;
    }else if(this.name != genre.name){
	return false;
    }else{
	return true;
    }
};


/*****************************
 ********* GenreTree *********
 *****************************/


function GenreTree(){
    this.genreTree = {};
    this.name="All Genres";
    this.type = "GenreTree";
};


GenreTree.prototype.toString = function(){
    return "BIG_DADDY_GENRE_TREE";
};

GenreTree.prototype.equals = function(genreTree){
    return genreTree instanceof GenreTree;
};

GenreTree.prototype.addGenre = function(genre){
    var genreName = genre.name;
    this.genreTree[genreName]=genre;
    return this;
};

GenreTree.prototype.getGenre = function(genreName){
    return this.genreTree[genreName];
};

GenreTree.prototype.addStyle = function(genreName,style){
    var genre = this.getGenre(genreName);
    try{
	genre.addStyle(style);
    }catch(error){
	console.log("Error: GenreTree.addStyle: ",error);
    }
    return this;
};

GenreTree.prototype.getStyle = function(genreName,styleName){
    var genre = this.getGenre(genreName);
    var style;
    try{
	style = genre.getStyle(styleName);
    }catch(error){
	console.log("Error: GenreTree.getStyle(): ",error);
    }
    return style;
};


GenreTree.prototype.addArtist = function(genreName,styleName, artist){
    var genre = this.getGenre(genreName);
    try{
	genre.addArtist(styleName,artist);
    }catch(error){
	console.log("Error: GenreTree.addArtist(): ",error);
    }
    return this;
};

GenreTree.prototype.getArtist = function(genreName,styleName, artistName){
    var genre = this.getGenre(genreName);
    var artist;
    try{
	artist = genre.getArtist(styleName,artistName);
    }catch(error){
	console.log("Error: GenreTree.getArtist(): ",error);
    }
    return artist;
};

GenreTree.prototype.importFromJson = function(json){
    for(var genreName in json){
	var jGenre = json[genreName];
	var genre = new Genre(genreName,this);
	genre.importFromJson(genreName,jGenre);
	this.addGenre(genre);
    }
};

GenreTree.prototype.getGenreReleaseIndicies = function(genreName){
    var genre = this.getGenre(genreName);
    var releaseIndiciesSet = {};
    var releaseIndicies =[];
    for(var styleName in genre.styles){
	var styleReleaseIndicies = this.getStyleReleaseIndicies(genreName,styleName);
	for(var i in styleReleaseIndicies){
	    var index = styleReleaseIndicies[i];
	    var isInSet = releaseIndiciesSet[index] != null;
	    if( !isInSet){
		releaseIndiciesSet[index] = true;
		releaseIndicies.push(index);
	    }
	}
    }
    return releaseIndicies;
};

GenreTree.prototype.getStyleReleaseIndicies = function(genreName,styleName){
    var style = this.getStyle(genreName,styleName);
    var releaseIndiciesSet = {};
    var releaseIndicies =[];
    var artists = style.artists;
    for(var artistName in style.artists){
	var artistReleaseIndicies = this.getArtistReleaseIndicies(genreName,styleName,artistName);
	for(var i in artistReleaseIndicies){
	    var index = artistReleaseIndicies[i];
	    var isInSet = releaseIndiciesSet[index] != null;
	    if( !isInSet){
		releaseIndiciesSet[index] = true;
		releaseIndicies.push(index);
	    }
	}
    }
    return releaseIndicies;
};

GenreTree.prototype.getArtistReleaseIndicies = function(genreName,styleName,artistName){
    var artist = this.getArtist(genreName,styleName,artistName);
    var releases =[];
    for(var i =0; i < artist.releaseIndicies.length;i++){
	releases.push(artist.releaseIndicies[i]);
    }
    return releases;
};

GenreTree.prototype.getGenres = function(){
    var genres = [];
    for(var genreName in this.genreTree){
	var genre = this.genreTree[genreName];
	genres.push(genre);
    }
    return genres;
};

/*****************************
 ****** Playlist Song ********
 *****************************/

function PlaylistSong(releaseIndex, genre,style,artist){
    this.releaseIndex = releaseIndex;
    this.genre = genre;
    this.style = style;
    this.artist = artist;
};


PlaylistSong.prototype.equals = function(o){
    if((o instanceof Artist)){
	var artist = o;
	if(this.artist != artist.name){
	    return false;
	}else if(this.style != artist.styleName){
	    return false;
	}else if(this.genre != artist.genreName){
	    return false;
	}else{
	    return true;
	}

    }else if((o instanceof Style)){
	var style = o;
	if(this.style !=style.name){
	    return false;
	}else if(this.genre != style.genreName){
	    return false;
	}else{
	    return true;
	}

    }else if((o instanceof Genre)){
	var genre =o;
	if(this.genre !=genre.name){
	    return false;
	}else{
	    return true;
	}
    }else{
	return false;
    }

}

    
/*****************************
 ********* Playlist **********
 *****************************/

    function Playlist(genreTree, releaseArray){
	this.releaseArray = releaseArray;
	this.genreTree = genreTree;

	this.xmlHttp=null;
	this.list= [];
	this.cur=0;
	this.playing=false;	
	this.loop=false;
	this.shuffle=false;
	this.selected=null;
	this.started=false;
	this.highlighted=null;
	this.highlightedListeners=[];
	this.songAddedListeners=[];
	this.selectedListeners=[];
	this.playingListeners=[];
	this.startedListeners=[];
	this.curListeners=[];
	this.errorListeners=[];
    };



Playlist.prototype.fireEvent = function(listeners,event){
    for(var i=0;i<listeners.length;i++){
	var fun = listeners[i];
	fun(event);
    }
};

Playlist.prototype.setPlaying = function(playing){
    if(playing!=this.playing){
	this.playing=playing;
	this.fireEvent(this.playingListeners,this.playing)
    }
};
Playlist.prototype.getPlaying = function(){
    return this.playing;
};


Playlist.prototype.setHighlighted = function(highlighted){
    if(highlighted!=this.highlighted){
	this.highlighted=highlighted;
	this.fireEvent(this.highlightedListeners,this.highlighted)
    }
};
Playlist.prototype.getHighlighted = function(){
    return this.highlighted;
};

Playlist.prototype.setStarted = function(started){
    if(started!=this.started){
	this.started=started;
	this.fireEvent(this.startedListeners,this.started);
    }
};
Playlist.prototype.getStarted = function(){
    return this.started;
};

Playlist.prototype.setSelected = function(selected){
    if(selected!=this.selected){
	this.selected=selected;
	this.fireEvent(this.selectedListeners,this.selected)
    }
};
Playlist.prototype.getSelected = function(){
    return this.selected;
};

Playlist.prototype.setCur = function(cur){
    if(cur!=this.cur){
	this.cur=cur;
	this.fireEvent(this.curListeners,this.cur)
    }
};
Playlist.prototype.getCur = function(){
    return this.cur;
};

Playlist.prototype.play = function(){
    this.setStarted(true);
    this.setPlaying(true);
    return this;
};

Playlist.prototype.stop = function(){
    this.setPlaying(false);
    this.setStarted(false);
    this.setCur(0);
    return this;
};

Playlist.prototype.pause = function(){
    this.setPlaying(false);
    return this;
};

Playlist.prototype.playNext = function(){
    if(this.started){
	var cur = this.getCur();
	if(cur< this.list.length-1){
	    this.setCur(cur+1);
	}else{
	    this.stop();
	}
    }
    return this;
};

Playlist.prototype.getNumSongs = function(){
    var length = this.list.length;
    return length;
};

Playlist.prototype.getCurrentSong = function(){
    var curSong;
    if(this.getCur()<this.list.length){
	curSong = this.getSong(this.getCur());
    }
    return curSong;
};


Playlist.prototype.getCurrentRelease = function(){
    var curRelease;
    if(this.cur<this.list.length){
	curSong = this.getCurrentSong();
	curRelease = this.getRelease(curSong.releaseIndex);
    }
    return curRelease;
};

Playlist.prototype.getSong = function(songIndex){
    var song;
    try{
	song= this.list[songIndex];
    }catch(error){
	console.log("Error: Playlist.getSong(): ",error);
    }
    return song;
};



Playlist.prototype.getRelease = function(releaseIndex){
    var release;
    try{
	release = this.releaseArray.getRelease(releaseIndex);
    }catch(error){
	console.log("Error: Playlist.getRelease(): ",error);
    }
    return release;
};



Playlist.prototype.addGenreSong = function(genreName){
    var releaseIndicies = this.genreTree.getGenreReleaseIndicies(genreName);
    return this.addRandomSong(releaseIndicies,genreName);
};

Playlist.prototype.addStyleSong = function(genreName,styleName){
    var releaseIndicies = this.genreTree.getStyleReleaseIndicies(genreName,styleName);
    return this.addRandomSong(releaseIndicies,genreName,styleName);
};

Playlist.prototype.addArtistSong = function(genreName,styleName, artistName){
    var releaseIndicies = this.genreTree.getArtistReleaseIndicies(genreName,styleName,artistName);
    return this.addRandomSong(releaseIndicies,genreName,styleName, artistName);
};

Playlist.prototype.addRandomSong = function(releaseIndicies, genreName,styleName,artistName){
    if(releaseIndicies.length ==0){
	this.fireEvent(this.errorListeners,"Error: All Songs in this category are unavailable");
	return;
    }
    var randomIndex = Math.floor(Math.random()*releaseIndicies.length);
    var randomReleaseIndex = releaseIndicies[randomIndex];
    var randomSong = new PlaylistSong(randomReleaseIndex,genreName,styleName,artistName);
    var release = this.getRelease(randomReleaseIndex);
    var videoId = release.videoId;
    var playlist = this;

    var callback= function() 
    {
	if (this.readyState == 4 && this.status == 200 ){
	    if ( this.responseText != "Not found" ){
		var videoJSON = eval(this.responseText);
		if(videoJSON.error){
		    console.log("DOESNT WORK:"+ release.artist + " "+videoId);
		    releaseIndicies.splice(randomIndex,1);
		    playlist.addRandomSong(releaseIndicies, genreName,styleName,artistName);
		}else{
		    console.log("WORKS:"+ release.artist+ " "+videoId);
		    playlist.list.push(randomSong);
		    var songIndex = playlist.list.length-1;
		    playlist.fireEvent(playlist.songAddedListeners,songIndex);
		}
	    }                    
	}
    };
    this.checkVideoExists(videoId,callback);
};

Playlist.prototype.checkVideoExists = function(videoId,callback)
{
    var Url = "https://gdata.youtube.com/feeds/api/videos/"+videoId+"?v=2&alt=jsonc&callback=eval"
    console.log(Url);
    this.xmlHttp = new XMLHttpRequest(); 
    this.xmlHttp.onreadystatechange =callback;
    this.xmlHttp.open( "GET", Url, true );
    this.xmlHttp.send( null );

}
