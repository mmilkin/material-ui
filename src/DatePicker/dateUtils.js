import warning from 'warning';

import {formatTime} from '../TimePicker/timeUtils';

const dayAbbreviation = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dec'];
const monthLongList = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export function dateTimeFormat(locale, options) {
  warning(locale === 'en-US', `Wrong usage of DateTimeFormat.
    The ${locale} locale is not supported.`);

  this.format = function(date) {
    let output;

    if (options.month === 'short' && options.weekday === 'short' && options.day === '2-digit') {
      output = `${dayList[date.getDay()]}, ${monthList[date.getMonth()]} ${date.getDate()}`;
    } else if (options.month === 'long' && options.year === 'numeric') {
      output = `${monthLongList[date.getMonth()]} ${date.getFullYear()}`;
    } else if (options.weekday === 'narrow') {
      output = dayAbbreviation[date.getDay()];
    } else {
      warning(false, 'Wrong usage of DateTimeFormat');
    }

    return output;
  };
}

export function addDays(d, days) {
  const newDate = cloneDate(d);
  newDate.setDate(d.getDate() + days);
  return newDate;
}

export function addMonths(d, months) {
  const newDate = cloneDate(d);
  newDate.setMonth(d.getMonth() + months);
  return newDate;
}

export function addYears(d, years) {
  const newDate = cloneDate(d);
  newDate.setFullYear(d.getFullYear() + years);
  return newDate;
}

export function cloneDate(d) {
  return new Date(d.getTime());
}

export function cloneAsDate(d) {
  const clonedDate = cloneDate(d);
  clonedDate.setHours(0, 0, 0, 0);
  return clonedDate;
}

export function getDaysInMonth(d) {
  const resultDate = getFirstDayOfMonth(d);

  resultDate.setMonth(resultDate.getMonth() + 1);
  resultDate.setDate(resultDate.getDate() - 1);

  return resultDate.getDate();
}

export function getFirstDayOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function getFirstDayOfWeek() {
  const now = new Date();
  return new Date(now.setDate(now.getDate() - now.getDay()));
}

export function getWeekArray(d, firstDayOfWeek) {
  const dayArray = [];
  const daysInMonth = getDaysInMonth(d);
  const weekArray = [];
  let week = [];

  for (let i = 1; i <= daysInMonth; i++) {
    dayArray.push(new Date(d.getFullYear(), d.getMonth(), i));
  }

  const addWeek = (week) => {
    const emptyDays = 7 - week.length;
    for (let i = 0; i < emptyDays; ++i) {
      week[weekArray.length ? 'push' : 'unshift'](null);
    }
    weekArray.push(week);
  };

  dayArray.forEach((day) => {
    if (week.length > 0 && day.getDay() === firstDayOfWeek) {
      addWeek(week);
      week = [];
    }
    week.push(day);
    if (dayArray.indexOf(day) === dayArray.length - 1) {
      addWeek(week);
    }
  });

  return weekArray;
}

export function localizedWeekday(DateTimeFormat, locale, day, firstDayOfWeek) {
  const weekdayFormatter = new DateTimeFormat(locale, {weekday: 'narrow'});
  const firstDayDate = getFirstDayOfWeek();

  return weekdayFormatter.format(addDays(firstDayDate, day + firstDayOfWeek));
}

// Convert date to ISO 8601 (YYYY-MM-DD) date string, accounting for current timezone
export function formatIso(date) {
  return (new Date(`${date.toDateString()} 12:00:00 +0000`)).toISOString().substring(0, 10);
}

export function formatIsoTime(date, format = 'ampm') {
  return `${formatIso(date)} ${formatTime(date, format)}`;
}

export function isEqualDate(d1, d2) {
  return d1 && d2 &&
    (d1.getFullYear() === d2.getFullYear()) &&
    (d1.getMonth() === d2.getMonth()) &&
    (d1.getDate() === d2.getDate());
}

export function isBeforeDate(d1, d2) {
  const date1 = cloneAsDate(d1);
  const date2 = cloneAsDate(d2);

  return (date1.getTime() < date2.getTime());
}

export function isAfterDate(d1, d2) {
  const date1 = cloneAsDate(d1);
  const date2 = cloneAsDate(d2);

  return (date1.getTime() > date2.getTime());
}

export function isBetweenDates(dateToCheck, startDate, endDate) {
  return (!(isBeforeDate(dateToCheck, startDate)) &&
          !(isAfterDate(dateToCheck, endDate)));
}

export function monthDiff(d1, d2) {
  let m;
  m = (d1.getFullYear() - d2.getFullYear()) * 12;
  m += d1.getMonth();
  m -= d2.getMonth();
  return m;
}

export function yearDiff(d1, d2) {
  return ~~(monthDiff(d1, d2) / 12);
}
