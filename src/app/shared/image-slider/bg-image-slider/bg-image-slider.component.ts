import { Component, Input, HostBinding,OnChanges, OnDestroy, OnInit} from "@angular/core";

@Component({
    selector: "bg-image-slider",
    template: `<div [style.background-image]="image"
                     class="image_slider">
                </div>`,
    styleUrls:['./bg-image-slider.component.css']

})
export class BgImageSliderComponent implements OnChanges,OnInit,OnDestroy {
    private _loader: ImageLoader=new ImageLoader();
    private _slider: any;

    image: string;

    @Input() images: Array<string>;
    @Input() path: string;
    @Input() interval: number;

   ngOnChanges(changes:any): void {
        this._loadImages();
        if ("images" in changes) {
            var values = changes.images.currentValue;
            if (values && values.length > 0) {
                this.image = `url(${this._getPath()}${values[0]})`;
            }
            this._loadImages();
        } else if ("path" in changes) {
            if (this.images && this.images.length > 0) {
                this.image = `url(${this._getPath()}${this.images[0]})`;
            }
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
                this.image = `url(${this._getPath()}${name})`;
            }
        }, this._getInterval());
    }

    ngOnDestroy() {
        if (this._slider) {
            clearInterval(this._slider);
        }
    }

    private _getPath():string {
        var p = this.path || "";
        if (!p || p.substr(p.length - 1, 1) !== "/") {
            p = p + "/";
        }
        return p;
    }

    private _getInterval() {
        return (this.interval && this.interval > 0) ? this.interval * 1000 : 3000;
    }

    private _loadImages() {
        if (!this.images) return;
        var p = this._getPath() + "{0}";

        this._loader.load(this.images, p);
    }


}
