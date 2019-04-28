import * as _ from 'lodash';

export class RecurringEventViewModel {
  type: string;
  recurring: boolean;
  count: number;
  until: Date;

  constructor(vm?: RecurringEventViewModel) {
    if (vm) {
      Object.assign(this, _.cloneDeep(vm));
    }

  }
  static parse(value: string): RecurringEventViewModel {
    const viewModel = new RecurringEventViewModel();

    if (!value) {
      viewModel.recurring = false;
      return viewModel;
    }

    viewModel.recurring = true;
    let find = 'FREQ=';
    let i = value.indexOf(find);
    let substr = value.substr(i + find.length);
    i = substr.indexOf(';');
    if (i >= 0) {
      substr = substr.substr(0, i);
    }
    viewModel.type = substr.toLowerCase();

    find = 'UNTIL=';
    i = value.indexOf(find);
    if (i >= 0) {
      substr = value.substr(i + find.length);
      i = substr.indexOf(';');
      if (i >= 0) {
        substr = substr.substr(0, i);
      }
      viewModel.until = RecurringEventViewModel.getDateTime(substr);
    }

    find = 'COUNT=';
    i = value.indexOf(find);
    if (i >= 0) {
      substr = value.substr(i + find.length);
      i = substr.indexOf(';');
      if (i >= 0) {
        substr = substr.substr(0, i);
      }
      viewModel.count = +substr;
    }

    return viewModel;
  }

  static dateTimeToString(value: Date): string {
    let dateValue = `${value.getFullYear()}`;
    const tz = value.getTimezoneOffset();
    const month = value.getMonth() + 1;
    if (month < 10) {
        dateValue += `0${month}`;
      } else {
        dateValue += `${month}`;
    }
    const day = value.getDate();
    if (day < 10) {
        dateValue += `0${day}`;
      } else {
        dateValue += `${day}`;
      }
    const hour = value.getHours();
    if (hour < 10) {
        dateValue += `T0${hour}`;
      } else {
        dateValue += `T${hour}`;
      }
    const minute = value.getMinutes();
    if (minute < 10) {
        dateValue += `0${minute}`;
      } else {
        dateValue += `${minute}`;
      }
    const second = value.getSeconds();
    if (second < 10) {
        dateValue += `0${second}`;
      } else {
        dateValue += `${second}`;
      }

    return `${dateValue}Z`;
  }
  private static getDateTime(value: string): Date {
    const year = +value.substr(0, 4);
    const month = +value.substr(4, 2);
    const date = +value.substr(6, 2);
    const hours = +value.substr(9, 2);
    const minutes = +value.substr(11, 2);
    const seconds = +value.substr(13, 2);

    return new Date(year, month, date, hours, minutes, seconds);
  }

  toString(): string {
    if (!this.recurring) { return ''; }

    let value = `FREQ=${this.type.toUpperCase()}`;

    if (this.count && this.count > 0) {
      value += `;COUNT=${this.count}`;
    }

    if (this.until) {
      value += `;UNTIL=${RecurringEventViewModel.dateTimeToString(this.until)}`;
    }

    return value;
  }
}
