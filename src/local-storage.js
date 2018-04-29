var LocalStorage = function() {
    
}
LocalStorage.prototype = (function () {
    // global to cache value
    var gStorageSupported = undefined;
    function localStorageSupported() {
        var testKey = 'test', storage = window.sessionStorage;
        if (gStorageSupported === undefined) {
            try {
                storage.setItem(testKey, '1');
                storage.removeItem(testKey);
                gStorageSupported = true;
            } catch (error) {
                gStorageSupported = false;
            }
        }
        return gStorageSupported;
    }

    return {
        constructor: Storage,

        localStorageGet:function(pKey) {
            if (_(localStorageSupported)()) {
                return localStorage[pKey];
            } else {
                return docCookies.getItem('localstorage.' + pKey);
            }
        },

        localStorageSet: function(pKey, pValue) {
            if (_(localStorageSupported)()) {
                localStorage[pKey] = pValue;
            } else {
                docCookies.setItem('localstorage.' + pKey, pValue);
            }
        },

        localStorageRemove: function(pKey) {
            if (_(localStorageSupported)()) {
                localStorage.removeItem(pKey);
            } else {
                docCookies.removeItem(pKey);
            }
        },

        _: function (callback) {
            var self = this;
            return function () { return callback.apply(self, arguments); };
        }
    }    
})();



