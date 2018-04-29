        var PreLoader = function (images, options) {
            //properties initialization
            this.options = {
                pipeline: false,
                auto: true,
                /* onProgress: function(){}, */
                /* onError: function(){}, */
                onComplete: function () { }
            };

            options && typeof options == 'object' && this.setOptions(options);

            this.addQueue(images);
            this.queue.length && this.options.auto && this.processQueue();
        };

        PreLoader.prototype = (function () {
            function checkProgress(src, image) {
                // intermediate checker for queue remaining. not exported.
                // called on preLoader instance as scope
                var args = [],
                    o = this.options;

                // call onProgress
                o.onProgress && src && o.onProgress.call(this, src, image, this.completed.length);

                if (this.completed.length + this.errors.length === this.queue.length) {
                    args.push(this.completed);
                    this.errors.length && args.push(this.errors);
                    o.onComplete.apply(this, args);
                }
            };

            return {
                constructor: PreLoader,

                setOptions: function (options) {
                    // shallow copy
                    var o = this.options,
                        key;

                    for (key in options) options.hasOwnProperty(key) && (o[key] = options[key]);

                    return this;
                },

                addQueue: function (images) {
                    // stores a local array, dereferenced from original
                    this.queue = images.slice();

                    return this;
                },

                reset: function () {
                    // reset the arrays
                    this.completed = [];
                    this.errors = [];

                    return this;
                },

                load: function (src, index) {
                    var image = new Image(),
                        self = this,
                        o = this.options;

                    // set some event handlers
                    image.onerror = image.onabort = function () {
                        this.onerror = this.onabort = this.onload = null;

                        self.errors.push(src);
                        o.onError && o.onError.call(self, src);
                        self._(checkProgress)(src);
                        o.pipeline && self.loadNext(index);
                    };

                    image.onload = function () {
                        this.onerror = this.onabort = this.onload = null;

                        // store progress. this === image
                        self.completed.push(src); // this.src may differ
                        self._(checkProgress)(src, this);
                        o.pipeline && self.loadNext(index);
                    };

                    // actually load
                    image.src = src;

                    return this;
                },

                loadNext: function (index) {
                    // when pipeline loading is enabled, calls next item
                    index++;
                    this.queue[index] && this.load(this.queue[index], index);

                    return this;
                },

                processQueue: function () {
                    // runs through all queued items.
                    var i = 0,
                        queue = this.queue,
                        len = queue.length;

                    // process all queue items
                    this.reset();

                    if (!this.options.pipeline) for (; i < len; ++i) this.load(queue[i], i);
                    else this.load(queue[0], 0);

                    return this;
                },

                _: function (callback) {
                    var self = this;
                    return function () { return callback.apply(self, arguments); };
                }
            }
        })();
