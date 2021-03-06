
var SONGBURST_BRIGHTEN_CONSTANT=0.3;
var container = d3.select("#container");
var r = Math.min(w, h) / 2,
    x = d3.scale.linear().range([0, 2 * Math.PI]),
    y = d3.scale.sqrt().range([0, r]),
    color = d3.scale.category20c();

var partition = d3.layout.partition()
    .children(function(d){
	    if(d instanceof GenreTree){
		return d.getGenres();
	    }if(d instanceof Genre){
		return d.getStyles();
	    }if(d instanceof Style){
		var artists=d.getArtists();
		var index = Math.random()*(artists.length-maxNumArtists);
		index = index>0 ? index : 0;
		return artists.slice(index,index+maxNumArtists);
		return d.getArtists();
	    }else{
	    }
	    return d;
	})
    .value(function(d) { return 1; });




var arc = d3.svg.arc()
    .startAngle(function(d) { 
	    return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { 
	    return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { 
	    return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { 
	    return Math.max(0, y(d.y + d.dy)); });


var textArc = d3.svg.arc1d()
    .startAngle(function(d) { 
	    return Math.max(0, Math.min(2 * Math.PI, x(d.x+3/4*d.dx))); })
    .endAngle(function(d) { 
	    return Math.max(0, Math.min(2 * Math.PI, x(d.x + 1/4*d.dx))); })
    .radius(function(d) { 
	    return Math.max(0, y(d.y+d.dy/3)); });
var path;
var labels;
var textPaths;
function initSongBurst(){
    playlist.highlightedListeners= [handlePlaylistSongHighlightedSongburst];
    d3.select("#container").selectAll("*").remove();
    var vis = d3.select("#container").append("svg:svg")
	.attr("id","vis")
	.attr("width", w)
	.attr("height", h)
	.append("svg:g")
	.attr("id","vis")
	.attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

    path = vis.data([genreTree]).selectAll("path")
	.data(partition.nodes,function(d,i){return i})
	.enter().append("svg:path")
	.attr("d", arc)
	.style("fill", function(d) { 
		return color((d.children ? d : d.parent).name); }
	    )
	.style("stroke","#fff")
	.style("fill-rule","evenodd")
	.on("mouseover",highlightBurst)
	.on("mouseout",deHighlightBurst)
	.on("click", click);


    textPaths = vis.data([genreTree]).selectAll("path.textPathArcs")
	.data(partition.nodes,function(d,i){return i*2})
	.enter()
	.append("svg:path")
	.attr("id",getNodeName)
	.attr("class","textPathArcs")
	.attr("d", textArc)
	.style("fill","none");



    labels = vis.data([genreTree]).selectAll("text")
	.data(partition.nodes)
	.enter()
	.append("svg:text")
	.attr("id",getLabelName)
	.attr("font-family","Verdana")
	.append("svg:textPath")
	.attr("xlink:href",getNodeId)
	.text(getLabelText);

}

function refreshLineText(){
    return d3.select(this).text();
}
function getNodeId(d,i){
    return "#"+getNodeName(d,i);  
}

function getNodeName(d,i){
    if(d.toString){
	return d.toString();
    }else{
	return i;
    }
}
function getLabelName(d,i){
    if(d.toString){
	return "L:"+d.toString();
    }else{
	return i;
    }
}

function getLabelText(d,i){
    if(i==0){
	return "Music";
    }else{
	return d.name;
    }
}
function handlePlaylistSongHighlightedSongburst(index){

    if(index!=null){
	var song = playlist.getSong(index);
    
	path.style("fill", function(d) { 
		var cc = d3.rgb(color((d.children ? d : d.parent).name));
		var drawnFrom=song.equals(d)
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
	    addSong(d);
	}else{
	    path.attr("d", arcTween(d));
	    textPaths.attr("d", textArcTween(d));
	    labels.text(getLabelText);
	}
    }
};



function arcTween(d) {
    var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
	yd = d3.interpolate(y.domain(), [d.y, 1]),
	yr = d3.interpolate(y.range(), [d.y ? 20 : 0, r]);
    return function(d, i) {
	if(i){
	    return arc(d);
	}else{
	    x.domain(xd(1)); 
	    y.domain(yd(1)).range(yr(1)); 
	    return arc(d); 
	}
    };
}

function textArcTween(d) {
    var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
	yd = d3.interpolate(y.domain(), [d.y, 1]),
	yr = d3.interpolate(y.range(), [d.y ? 20 : 0, r]);
    return function(d, i) {
	if(i){
	    return textArc(d);
	}else{
	    x.domain(xd(1)); 
	    y.domain(yd(1)).range(yr(1)); 
	    return textArc(d); 
	}
    };
}

