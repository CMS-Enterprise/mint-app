import { DateTime } from 'luxon';

type DateFormat = 'MM/dd/yyyy' | 'MMMM d, yyyy' | 'MMMM yyyy';

/**
 * Output local timezoned dates from iso string.
 * Typically used for dates generated with time, or server generated dates
 * Dates may differ depending on local time zone
 */
export const formatDateLocal = (date: string, format: DateFormat) =>
  DateTime.fromISO(date).toFormat(format);

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
  if (date && new Date() > new Date(date)) {
    return true;
  }
  return false;
};
