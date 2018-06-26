//////////////////////////////////////////////////
//              Object Structure                //
//////////////////////////////////////////////////



/**
 * Object encapsulates for work with requests
 * @type {{host: string, method: string}}
 */
var Request = {
    'host'    : 'https://www.google.com.ua',
    'method'  : 'GET',
    'response': {},

    'init' : function (options) {
        for(var property in options) {
            if (this.hasOwnProperty(property)) {
                this[property] = options[property];
            }
        }
    },
    'isCallable' : function (functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    },

    'send' : function (callback) {
        var xhr = new XMLHttpRequest();
        if (xhr) {
            xhr.open(this.method, this.host, true);
            xhr.onreadystatechange = function() {
                if (
                    // check status
                    xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200
                    // check callable
                    && Request.isCallable(callback)
                ) {
                    callback(xhr);
                }
            };
            xhr.send();
        }
    }
};



var BookmarkManager = {
    
    'currentBookmark' : false,
    'currentTab' : null,

    // Updates the browserAction icon to reflect whether the current page is already bookmarked.
    'updateIcon' : function () {
        browser.browserAction.setIcon({
            path: this.currentBookmark ? {
                19: "icons/star-filled-19.png",
                38: "icons/star-filled-38.png"
            } : {
                19: "icons/star-empty-19.png",
                38: "icons/star-empty-38.png"
            },
            tabId: this.currentTab.id
        });
    },

    // Add or remove the bookmark on the current page.
    'toggle' : function () {

        // TODO
        console.log(this.currentBookmark);
        // console.log(logTree());

        Request.init({});
        Request.send(function (xhr) {
            console.log(xhr.readyState, xhr.status, xhr.responseText, xhr);
        });


        // if (this.currentBookmark) {
        //   browser.bookmarks.remove(this.currentBookmark.id);
        //   this.currentBookmark = null;
        //   updateIcon();
        // } else {
        //   var creating = browser.bookmarks.create({"title": this.currentTab.title, "url": this.currentTab.url});
        //   creating.then(function(bookmark) {
        //     this.currentBookmark = bookmark;
        //     updateIcon();
        //   });
        // }
    },

    // Switches currentTab and currentBookmark to reflect the currently active tab
    'updateActiveTab' : function (tabs) {
        var self = this;

        function updateTab(tabs) {
            if (tabs[0] && typeof tabs[0] === 'object' && tabs[0].hasOwnProperty('url')) {
                self.currentTab = tabs[0];
                var searching = browser.bookmarks.search(self.currentTab.url);
                searching.then(function(bookmarks) {
                    if (bookmarks[0]) {
                        self.currentBookmark = bookmarks[0];
                        self.updateIcon();
                    }
                });
            }
        }

        var gettingActiveTab = browser.tabs.query({"active": true, "currentWindow": true});
        gettingActiveTab.then(updateTab);
    },

    // TODO

    'logTree' : function () {
        function makeIndent(indentLength) {
            return ".".repeat(indentLength);
        }

        function logItems(bookmarkItem, indent) {
            if (bookmarkItem.url) {
                console.log(makeIndent(indent) + bookmarkItem.url);
            } else {
                console.log(makeIndent(indent) + "Folder");
                indent++;
            }
            if (bookmarkItem.children) {
                for (child of bookmarkItem.children) {
                    logItems(child, indent);
                }
            }
            indent--;
        }

        function logTree(bookmarkItems) {
            logItems(bookmarkItems[0], 0);
        }

        function onRejected(error) {
            console.log('An error: ' + error);
        }

        var gettingTree = browser.bookmarks.getTree();
        gettingTree.then(logTree, onRejected);
    }
};
