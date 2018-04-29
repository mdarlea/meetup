import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'format'
})
export class DateFormatPipe implements PipeTransform {
    transform(date: Date, args?: string): any {
        let format = (args) ? args : "LLLL";
        return moment(date).format(format);
    }
}