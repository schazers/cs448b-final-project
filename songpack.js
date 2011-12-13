var SONGBUBBLE_BRIGHTEN_CONSTANT=0.3;
var SONGBUBBLE_TRANSITION_TIME=1000;
var SONGBUBBLE_ADD_BUTTON_CLASS="AddButton";
var maxNumArtists = 20;
var format = d3.format(",d"),
    fill = d3.scale.category20c();

var pack = d3.layout.pack()
    .size([w ,h])
    .children(function(d,depth){
	    if(depth== 0){
		if(d instanceof GenreTree){
		    return d.getGenres();
		}else if(d instanceof Genre){
		    return d.getStyles();
		}else if(d instanceof Style){
		    var artists=d.getArtists();
		    var index = Math.random()*(artists.length-maxNumArtists);
		    index = index>0 ? index : 0;
		    return artists.slice(index,index+maxNumArtists);
		}else{
		    return null;
		}
	    }else{
		d.children=null;
		return [];
	    }
	})
    .value(function(d) { 
	    return 1; 
	});


function initSongPack(){
    playlist.highlightedListeners= [handlePlaylistSongHighlightedSongpack];
    d3.select("#container").selectAll("*").remove();
    var vis = d3.select("#container").append("svg:svg")
	.attr("id","vis")
	.attr("width", w)
	.attr("height", h)
	.append("svg:g");
    vis.append("svg:text")
	.attr("id","parentTitle")
	.attr("x",0)
	.attr("y",20)
	.style("font-size","30")
	.text("Music");
    genreTree.x=w/2;
    genreTree.y=h/2;
    genreTree.r=w/2;
    var enterTween = tweenLower(genreTree,genreTree.x,genreTree.y,genreTree.r,1);
    var stayTween = tweenStay(genreTree,genreTree.x,genreTree.y,genreTree.r,1);
    var exitTween = tweenUpper(genreTree,genreTree.x,genreTree.y,genreTree.r,1);
    displayBubbleData(genreTree,enterTween,stayTween,exitTween);
}


function handlePlaylistSongHighlightedSongpack(index){

    if(index!=null){
	var song = playlist.getSong(index);
	d3.selectAll(".node").fill(function(d){
		var drawnFrom=song.equals(d)
		    if(dranFrom){
			return d3.rgb(fill(d.name)).brighter(SONGBUBBLE_BRIGHTEN_CONSTANT)
		    }else{
			return fill(d.name);
		    } 
	    });
    }else{
	d3.selectAll(".node").fill(function(d){
			return fill(d.name);
	    });

    }
}


function handleBubbleClicked(d,i){
    if(event instanceof MouseEvent){

	if(event.shiftKey && !(d instanceof GenreTree)){
	    addSong(d);
	}else{
	    if(d.depth ==0 && !(d instanceof GenreTree)){
		var enterTween = tweenUpper(d,d.x,d.y,d.r,d.depth);
		var stayTween = tweenStay(d,d.x,d.y,d.r,d.depth);
		var exitTween = tweenLower(d,d.x,d.y,d.r,d.depth);
		displayBubbleData(d.parent,enterTween,stayTween,exitTween);
	    }else if(d.depth==1 && !(d instanceof Artist)){
		var enterTween = tweenLower(d,d.x,d.y,d.r,d.depth);
		var stayTween = tweenStay(d,d.x,d.y,d.r,d.depth);
		var exitTween = tweenUpper(d,d.x,d.y,d.r,d.depth);
		displayBubbleData(d,enterTween,stayTween,exitTween);
	    }
	}
    }
}


function handleLeafMouseover(d,i){
    d3.select(this).select("circle").style("fill",d3.rgb(fill(d.name)).brighter(SONGBUBBLE_BRIGHTEN_CONSTANT));
}

