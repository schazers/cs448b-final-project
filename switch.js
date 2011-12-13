function handleSwitch(switchVal){
    if(switchVal == LIST_SWITCH){
	initSongList();
	d3.select("#listSwitch")
	.style("color", "#EEEEEE")
	.style("background-color", "#444444")
	d3.select("#burstSwitch")
	.style("color", "#000000")
	.style("background-color", "#F0F0F0")
	d3.select("#packSwitch")
	.style("color", "#000000")
	.style("background-color", "#F0F0F0")
    }else if(switchVal == BURST_SWITCH){
	initSongBurst();
	d3.select("#listSwitch")
	.style("color", "#000000")
	.style("background-color", "#F0F0F0")
	d3.select("#burstSwitch")
	.style("color", "#EEEEEE")
	.style("background-color", "#444444")
	d3.select("#packSwitch")
	.style("color", "#000000")
	.style("background-color", "#F0F0F0")
    }else if(switchVal == PACK_SWITCH){
	initSongPack();
	d3.select("#listSwitch")
	.style("color", "#000000")
	.style("background-color", "#F0F0F0")
	d3.select("#burstSwitch")
	.style("color", "#000000")
	.style("background-color", "#F0F0F0")
	d3.select("#packSwitch")
	.style("color", "#EEEEEE")
	.style("background-color", "#444444")
    }
}

initSongList();
