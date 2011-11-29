/************************
 ******* Release ********
 ************************/

function Release(name, year, url,genres,styles,artist){
    this.name = name;
    this.artist = artist;
    this.genres = genres;
    this.styles = styles;
    this.year = year;
    this.url = url;
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
	var url = jRelease["url"];
	var artist = jRelease["artist"];
	var styles = jRelease["styles"];
	var genres = jRelease["genres"];

	var release = new Release(name,year,url,genres,styles,artist);
	this.appendRelease(release);
    }
    return this;
};

/*****************************
 *********** Artist **********
 *****************************/


function Artist (genreName,styleName,name){
    this.styleName =styleName;
    this.genreName = genreName;
    this.name = name;
    this.releaseIndicies = [];
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
}


/*****************************
 *********** Style ***********
 *****************************/

function Style(genreName,name){
    this.genreName = genreName;
    this.name = name;
    this.artists = {};
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
	var artist = new Artist(genreName,styleName,artistName);
	var releaseIndicies = jStyle[artistName];
	for(var i in releaseIndicies){
	    var releaseIndex = releaseIndicies[i];
	    artist.addReleaseIndex(releaseIndex);
	}
	this.addArtist(artist);
    }
}

/*****************************
 *********** Genre ***********
 *****************************/

    function Genre(name){
	this.name = name;
	this.styles = {};
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
	var style = new Style(genreName,styleName);
	style.importFromJson(genreName,styleName,jStyle);
	this.addStyle(style);
    }
};

Genre.prototype.equals = function(genre){
    if(!(genre instanceof Genre)){
	return false;
    }else if(this.name != genre.name){
	return false;
    }else{
	return true;
    }
}


/*****************************
 ********* GenreTree *********
 *****************************/


function GenreTree(){
    this.genreTree = {};
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
	var genre = new Genre(genreName);
	genre.importFromJson(genreName,jGenre);
	this.addGenre(genre);
    }
};

/*

// Old way of importing

GenreTree.prototype.importGenreTreeFromJson = function(json){
for(var genreName in json){
var genre = new Genre(genreName);
this.addGenre(genre);
var jGenre = json[genreName];
for(var styleName in jGenre){
var style = new Style(styleName);
this.addStyle(genreName,style);
var jStyle = jGenre[styleName]
for(var artistName in jStyle){
var artist = new Artist(artistName);
var releaseIndicies = jStyle[artistName];
for(var i in releaseIndicies){
var releaseIndex = releaseIndicies[i];
artist.addReleaseIndex(releaseIndex);
}
this.addArtist(genreName,styleName,artist);
}
}
}
};*/


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
    var releases = artist.releaseIndicies;
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
    
/*****************************
 ********* Playlist **********
 *****************************/

function Playlist(genreTree, releaseArray,onAdd){
    this.releaseArray = releaseArray;
    this.genreTree = genreTree;
    this.list= [];
    this.cur=0;
    this.replay=false;
    this.shuffle=false;
    this.onAdd=onAdd;
};


Playlist.prototype.playNext = function(){
    this.cur++;
    return this;
};

Playlist.prototype.numSongs = function(){
    var length = this.list.length;
    return length;
};

Playlist.prototype.getCurrentSong = function(){
    var curSong = this.getSong(this.cur);
    return curSong;
};

Playlist.prototype.getCurrentRelease = function(){
    var curRelease = this.getRelease(this.cur);
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



Playlist.prototype.getRelease = function(songIndex){
    var song = this.list[songIndex];
    var release;
    try{
	var releaseIndex = song.releaseIndex;
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
    var randomIndex = Math.floor(Math.random()*releaseIndicies.length);
    var randomReleaseIndex = releaseIndicies[randomIndex];
    var randomSong = new PlaylistSong(randomReleaseIndex,genreName,styleName,artistName);
    this.list.push(randomSong);
    this.onAdd();
    return randomSong;
};
