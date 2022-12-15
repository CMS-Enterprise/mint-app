import { getUserInitials, returnValidLetter } from './modelPlan';

describe('model plan util', () => {
  it('return valid user initials', () => {
    expect(getUserInitials('John Doe')).toEqual('JD');
    expect(getUserInitials('John Doe (He/They)')).toEqual('JD');
    expect(getUserInitials('John Jane Doe (He/They) 4 ## ')).toEqual('JJD');
  });

  it('return a single valid letter', () => {
    expect(returnValidLetter('D')).toEqual('D');
    expect(returnValidLetter('a')).toEqual('a');
    expect(returnValidLetter('@')).toEqual('');
    expect(returnValidLetter('}')).toEqual('');
  });
});
