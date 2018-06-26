//////////////////////////////////////////////////
//              Object Structure                //
//////////////////////////////////////////////////



/**
 * Object encapsulates for work with requests
 * @type {{method: string}}
 */
var Request = {

    'host'    : ['http://bookmark.loc', 'http://bookmark.com'],
    'method'  : 'GET',
    'response': {},



    'init' : function (options) {
        for(var property in options) {
            if (this.hasOwnProperty(property)) {
                this[property] = options[property];
            }
        }

        console.info(this.host);

        return this;
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



var Synchronizer = {

    'request' : {},
    'syncCollection' : {},



    'init' : function (options) {
        for(var property in options) {
            if (this.hasOwnProperty(property)) {
                this[property] = options[property];
            }
        }

        this.request = Request.init();
    },



    'update' : function (type, id, info) {

        console.info(type, id, info);

        if (type != "undefined" && type != 'onRemoved') {

            var item = this.getItem(id);
            item.then(function () {
                Synchronizer.syncCollection[id] = item;
            });


            console.info('item', item);



        } else {
            this.syncCollection[id] = false;
        }

        console.info(this.syncCollection);
    },

    'checkForUpdates' : function () {

        // TODO
        console.info('checkForUpdates');
    },



    'getItem' : function (id) {
        var item;

        function onFulfilled(bookmarks) {
            console.log(bookmarks);
            item = bookmarks;
        }

        function onRejected(error) {
            console.log('An error: ' + error);
        }

        var gettingBookmarks = browser.bookmarks.get(id);
        gettingBookmarks.then(onFulfilled, onRejected);

        return item;
    },

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
