
var LIST_ITEM_HIGHLIGHT_COLOR = "#DDDDFF";
var LIST_ITEM_SELECT_COLOR = "#CCCCDE";

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


function initSongList(){
    
    d3.select("#container").selectAll("*").remove();
    createList("Genre",GENRE_UL_CLASS);
    createList("Style",STYLE_UL_CLASS+" "+NON_GENRE_UL_CLASS);
    createList("Artist",ARTIST_UL_CLASS+" "+NON_STYLE_UL_CLASS+" "+NON_GENRE_UL_CLASS);
    setListStyle();
    displayGenres();
}


function createList(type,listClass){
    var div = d3.select("#container").append("div")
	.attr("id",type+"Div")
	.attr("class","listDiv");

    var header =  div.append("ul")
	.attr("id",type+"Header")
	.attr("class","listHeader list");
    header.append("li")
	.text(type);
    header.append("li");
    var list =  div.append("ul")
	.attr("id",type+"List")
	.attr("class","ullist list "+listClass);
}


function setListStyle(){
    d3.selectAll(".listDiv")
	.style("float","left")
	.style("width", "250px");
    d3.selectAll(".ullist")
	.style("height","612px")
	.style("overflow","auto");
    d3.selectAll(".list")
	.style("width","150px")
	.style("list-style-position","inside")
	.style("list-style-type","none")
	.style("text-align","center");

    d3.selectAll(".listHeader")
	.style("font-size","x-large");
}




function highlightListItem(d,i){
    d3.select( this ).style( "background",LIST_ITEM_HIGHLIGHT_COLOR );
}

function deHighlightListItem(d,i){
    var isSelected = d3.select( this ).attr("selected");
    if(isSelected=="true"){
	d3.select( this ).style( "background",LIST_ITEM_SELECT_COLOR );
    }else{
	d3.select( this ).style( "background","#EEEEEE" );
    }
}

function selectItem(d,i){

    if(event instanceof MouseEvent && event.shiftKey && !(d instanceof GenreTree)){
	addSong(d);
    }
    d3.select(this.parentNode)
	.selectAll("li")
	.attr("selected","false")
	.style( "background", "#EEEEEE" );
    
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
	}
    }else if(d instanceof Style){
    	var style = d;
	if(textlist_selected_style == null || !textlist_selected_style.equals(style)){
	    // remove items from non genre list
	    textlist_selected_style = style;
	    textlist_selected_artist = null;
	    displayArtists(style);
	}
    }else if(d instanceof Artist){
	var artist = d;
	if(textlist_selected_artist == null || !textlist_selected_artist.equals(artist)){
	    // remove items from non genre list
	    textlist_selected_artist = artist;
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

}