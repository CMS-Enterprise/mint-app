import properlyCapitalizeInitiator from './_utils';

describe('Properly Capitalize Initiator Function Test', () => {
  it('returns properly capitalized name', () => {
    expect(properlyCapitalizeInitiator('STEVE ROGERS')).toBe('Steve Rogers');
    expect(properlyCapitalizeInitiator('sTEVE rOGERS')).toBe('Steve Rogers');
    expect(properlyCapitalizeInitiator('steve rogers')).toBe('Steve Rogers');
  });

  it('returns properly capitalized name while words in parenthesis remains as is', () => {
    expect(properlyCapitalizeInitiator('STEVE ROGERS (AVENGER)')).toBe(
      'Steve Rogers (AVENGER)'
    );
    expect(properlyCapitalizeInitiator('BRUCE BANNER (MD, Ph.D)')).toBe(
      'Bruce Banner (MD, Ph.D)'
    );
  });
});
