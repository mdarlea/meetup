        var ImageLoader = function () {
            /**
            * @ngdoc property
            * @name sw.ui.bootstrap.image.ImageLoader#loading
            * @propertyOf sw.ui.bootstrap.image.ImageLoader
            * @returns {boolean} True if images are currently loading, False if all images were loaded
            */
            this.loading = true;

            /**
            * @ngdoc property
            * @name sw.ui.bootstrap.image.ImageLoader#backgroundImages
            * @propertyOf sw.ui.bootstrap.image.ImageLoader
            * @returns {Array} An array that contains the names of the loaded images
            */
            this.backgroundImages = [];

            this._unloadedImages = [];

            this.idx = 0;
        };

        ImageLoader.prototype = (function () {
            function getImageName(imgPath, imgFilter) {
                if (!imgFilter) return imgPath;

                var token = "{0}";
                var left = imgFilter.indexOf(token);
                if (left < 0) return imgPath;

                var right = imgFilter.substring(left + token.length);
                var imgName = imgPath.substring(left, imgPath.lastIndexOf(right));

                return imgName;
            };

            function loadImages(images, imgFilter, callback) {
                var imgs = [];
                for (var i=0; i < images.length; i++) {
                    var name = images[i];
                    var imgPath = imgFilter.replace("{0}", name);
                    imgs.push(imgPath);
                };

                var that = this;
                var loader = new PreLoader(imgs, {
                   onComplete: function() {
                        for (var ii = 0; ii < this.completed.length; ii++) {
                            that.backgroundImages.push(that._(getImageName)(this.completed[ii],imgFilter));
                        }
                        for (var j = 0; j < this.errors.length; j++) {
                             that._unloadedImages.push(that._(getImageName)(this.errors[j], imgFilter));
                        }
                        if (callback && typeof callback === "function") callback();
                        that.loading = false;
                   }
                });
            };

            return {
                constructor: ImageLoader,

                getFirst: function () {
                    return this.backgroundImages.length > 0 && this.backgroundImages[0];
                },
                getCurrent: function () {
                    var len = this.backgroundImages.length;
                    return this.idx <= (len - 1) && this.backgroundImages[this.idx];
                },
                getNext: function () {
                    if (this.idx === (this.backgroundImages.length - 1)) {
                        this.idx = 0;
                    } else {
                        this.idx++;
                    }                        ;
                    return this.getCurrent();
                },

                /**
                * @ngdoc method
                * @name sw.ui.bootstrap.image.ImageLoader#load
                * @methodOf sw.ui.bootstrap.image.ImageLoader
                * @description Preoads a list of images
                * @param {Array} images The names of the images that must be preloaded
                * @param {string} imgFilter Defines the full image path. Use the {0} placeholder for the image name
                    Example:
                    <pre>
                    var images=['image1.png','image2.png'];
                    var loader = new ImageLoader();
                    loader.load(images, '/Content/images/{0}.jpg', function() {
                        console.log("Images successfully preloaded");
                    });
                    </pre>
                * @param {function} callback A function that is called after all images were successfully loaded
                */
            load: function (images, imgFilter, callback) {
                    this.loading = true;
                    this.idx = 0;
                    this.backgroundImages = [];
                    this._unloadedImages = [];
                    this._(loadImages)(images, imgFilter, callback);
                },

                _: function (callback) {
                    var self = this;
                    return function () { return callback.apply(self, arguments); };
                }
            }
        })();
