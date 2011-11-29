var genreTree = new GenreTree();
genreTree.importFromJson(genreTreeJson);
delete genreTreeJson;

var releaseArray = new ReleaseArray();
releaseArray.importFromJson(releaseArrayJson);
delete releaseArrayJson;

