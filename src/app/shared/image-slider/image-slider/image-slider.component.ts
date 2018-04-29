import { Component, Input, OnChanges, OnInit, OnDestroy} from "@angular/core";

export class ImageInfo {
    constructor(public name: string,
                public opacity: number) { }
}

@Component({
    selector: "image-slider",
    templateUrl: "./image-slider.component.html",
    styleUrls:["./image-slider.component.css"]
})
export class ImageSliderComponent implements OnChanges, OnInit, OnDestroy{
    @Input() filter: string;
    @Input() source : Array<string>;
    @Input() width:number;
    @Input() height:number;
    @Input() interval:number;

    imagesInfo: Array<ImageInfo> = new Array<ImageInfo>();

    private _loader: ImageLoader;
    private _slider: any;

    constructor() {
        this._loader = new ImageLoader();
    }

    srcForName(name: string) {
        return this.filter.replace("{0}", name);
    }

    ngOnChanges(changes: any): void {
        if ("source" in changes) {
            var values = changes.source.currentValue;
            this.imagesInfo = new Array<ImageInfo>();
            values.forEach(
                (value: string, i: number) => {
                    var opacity = (i === 0) ? 1 : 0;
                    this.imagesInfo.push(new ImageInfo(value, opacity));
                });
            this._loadImages();
        } else if ("filter" in changes) {
            this._loadImages();
        }
        if ("interval" in changes) {
            if (this._slider) {
                this.ngOnDestroy();
                this.ngOnInit();
            }
        }
    }

    ngOnInit(): void {
        var self = this;
        this._slider = setInterval(() => {
            if (self._loader && !self._loader.loading) {
                var name = self._loader.getNext();
                self._refresh(name);
            }
        }, this._getInterval());
    }

    ngOnDestroy() {
        if (this._slider) {
            clearInterval(this._slider);
        }
    }

    private _refresh(name:string)  {
        this.imagesInfo.forEach(
             (info: ImageInfo, i: number) => {
                if (info.name === name) {
                    info.opacity = 1;
                } else {
                    info.opacity = 0;
                }
             });
    }

    private _loadImages() {
        if (!this.source) return;

        this._loader.load(this.source,this.filter,() => {
            this._refresh(this._loader.getCurrent());
        });
    }

    private _getInterval() {
        return (this.interval && this.interval > 0) ? this.interval * 1000 : 3000;
    }
}
