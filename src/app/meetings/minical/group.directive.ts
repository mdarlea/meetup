// tslint:disable-next-line:max-line-length
import { Directive, Host, Input, Output, EventEmitter, OnChanges, OnInit, AfterContentInit, AfterViewInit, OnDestroy, Renderer, ElementRef } from '@angular/core'
import { MinicalService } from './minical.service'

@Directive({
    selector: "group"
})
export class GroupDirective implements OnChanges, OnInit, AfterContentInit, AfterViewInit, OnDestroy {
    @Input() id: string;
    @Input() name: string;
    @Input() color: string;
    @Input() css: string;

    private _show: boolean;

    @Input()
    set show(value: boolean) {
        if (value !== this._show) {
            this._show = value;
            this.showChange.emit(value);
        }
    }
    get show(): boolean {
        return this._show;
    }

    @Output()
    showChange = new EventEmitter<boolean>();

    private _group: web2cal.GroupData=null;

    constructor(@Host() private _schedulerService: MinicalService, private _renderer: Renderer, private _elementRef: ElementRef) {
    }

    ngOnChanges(changes: any) {
        if (!this._group) return;

        var isChanged = false;

        if (changes && "id" in changes) {
            this._group.groupId = <string>changes.id.currentValue;
            this._selectOrUnselectGroup();
            isChanged = true;
        }
        if (changes && "name" in changes) {
            this._group.name = <string>changes.name.currentValue;
            isChanged = true;
        }
        //if (changes && "show" in changes) {
        //    this._group.show = <boolean>changes.show.currentValue;
        //    isChanged = true;
        //}
        if (changes && "color" in changes) {
            var color = <string>changes.color.currentValue;
            if (!this._group.color) {
                this._group.color = {
                    color: color
                }
            }
            else
            {
                this._group.color.color = color;
            }
            isChanged = true;
        }
        if (changes && "css" in changes) {
            var css = <string>changes.css.currentValue;
            if (!this._group.color) {
                this._group.color = {
                    css: css
                }
            }
            else {
                this._group.color.css = css;
            }
            isChanged = true;
        }

        if (isChanged) {
            this._schedulerService.render();
        }
    }

    ngOnInit() {
        this._group = {
            name: this.name,
            groupId: this.id,
            show: this.show,
            events: new Array<web2cal.EventData>()
        };
        if (this.color) {
            this._group.color = {
                color: this.color
            }
        }
        if (this.css) {
            if (this.color) {
                this._group.color.css = this.css;
            } else {
                this._group.color = {
                    css: this.css
                }
            }
        }
        this._selectOrUnselectGroup();
    }
    ngAfterContentInit() {
        this._schedulerService.addGroup(this._group);
    }
    ngAfterViewInit() {
        const selector = '.leftNav .leftNavGroupsList .data .grp .grpName#' + this.id + ' input[type="checkbox"]';
        const checkbox = $(selector);
        checkbox.prop('checked', this.show);
    }

    ngOnDestroy() {
        this._schedulerService.removeGroup(this._group.groupId);
        this._group = null;
    }

    updateEvent(event: web2cal.EventData) {
        this._schedulerService.updateEvent(event);
    }

    addEvent(event: web2cal.EventData) {
        this._group.events.push(event);
        this._schedulerService.addEvent(event);
    }

    removeEvent(eventId: number) {
        this._schedulerService.deleteEvent(eventId);
    }

    _selectOrUnselectGroup() {
        const that = this;
        $('.leftNav .leftNavGroupsList .data').on('click', '.grp .grpName #' + this.id, function() {
            that.show = $(this).prop('checked');
        });
    }
}
