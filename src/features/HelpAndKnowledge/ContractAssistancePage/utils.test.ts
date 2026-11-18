import { CtatcmmiGroupOption } from 'gql/generated/graphql';

import { formatCmmiGroupAcronym } from './utils';

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
