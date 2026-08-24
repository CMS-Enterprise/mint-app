import { DateTime, Interval } from 'luxon';

type DateFormat = 'MM/dd/yyyy' | 'MMMM d, yyyy' | 'MMMM yyyy';

/**
 * Output local timezoned dates from iso string.
 * Typically used for dates generated with time, or server generated dates
 * Dates may differ depending on local time zone
 */
export const formatDateLocal = (date: string, format: DateFormat) => {
  if (date) {
    const parsedDate = DateTime.fromISO(date).toFormat(format);
    if (parsedDate !== 'Invalid DateTime') return parsedDate;
  }
  return '';
};

/**
 * Output UTC timezoned dates from iso string.
 * Typically used for dates from user input, where utc timezone needs to be set
 * explicitly in order to match timezoneless dates within a iso string correctly.
 */
export const formatDateUtc = (
  date: string | null | undefined,
  format: DateFormat
): string => {
  if (date) {
    const parsedDate = DateTime.fromISO(date, { zone: 'UTC' }).toFormat(format);
    if (parsedDate !== 'Invalid DateTime') return parsedDate;
  }
  return '';
};

export const getTimeElapsed = (discussionCreated: string) => {
  const now = DateTime.local();
  const creationTime = DateTime.fromISO(discussionCreated);

  const timePassed = now
    .diff(creationTime, ['years', 'months', 'days', 'hours', 'minutes'])
    .toObject();

  let dateString = '';

  Object.keys(timePassed).forEach(time => {
    if (Math.abs(timePassed[time as keyof typeof getTimeElapsed]) >= 1) {
      const floatTime = Math.round(
        Math.abs(timePassed[time as keyof typeof getTimeElapsed])
      );

      // Only show parent most level of time, rather than all increments
      if (dateString === '') {
        dateString += `${floatTime} ${
          floatTime !== 1 ? time : time.slice(0, -1) // If singular, remove last letter 's's from time string
        } `;
      }
    }
  });

  return dateString;
};

// Returns only the time from an ISO string -> 1:57 pm
export const formatTime = (date: string) =>
  DateTime.fromISO(date).toLocaleString(DateTime.TIME_SIMPLE);

export const getDaysElapsed = (discussionCreated: string) => {
  const now = DateTime.local();
  const creationTime = DateTime.fromISO(discussionCreated);

  const timePassed = now
    .diff(creationTime, ['years', 'months', 'days'])
    .toObject();

  let dateString = '';

  Object.keys(timePassed).forEach(time => {
    if (Math.abs(timePassed[time as keyof typeof getTimeElapsed]) >= 1) {
      const floatTime = Math.round(
        Math.abs(timePassed[time as keyof typeof getTimeElapsed])
      );

      // Only show parent most level of time, rather than all increments
      if (dateString === '') {
        dateString += `${floatTime} ${
          timePassed[time as keyof typeof getTimeElapsed] !== 1
            ? time
            : time.slice(0, -1) // If singular, remove last letter 's's from time string
        } ago`;
      }
    }
    if (time === 'days') {
      if (
        Math.abs(timePassed[time as keyof typeof getTimeElapsed]) > 0 &&
        Math.abs(timePassed[time as keyof typeof getTimeElapsed]) < 1
      ) {
        if (dateString === '') {
          dateString = 'today';
        }
      }
    }
  });

  return dateString;
};

export const isDateInPast = (date: string | null | undefined): boolean => {
  if (!date) return false;

  const today = DateTime.now().setZone('UTC').startOf('day');

  const selectedDate = DateTime.fromISO(date, { zone: 'UTC' });

  return today > selectedDate;
};

/**
 * Converts a Date object to a UTC ISO string
 */
export const convertDateToISOString = (date: Date | null) => {
  if (!date) return null;

  const dt = DateTime.fromJSDate(date, { zone: 'UTC' });

  if (!dt.isValid) return null;

  return dt.toISO({ suppressMilliseconds: true });
};

/**
 * Returns true if the given ISO date string falls within the next `days` calendar days (UTC), or before today,
 * inclusive of today through the end of the Nth day (same window rule as the former 30-day helper).
 */
export const isNeededWithinDays = (
  needBy: string | null,
  days: number
): boolean => {
  if (needBy == null) return false;

  const needByDate = DateTime.fromISO(needBy, { zone: 'utc' });
  if (!needByDate.isValid) return false;

  const cutoffDate = DateTime.utc().plus({ days }).endOf('day');

  return needByDate < cutoffDate;
};

/**
 * Returns true if the given ISO date string falls within the given range.
 */
export const isDateWithinRange = (
  date: string,
  startDate: string,
  endDate: string
): boolean => {
  const target = DateTime.fromISO(date, { zone: 'UTC' });
  const start = DateTime.fromISO(startDate, { zone: 'UTC' }).startOf('day');
  const end = DateTime.fromISO(endDate, { zone: 'UTC' }).endOf('day');

  if (!target.isValid || !start.isValid || !end.isValid) {
    return false;
  }
  const interval = Interval.fromDateTimes(start, end);

  return interval.isValid ? interval.contains(target) : false;
};
