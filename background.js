//////////////////////////////////////////////////
//              Background flow                 //
//////////////////////////////////////////////////

function getImageData() {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "green";
    ctx.fillRect(10, 10, 100, 100);

    return ctx.getImageData(50, 50, 100, 100);
}

browser.browserAction.onClicked.addListener(() => {
    browser.browserAction.setIcon({imageData: getImageData()});
});


// listen to click at browser btn
browser.browserAction.onClicked.addListener(function () {
    BookmarkManager.toggle();
});

// listen to tab URL changes
browser.tabs.onUpdated.addListener(function () {
    BookmarkManager.updateActiveTab();
});

// listen to tab switching
browser.tabs.onActivated.addListener(function () {
    BookmarkManager.updateActiveTab();
});

// listen for bookmarks.onCreated once Bug 1221764 lands
browser.tabs.onCreated.addListener(function () {
    BookmarkManager.updateActiveTab();
});

// listen for bookmarks.onRemoved once Bug 1221764 lands
browser.tabs.onRemoved.addListener(function () {
    BookmarkManager.updateActiveTab();
});

// update when the extension loads initially
BookmarkManager.updateActiveTab();
