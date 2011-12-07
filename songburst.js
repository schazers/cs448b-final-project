playlist.highlightedListeners.push(handlePlaylistSongHighlighted);
var SONGBURST_BRIGHTEN_CONSTANT=0.3;
var container = d3.select("#container");
var sunchart = container.append("div")
    .attr("id","sunchart");

var w = 960,
    h = 700,
    r = Math.min(w, h) / 2,
    x = d3.scale.linear().range([0, 2 * Math.PI]),
    y = d3.scale.sqrt().range([0, r]),
    color = d3.scale.category20c();

var vis = sunchart.append("svg:svg")
    .attr("width", w)
    .attr("height", h)
    .append("svg:g")
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

var partition = d3.layout.partition()
    .children(function(d){
	    if(d instanceof GenreTree){
		return d.getGenres();
	    }if(d instanceof Genre){
		return d.getStyles();
	    }if(d instanceof Style){
		return d.getArtists();
	    }else{
	    }
	    return d;
	})
    .value(function(d) { return 1; });

var abc  = partition.nodes(genreTree);
var arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

var path = vis.data([genreTree]).selectAll("path")
    .data(partition.nodes)
    .enter().append("svg:path")
    .attr("d", arc)
    .style("fill", function(d) { 
	    return color((d.children ? d : d.parent).name); }
	)
    .style("stroke","#fff")
    .style("fill-rule","venodd")
    .on("mouseover",highlightBurst)
    .on("mouseout",deHighlightBurst)
    .on("click", click);


function handlePlaylistSongHighlighted(index){
    if(index!=null){
	var song = playlist.getSong(index);
	var releaseIndex  = song.releaseIndex;
	var release = playlist.getRelease(releaseIndex);
    
	path.style("fill", function(d) { 
		var cc = d3.rgb(color((d.children ? d : d.parent).name));
		var drawnFrom=release.equals(d)
		    if(drawnFrom){
			return cc.brighter(SONGBURST_BRIGHTEN_CONSTANT);
		    }else{
			return cc;
		    }
	    } );
    }else{
	path.style("fill", function(d) { 
		return color((d.children ? d : d.parent).name); }
	    );
    }
}

function highlightBurst(d,i){
    if(!(d instanceof GenreTree)){
    d3.select( this ).style("fill", function(d) { 
		return d3.rgb(color((d.children ? d : d.parent).name)).brighter(SONGBURST_BRIGHTEN_CONSTANT);
	    });
    }
}

function deHighlightBurst(d,i){
    d3.select( this ).style("fill", function(d) { 
		return d3.rgb(color((d.children ? d : d.parent).name));
	});
}

function click(d) {
    if(event instanceof MouseEvent){

	if(event.shiftKey){
	    addSong(d)
		}else{
	    path.transition()
		.duration(300)
		.attrTween("d", arcTween(d));
	}
    }
};


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

// Interpolate the scales!
function arcTween(d) {
    var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
	yd = d3.interpolate(y.domain(), [d.y, 1]),
	yr = d3.interpolate(y.range(), [d.y ? 20 : 0, r]);
    return function(d, i) {
	return i
	    ? function(t) { return arc(d); }
        : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
    };
}