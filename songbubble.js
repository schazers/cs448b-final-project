var SONGBUUBBLE_BRIGHTEN_CONSTANT=0.3;

var r = 700,
    format = d3.format(",d"),
    fill = d3.scale.category20c();

genreTree.x=r/2;
genreTree.y=r/2;
genreTree.r=r/2;
var bubble = d3.layout.pack()
    .sort(null)
    .size([r, r])
    .value(function(d) { return d.name.length; });

var vis = d3.select("#container").append("svg:svg")
    .attr("width", r)
    .attr("height", r)
    .attr("class", "bubble")
    .attr("transform", "translate(" + r / 2 + "," + r / 2 + ") scale(0.5)");

function displayParentBubbleData(data){
    var parentNodeData = vis.selectAll("g.parentNode")
	.data([data],function(d){
		return d.toString()});
    var parentNode = parentNodeData
	.enter().insert("svg:g","g.node")
	.attr("id","parentNode")
	.attr("class","parentNode")
	.attr("transform", "translate(" + r / 2 + "," + r / 2 + ") scale(1)")
	.style("position","relative")
	.style("z-index","-1")
	.style("fill", function(d) { 
		return fill(d.name); 
	    })
	.on("mouseover",function(d){d3.select(this).select("circle").style("fill",d3.rgb(fill(d.name)).brighter(SONGBUUBBLE_BRIGHTEN_CONSTANT))})
	.on("mouseout",function(d){d3.select(this).select("circle").style("fill",fill(d.name))})
	.on("click",handleParentBubbleClicked);
    
    parentNode.append("svg:circle")
	.attr("r",r/2);
    parentNode.transition().duration(4000);
    parentNodeData.exit().transition().duration(4000).remove();
}


displayBubbleData(genreTree,true);

function handleParentBubbleClicked(d,i){
    if(d instanceof Style){
	var style = d;
	var genre = genreTree.getGenre(style.genreName);
	displayBubbleData(genre,false);
    }else if(d instanceof Genre){
	displayBubbleData(genreTree,false);
    }
}
function handleChildBubbleClicked(d,i){
    if(!(d instanceof Artist)){
	displayBubbleData(d,true);
    }
}

var so = d3.scale.linear().range([0,1]);
function displayBubbleData(parentData,down){
    displayParentBubbleData(parentData,down);
    displayChildrenBubbleData(parentData,down);
}
function displayChildrenBubbleData(parent,child,down){
    var bubbleData=getBubbleData(parent);

    var nodeData = vis.selectAll("g.node")
	.data(bubbleData,function(d){return d.toString()});
    
    var node =  nodeData
	.enter().append("svg:g")
	.style("fill-opacity","0")
	.style("stroke-opacity","0")
	.attr("class", "node")
	.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
	.on("mouseover",function(d){d3.select(this).select("circle").style("fill",d3.rgb(fill(d.name)).brighter(SONGBUUBBLE_BRIGHTEN_CONSTANT))})
	.on("mouseout",function(d){d3.select(this).select("circle").style("fill",fill(d.name))})
	.on("click",handleChildBubbleClicked);

    node.append("svg:title")
	.text(function(d) { return d.name + ": " + format(1); });
    
    node.append("svg:circle")
	.attr("r", function(d) { return d.r; })
	.style("fill", function(d) { return fill(d.name); });
    
    node.append("svg:text")
	.attr("text-anchor", "middle")
	.attr("dy", ".3em")
	.attr("fill", "#000000")
	.text(function(d) { 
		return d.name.substring(0, d.r / 3); }
	    );
    if(down){
	node.transition()
	    .duration(4000)
	    .attrTween("transform",childTweenLower(data,true))
	    .style("fill-opacity",1)
	    .style("stroke-opacity",1);
	nodeData.exit()
	    .transition()
	    .duration(4000)
	    .attrTween("transform",childTweenUpper(data,false)).remove()
	    .style("fill-opacity",0)
	    .style("stroke-opacity",0);
    }else{

	node.transition()
	    .duration(4000)
	    .attrTween("transform",childTweenUpper(data,true))
	    .style("fill-opacity",1)
	    .style("stroke-opacity",1);

	nodeData.exit()
	    .transition()
	    .duration(4000)
	    .attrTween("transform",childTweenLower(data),false).remove()
	    .style("fill-opacity",0)
	    .style("stroke-opacity",0);;
    }
}


function childTweenLower(parent,coming){

    return function(d){
	var translateSX;
	var translateSY;
	var scaleS;

	if(coming){
	    translateSX = d3.scale.linear().range([parent.x,d.x]);
	    translateSY = d3.scale.linear().range([parent.y,d.y]);
	    scaleS = d3.scale.linear().domain([0,1]).range([0,1]);
	}else{
	    translateSX = d3.scale.linear().range([d.x,parent.x]);
	    translateSY = d3.scale.linear().range([d.y,parent.y]);
	    scaleS = d3.scale.linear().domain([0,1]).range([1,0]);
	}
	return function(t){
	    var scale = scaleS(t);
	    var tx = translateSX(t);
	    var ty = translateSY(t);
	    var newTran = "translate(" +tx+","+ty+ ") scale("+scale+")";
	    return newTran;
	};
    }
}

function childTweenUpper(parent,coming){

    return function(d){
	if(coming){
	    parent = d.parent;
	}
	var destX;
	var destY;
	var destScale = (r/2)/parent.r;
	if(d.equals(parent)){
	    destX=r/2;
	    destY=r/2;
	}else{
	    var dxParent = d.x-parent.x;
	    var dyParent = d.y-parent.y;
	    
	    var newDx = dxParent*destScale;
	    var newDy = dyParent*destScale;
 	    destX = r/2 + newDx;
 	    destY = r/2 + newDy;
	    
	}
	var translateSX;
	var translateSY;
	var scaleS;

	if(coming){
	    translateSX = d3.scale.linear().range([destX,d.x]);
	    translateSY = d3.scale.linear().range([destY,d.y]);
	    scaleS = d3.scale.linear().domain([0,1]).range([destScale,1]);	
	}else{
	    translateSX = d3.scale.linear().range([d.x,destX]);
	    translateSY = d3.scale.linear().range([d.y,destY]);
	    scaleS = d3.scale.linear().domain([0,1]).range([1,destScale]);	
	    
	}

	return function(t){
	    var scale = scaleS(t);
	    var tx = translateSX(t);
	    var ty = translateSY(t);
	    var newTran = "translate(" +tx+","+ty+ ") scale("+scale+")";
	    return newTran;
	};
    }
}

// Returns a flattened hierarchy containing all leaf nodes under the root.
function getBubbleData(data){
    var root={};
    root.children=[];
    
    if(data instanceof GenreTree){
	var genreTree = data;
	root.children = genreTree.getGenres();
    }if(data instanceof Genre){
	var genre = data;
	root.children =genre.getStyles();
    }if(data instanceof Style){
	var style = data;
	root.children = style.getArtists();
    }
    var bubbleData = bubble.nodes(root).filter(
					       function(d) { 
						   return !d.children; 
					       });
    return bubbleData;
}
