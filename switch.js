function handleSwitch(switchVal){
    if(switchVal == LIST_SWITCH){
	initSongList();
    }else if(switchVal == BURST_SWITCH){
	initSongBurst();
    }else if(switchVal == PACK_SWITCH){
	initSongPack();
    }
}
initSongList();