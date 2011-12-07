
var LIST_ITEM_HIGHLIGHT_COLOR = "#5CB3FF";
var LIST_ITEM_SELECT_COLOR = "#2B60DE";

var GENRE_UL_CLASS = "genreUL";
var NON_GENRE_UL_CLASS = "nonGenreUL";

var STYLE_UL_CLASS = "styleUL";
var NON_STYLE_UL_CLASS = "nonStyleUL";

var ARTIST_UL_CLASS = "artistUL";
var NON_ARTIST_UL_CLASS = "nonArtistUL";

var GENRE_LI_CLASS = "genreLI";
var NON_GENRE_LI_CLASS = "nonGenreLI";

var STYLE_LI_CLASS = "styleLI";
var NON_STYLE_LI_CLASS = "nonStyleLI";

var ARTIST_LI_CLASS = "artistLI";
var NON_ARTIST_LI_CLASS = "nonArtistLI";


var listNames = ["genre","style","artist"];
var genres = ["rock","hip hop","jazz","cool"];

var textlist_selected_genre;
var textlist_selected_style;
var textlist_selected_artist;

var body = d3.select("body").style("background",BACKGROUND_COLOR);

createList("Genre",GENRE_UL_CLASS);
createList("Style",STYLE_UL_CLASS+" "+NON_GENRE_UL_CLASS);
createList("Artist",ARTIST_UL_CLASS+" "+NON_STYLE_UL_CLASS+" "+NON_GENRE_UL_CLASS);
setListStyle();
displayGenres();


var genreList2 = d3.select("#GenreList");
function createList(type,listClass){
    var container = d3.select("#container");    
    var div = container.append("div")
	.attr("id",type+"Div")
	.attr("class","listDiv");

    var header =  div.append("ul")
	.attr("id",type+"Header")
	.attr("class","listHeader list");
    header.append("li")
	.text(type);
    header.append("li")
	.append("button")
	.text("Add")
	.attr("id",type+"Button")
	.attr("disabled","disabled")
	.on("click",addSong);
    var list =  div.append("ul")
	.attr("id",type+"List")
	.attr("class","list "+listClass);
}


function setListStyle(){
    d3.selectAll(".listDiv")
	.style("float","left");
    d3.selectAll(".list")
	.style("list-style-position","inside")
	.style("list-style-type","none")
	.style("text-align","center");
    d3.selectAll(".listHeader")
	.style("font-size","x-large");
}



function addSong(){
    var id = d3.select( this ).attr( "id");
    if(id == "GenreButton"){
	var genre = textlist_selected_genre;
	if(genre!=null){
	    playlist.addGenreSong(genre.name);
	}
    }else if(id == "StyleButton"){
	var style = textlist_selected_style;
	if(style!=null){
	    playlist.addStyleSong(style.genreName,style.name);
	}
    }else if(id == "ArtistButton"){
	var artist = textlist_selected_artist;
	if(artist!=null){
	    playlist.addArtistSong(artist.genreName,artist.styleName,artist.name);
	}
    }
}

function highlightListItem(d,i){
    d3.select( this ).style( "background",LIST_ITEM_HIGHLIGHT_COLOR );
}

function deHighlightListItem(d,i){
    var isSelected = d3.select( this ).attr("selected");
    if(isSelected=="true"){
	d3.select( this ).style( "background",LIST_ITEM_SELECT_COLOR );
    }else{
	d3.select( this ).style( "background",BACKGROUND_COLOR );
    }
}

function selectItem(d,i){
    d3.select(this.parentNode)
	.selectAll("li")
	.attr("selected","false")
	.style( "background",BACKGROUND_COLOR );
    
    d3.select( this ).style( "background",LIST_ITEM_SELECT_COLOR )
	.attr("selected","true");

    if(d instanceof Genre){
	var genre = d;
	if(textlist_selected_genre == null || !textlist_selected_genre.equals(genre)){
	    // remove items from non genre list
	    textlist_selected_genre = genre;
	    textlist_selected_style = null;
	    textlist_selected_artist = null;
	    displayStyles(genre);
	    var style = new Style("","");
	    displayArtists(style);
	    d3.select("#GenreButton")
		.attr("disabled",null);
	}
    }else if(d instanceof Style){
    	var style = d;
	if(textlist_selected_style == null || !textlist_selected_style.equals(style)){
	    // remove items from non genre list
	    textlist_selected_style = style;
	    textlist_selected_artist = null;
	    displayArtists(style);
	    d3.select("#StyleButton")
		.attr("disabled",null);
	}
    }else if(d instanceof Artist){
	var artist = d;
	if(textlist_selected_artist == null || !textlist_selected_artist.equals(artist)){
	    // remove items from non genre list
	    textlist_selected_artist = artist;
	    d3.select("#ArtistButton")
		.attr("disabled",null);
	}
    }
}


function displayGenres(){
    var genreList = d3.select("#GenreList");
    var genres = genreTree.getGenres();
    genreList.selectAll("li")
	.data(genres,function(d){return d.name})
	.enter().append("li")
	.attr("selected","false")
	.text(function(d){
		return d.name;
	    })
	.on("mouseover",highlightListItem)
	.on("mouseout",deHighlightListItem)
	.on("click",selectItem);

}

function displayStyles(genre){
    var styleList = d3.select("#StyleList");
    var styles =genre.getStyles();
    styleList.selectAll("li")
	.data(styles,getStyleKey)
	.enter().append("li")
	.attr("selected","false")
	.text(function(d){return d.name})
	.on("mouseover",highlightListItem)
	.on("mouseout",deHighlightListItem)
	.on("click",selectItem);

    styleList.selectAll("li")
	.data(styles,getStyleKey)
	.exit().remove();

    d3.select("#StyleButton")
	.attr("disabled","disabled");

}
function getStyleKey(style){
    var key = style.genreName+"_"+style.name;
    return key;
}
function getArtistKey(artist){
    var key = artist.genreName+"_"+artist.styleName+"_"+artist.name;
    return key;
}

function displayArtists(style){
    var artistList = d3.select("#ArtistList");
    var artists =style.getArtists();
    artistList.selectAll("li")
	.data(artists,getArtistKey)
	.enter().append("li")
	.attr("selected","false")
	.text(function(d){return d.name})
	.on("mouseover",highlightListItem)
	.on("mouseout",deHighlightListItem)
	.on("click",selectItem);

    artistList.selectAll("li")
	.data(artists,getArtistKey)
	.exit().remove();

    d3.select("#ArtistButton")
	.attr("disabled","disabled");
}