function handleLeafMouseout(d,i){
    d3.select(this).select("circle").style("fill",fill(d.name));
}
function displayBubbleData(parent,enterTween,stayTween,exitTween){
    var vis = d3.select("#vis");
    var nodeData = vis.data([parent]).selectAll("g.node")
	.data(pack.nodes,function(d,i){
		return d.toString();
	    });

    d3.select("#parentTitle").text(parent.name);
    nodeData
	.attr("class", function(d) { return d.depth ?  "leaf node":"parent node"; })
	.attr("transform", function(d) { return "scale(0)"; });


    nodeData.select("circle")
	.attr("r", function(d) { return d.r; });

    nodeData.select("title")
	.text(function(d) { return d.name + (d.children ? "" : ": " + format(d.name.length)); });

    nodeData.select("text")
	.attr("text-anchor", "middle")
	.style("fill","#000000")
	.attr("dy", ".3em")
	.text(function(d) {return ""} );

    var node = nodeData.enter().append("svg:g")
	.style("fill-opacity","0")
	.style("stroke-opacity","0")
	.on("click",handleBubbleClicked)
	.attr("class", function(d) { return d.depth ? "leaf node" : "parent node"; })
	.attr("transform", function(d) { return "scale(0)"; })
	.style("fill", function(d) { 
		return fill(d.name); 
	    });

    vis.selectAll("g.parent")
	.on("mouseover",function(d){d3.select(this).select("circle").style("fill",d3.rgb(fill(d.name)).brighter(SONGBUBBLE_BRIGHTEN_CONSTANT))})
	.on("mouseout",function(d){d3.select(this).select("circle").style("fill",fill(d.name))})
	.selectAll("."+SONGBUBBLE_ADD_BUTTON_CLASS)
	.remove();

    vis.selectAll("g.leaf")
	.on("mouseover",handleLeafMouseover)
	.on("mouseout",handleLeafMouseout)
	.selectAll("."+SONGBUBBLE_ADD_BUTTON_CLASS)
	.remove();

    var elems = vis.selectAll("g.leaf")[0];
    for(var i=0;i<elems.length;i++){
	var elem = elems[i];
	if(elem){
	    elem.parentNode.appendChild(elem);
	}
    }

    node.append("svg:title")
	.text(function(d) { return d.name + (d.children ? "" : ": " + format(d.name.length)); });
	
    node.append("svg:circle")
	.style("fill", function(d) { 
		return fill(d.name); 
	    })
	.attr("r", function(d) { return d.r; });
    
    node.append("svg:text")
	.attr("text-anchor", "middle")
	.style("fill","#000000")
	.attr("dy", ".3em")
	.text(function(d) { return d.name.substring(0, d.r / 3); });
    
    vis.selectAll("g.leaf").selectAll("text")
	.on("mouseover",handleLeafMouseover)
	.on("mouseout",handleLeafMouseout)
	.attr("text-anchor", "middle")
	.style("fill","#000000")
	.attr("dy", ".3em")
	.text(function(d) { return d.name.substring(0, d.r / 3); });

    nodeData.transition()
	.duration(SONGBUBBLE_TRANSITION_TIME)
	.attrTween("transform",stayTween);

    node.transition()
	.duration(SONGBUBBLE_TRANSITION_TIME)
	.attrTween("transform",enterTween)
	.style("opacity",1)
	.style("fill-opacity",1)
	.style("stroke-opacity",1);

    nodeData.exit()
	.transition()
	.duration(SONGBUBBLE_TRANSITION_TIME)
	.attrTween("transform",exitTween)
	.style("opacity",0)
	.style("fill-opacity",0)
	.style("stroke-opacity",0).remove();
}


function genrateTween(translateSX,translateSY,scaleS){
    return function(t){
	var scale = scaleS(t);
	var tx = translateSX(t);
	var ty = translateSY(t);
	var newTran = "translate(" +tx+","+ty+ ") scale("+scale+")";
	return newTran;
    };
}

