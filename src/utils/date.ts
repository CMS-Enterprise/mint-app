import { DateTime } from 'luxon';

export const parseAsDate = (date: string) =>
  DateTime.fromISO(date, { zone: 'utc' });

export const parseAsLocalTime = (date: string) => DateTime.fromISO(date);

export const formatDateAndIgnoreTimezone = (date: string) =>
  parseAsDate(date).toFormat('MMMM d yyyy');

export const formatDate = (date: string | DateTime, format?: string) => {
  const dateFormat = format || 'MMMM d, yyyy';
  // ISO String
  if (typeof date === 'string') {
    return parseAsLocalTime(date).toFormat(dateFormat);
  }

  // luxon DateTime
  if (date instanceof DateTime) {
    return date.toFormat(dateFormat);
  }

  return '';
};

type ContractDate = {
  day: string | null;
  month: string | null;
  year: string | null;
};

export const formatContractDate = (date: ContractDate): string => {
  const { month, day, year } = date;

  const parts = [month, day, year];
  return parts
    .filter((value: string | null) => value && value.length > 0)
    .join('/');
};

/**
 * Returns the input parameter's fiscal year
 * FY 2021 : October 1 2020 - September 30 2021
 * FY 2022 : October 1 2021 - September 30 2022
 * @param date DateTime date object
 */
export const getFiscalYear = (date: DateTime): number => {
  const { month, year } = date;
  if (month >= 10) {
    return year + 1;
  }
  return year;
};

export const getTimeElapsed = (discussionCreated: string) => {
  const now = DateTime.local();
  const creationTime = DateTime.fromISO(discussionCreated);

  const timePassed = now
    .diff(creationTime, ['years', 'months', 'days', 'hours', 'minutes'])
    .toObject();

  let dateString = '';

  Object.keys(timePassed).forEach(time => {
    if (timePassed[time as keyof typeof getTimeElapsed] >= 1) {
      const floatTime = timePassed[time as keyof typeof getTimeElapsed];
      // Only show parent most level of time, rather than all increments
      if (dateString === '') {
        dateString += `${parseInt(floatTime, 10)} ${
          timePassed[time as keyof typeof getTimeElapsed] >= 2
            ? time
            : time.slice(0, -1) // If singular, remove last letter 's's from time string
        } `;
      }
    }
  });

  return dateString;
};

export const isDateInPast = (date: string | null): boolean => {
  if (date && new Date() > new Date(date)) {
    return true;
  }
  return false;
};
