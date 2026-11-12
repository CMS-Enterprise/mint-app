import { CtatcmmiGroupOption } from 'gql/generated/graphql';
import { DateTime, Settings } from 'luxon';
import { afterEach } from 'vitest';

import { formatCmmiGroupAcronym, formatDiscussionRelativeDate } from './utils';

describe('formatDiscussionRelativeDate', () => {
  const originalLuxonNow = Settings.now;

  afterEach(() => {
    Settings.now = originalLuxonNow;
  });

  it.each([
    {
      date: () => DateTime.local().minus({ weeks: 2 }).toISO(),
      expected: '2 weeks ago'
    },
    {
      date: () =>
        DateTime.local()
          .set({ hour: 15, minute: 42, second: 0, millisecond: 0 })
          .toISO(),
      expected: 'today at 03:42 PM'
    },
    {
      date: () => DateTime.local().minus({ months: 1 }).toISO(),
      expected: '1 month ago'
    },
    {
      date: () => DateTime.local().minus({ months: 2 }).toISO(),
      expected: '2 months ago'
    },
    {
      date: () => DateTime.local().minus({ years: 1 }).toISO(),
      expected: '1 year ago'
    },
    {
      date: () => DateTime.local().minus({ years: 2 }).toISO(),
      expected: '2 years ago'
    },
    {
      date: () => DateTime.local().minus({ years: 9 }).toISO(),
      expected: '9 years ago'
    },
    {
      date: () => DateTime.local().minus({ years: 10 }).toISO(),
      expected: '1 decade ago'
    },
    {
      date: () => DateTime.local().minus({ years: 20 }).toISO(),
      expected: '2 decades ago'
    },
    {
      now: '2026-11-01T12:00:00',
      date: () => DateTime.local().minus({ days: 1 }).toISO(),
      expected: 'yesterday'
    },
    {
      now: '2026-01-01T12:00:00',
      date: () => DateTime.local().minus({ days: 1 }).toISO(),
      expected: 'yesterday'
    }
  ])('formats discussion age as $expected', ({ now, date, expected }) => {
    if (now) Settings.now = () => new Date(now).getTime();
    expect(formatDiscussionRelativeDate(date() ?? '')).toBe(expected);
  });
});

describe('formatCmmiGroupAcronym', () => {
  it('returns the enum value for standard CMMI groups', () => {
    expect(formatCmmiGroupAcronym(CtatcmmiGroupOption.PCMG)).toBe('PCMG');
    expect(formatCmmiGroupAcronym(CtatcmmiGroupOption.PPG)).toBe('PPG');
  });

  it('returns Other when the group is OTHER', () => {
    expect(formatCmmiGroupAcronym(CtatcmmiGroupOption.OTHER)).toBe('Other');
  });

  it('returns an empty string when the group is unset', () => {
    expect(formatCmmiGroupAcronym(null)).toBe('');
    expect(formatCmmiGroupAcronym(undefined)).toBe('');
  });
});
