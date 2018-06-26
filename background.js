//////////////////////////////////////////////////
//              Background flow                 //
//////////////////////////////////////////////////

// min FF v52.0



// init object
Synchronizer.init();



// listen to bookmark change
browser.bookmarks.onChanged.addListener(function (id, changeInfo) {
    Synchronizer.update('onChanged', id, changeInfo);
});

// listen to bookmark create
browser.bookmarks.onCreated.addListener(function (id, bookmark) {
    Synchronizer.update('onCreated', id, bookmark);
});

// listen to bookmark move
browser.bookmarks.onMoved.addListener(function (id, moveInfo) {
    Synchronizer.update('onMoved', id, moveInfo);
});

// listen to bookmark remove
browser.bookmarks.onRemoved.addListener(function (id, removeInfo) {
    Synchronizer.update('onRemoved', id, removeInfo);
});



// update when the extension loads initially
Synchronizer.checkForUpdates();
