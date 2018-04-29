import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageSliderComponent } from './image-slider/image-slider.component';
import { BgImageSliderComponent } from './bg-image-slider/bg-image-slider.component'

@NgModule({
    imports: [CommonModule],
    declarations: [
        ImageSliderComponent,
        BgImageSliderComponent
    ],
    exports: [
        ImageSliderComponent,
        BgImageSliderComponent
    ]
})
export class ImageSliderModule {
}
