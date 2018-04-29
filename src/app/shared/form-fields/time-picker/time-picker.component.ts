import { Component, OnInit, Input, Output, forwardRef,EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export class DateFormat {
    military: boolean;
    momentFormat:string;
}
@Component({
  selector: 'time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css'],
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true
  }]
})
export class TimePickerComponent implements OnInit, ControlValueAccessor {
   @Input() format: DateFormat;
   @Input() name: string;

   private _config: any;
    @Input()
   get config() {
        if (!this._config) {
            this._config = {
                modal: false,
                inline: false,
                color: 'rgba(255,255,255,0.75)',
                backgroundColor: 'rgba(0,0,0,0.75)'
            };
            return this._config;
        }
        return this._config;
   }
    set config(value: any) {
        this._config = value;
    }

    @Output()
    change = new EventEmitter<Date>()


   months: Array<string>;
   dayNames: Array<string>;
   state = false;
   tab = 'time';
   display: string;
   minute: moment.Moment; //type is Moment
   hour:number; //Moment
   meridian: string;
   datePreview: string;
   timePreview: string;
   displayMonth: string;
   displayYear: string;
   day: any;
   daysInfo:any;
   days: Array<number>;
   minutesList: Array<number>;
    hoursList:Array<number>;
   private _model: Date;
   private _onTouched: Function;
   private _onChange: Function;

   get model(): any {
       return this._model;
   };

   //set accessor including call the onchange callback
   set model(value: any) {
       if (value !== this._model) {
           this._model = value;
           if (!this._onChange) {
               this._onModelChange(value);
           } else {
               this._onChange(value);
           }
       }
   }

  constructor() { }

    togleTimePicker($event:Event) {
        $event.preventDefault();
        this.state = !this.state
    }
  ngOnInit() {
      this.minutesList = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 0];
      this.hoursList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

      this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      this.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

      this.days = new Array<number>();
      for (var i = 1; i <= 31; i++) {
          this.days.push(i);
      }
  }

  setTab(tab:string) {
      this.tab = tab;
  }

  get displayFormat(): string {
      return this.format && this.format.momentFormat ? this.format.momentFormat : this.format && this.format.military ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD hh:mm A';
  }

 private _onModelChange(value:Date) {
     var m:any;
     if (value)
         m = moment(value);
     else
         m = moment();
     m = m.minute(5 * Math.ceil(m.minute() / 5));

     this.display = m.format(this.displayFormat);
     this.daysInfo = this.getDaysInMonth(m.year(), m.month())
     this.days = this.daysInfo.days;
     this.minute = m.minute();
     this.meridian = m.format('A');
     this.hour = this.meridian === 'PM' ? m.hour() - 12 : m.hour();
     if (this.hour === 0) this.hour = 12;
     this.datePreview = m.format('YYYY-MM-DD');
     this.timePreview = m.format('hh:mm A');
     this.displayMonth = this.months[m.month()];
     this.displayYear = m.format('YYYY');
     this.day = m.date();

     this.change.emit(value);
 }

  setDay(date:number) {
      this.model = moment(this.model).date(date).toDate();
  }

  setState(state:boolean) {
      this.state = state;
  }

  setHour(hour:number) {
      if (this.meridian == 'PM' && hour < 12)
          hour = hour + 12;
      if (this.meridian == 'AM' && hour == 12)
          hour = hour - 12;
      this.model = moment(this.model).hour(hour).toDate();
  }

  setMeridian(meridian:string) {
      var m = moment(this.model);

      if (meridian == 'AM') {
          if (m.hours() >= 12) {
              m = m.add(-12, 'hours');
              this.model = m.toDate();
          }
      } else {
          if (m.hours() < 12) {
              m = m.add(12, 'hours');
              this.model = m.toDate();
          }
      }
  }

  setMinutes(minutes:number) {
      this.model = moment(this.model).minute(minutes).toDate();
  }


getDaysInMonth(year:number, month:number) {
    var firstDayOfWeek = 0;
    var firstDayOfMonth = new Date(year, month, 1),
        lastDayOfMonth = new Date(year, month + 1, 0),
        lastDayOfPreviousMonth = new Date(year, month, 0),
        daysInMonth = lastDayOfMonth.getDate(),
        daysInLastMonth = lastDayOfPreviousMonth.getDate(),
        dayOfWeek = firstDayOfMonth.getDay(),
        leadingDays = (dayOfWeek - firstDayOfWeek + 7) % 7 || 7,
        trailingDays = this.days.slice(0, 6 * 7 - (leadingDays + daysInMonth));
    if (trailingDays.length > 7) {
        trailingDays = trailingDays.slice(0, trailingDays.length - 7);
    }

    return {
        year: year,
        month: month,
        days: this.days.slice(0, daysInMonth),
        leadingDays: this.days.slice(- leadingDays - (31 - daysInLastMonth), daysInLastMonth),
        trailingDays: trailingDays
    };
}

addMonth (increment:any) {
    this.model = moment(this.model).add(increment, 'months').toDate();
}

addYear(increment:any) {
    this.model = moment(this.model).add(increment, 'years').toDate();
}


//From ControlValueAccessor interface
//Set touched on blur
onBlur() {
    this._onTouched();
}

//From ControlValueAccessor interface
    writeValue(value: any) {
        this.model = value;
    }

//From ControlValueAccessor interface
registerOnChange(fn: any) {
    this._onChange = (value: any) => {
        fn(value);
        this._onModelChange(value);
    }
}

//From ControlValueAccessor interface
registerOnTouched(fn: any) {
    this._onTouched = fn;
}
}