function tweenLower(anchor,anchorX,anchorY,anchorR,anchorDepth){
    return function(d){
	var isAnchor = anchor.equals(d);
	var translateSX,translateSY,scaleS,srcX,dstX,srcY,dstY,srcScale,dstScale;
	if(anchorDepth==0){
	    // parent was selected, moving exiting elements down

	    // go from where you were to where anchor is supposed to be (parent turning to child)
	    srcScale = 1;
	    dstScale = 0;
	    srcX=d.x;	
	    srcY=d.y;
	    dstX=anchor.x;
	    dstY=anchor.y;
	}else{
	    // go from where you were to where anchor was to where you are supposed to be (parent turning to child)
	    srcScale = 0;
	    dstScale = 1;
	    srcX=anchorX;
	    srcY=anchorY;
	    dstX=d.x;	
	    dstY=d.y;
	}
	var translateSX = d3.scale.linear().range([srcX,dstX]);
	var translateSY = d3.scale.linear().range([srcY,dstY]);
	var scaleS = d3.scale.linear().range([srcScale,dstScale]);
	return function(t){
	    var scale = scaleS(t);
	    var tx = translateSX(t);
	    var ty = translateSY(t);
	    var newTran = "translate(" +tx+","+ty+ ") scale("+scale+")";
	    return newTran;
	};
	//	return genrateTween(translateSX,translateSY,scaleS);
    }
}

function tweenStay(anchor,anchorX,anchorY,anchorR,anchorDepth){
    return function(d){
	var isAnchor = anchor.equals(d);
	var translateSX,translateSY,scaleS,srcX,dstX,srcY,dstY,srcScale,dstScale;
	// moving to become small child
	if(anchorDepth==0){
	    srcScale = anchorR/d.r;
	    dstScale = 1;
	    srcX=anchorX;
	    srcY=anchorY;
	    dstX=d.x;	
	    dstY=d.y;
	}else{
	    srcScale = anchorR/d.r;
	    dstScale = 1;
	    srcX=anchorX;
	    srcY=anchorY;
	    dstX=d.x;	
	    dstY=d.y;
	}


	var translateSX = d3.scale.linear().range([srcX,dstX]);
	var translateSY = d3.scale.linear().range([srcY,dstY]);
	var scaleS = d3.scale.linear().range([srcScale,dstScale]);
	return function(t){
	    var scale = scaleS(t);
	    var tx = translateSX(t);
	    var ty = translateSY(t);
	    var newTran = "translate(" +tx+","+ty+ ") scale("+scale+")";
	    return newTran;
	};
	//	return genrateTween(translateSX,translateSY,scaleS);
    }
}

function tweenUpper(anchor,anchorX,anchorY,anchorR,anchorDepth){
    return function(d){
	var isAnchor = anchor.equals(d);
	var translateSX,translateSY,scaleS,srcX,dstX,srcY,dstY,srcScale,dstScale,dx,dy;
	// moving to become big parent
	if(anchorDepth==0){
	    srcScale = anchorR/anchor.r;
	    dstScale = 1;
	    srcX=anchorX;
	    srcY=anchorY;
	    dstX=anchor.x;	
	    dstY=anchor.y;
	    dx = d.x-anchor.x;
	    dy = d.y-anchor.y;
	}else{
	    srcScale = 1;
	    dstScale = anchor.r/anchorR;
	    srcX=anchorX;
	    srcY=anchorY;
	    dstX=anchor.x;	
	    dstY=anchor.y;
	    dx = d.x-anchorX;
	    dy = d.y-anchorY;
	}
	var translateSX = d3.scale.linear().range([srcX,dstX]);
	var translateSY = d3.scale.linear().range([srcY,dstY]);
	var scaleS = d3.scale.linear().range([srcScale,dstScale]);
	return function(t){
	    var scale = scaleS(t);
	    var tx = translateSX(t)+scale*dx;
	    var ty = translateSY(t)+scale*dy;
	    var newTran = "translate(" +tx+","+ty+ ") scale("+scale+")";
	    return newTran;
	};
	//	return genrateTween(translateSX,translateSY,scaleS);
    }
}

/*


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
*/
