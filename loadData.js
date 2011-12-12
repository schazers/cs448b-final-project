var genreTree = new GenreTree();
genreTree.importFromJson(genreTreeJson);
delete genreTreeJson;

var releaseArray = new ReleaseArray();
releaseArray.importFromJson(releaseArrayJson);
delete releaseArrayJson;

LIST_SWITCH = 1;
BURST_SWITCH = 2;
PACK_SWITCH = 3;
