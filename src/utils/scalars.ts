import { DateTime } from 'luxon';

// THESE HAVE TO BE CALLED 'serialize' and 'parseValue' or they won't work
// TODO ^ explain why

const DateTimeSerializers = {
  serialize: (parsed: unknown): string | null => {
    if (parsed instanceof DateTime) {
      return parsed.toISODate();
    }
    if (typeof parsed === 'string') {
      return parsed;
    }
    // TODO Maybe add this?
    // if (parsed instanceof String) {
    //   return parsed.toString();
    // }

    return null;
  },
  parseValue: (raw: unknown): DateTime | null => {
    if (!raw) return null; // if for some reason we want to treat empty string as null, for example
    if (typeof raw === 'string') {
      return DateTime.fromISO(raw);
    }

    throw new Error('invalid value to parse');
  }
};

export default DateTimeSerializers;
