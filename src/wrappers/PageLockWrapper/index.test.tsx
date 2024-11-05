import {
  LockableSection,
  LockableSectionLockStatus
} from 'gql/generated/graphql';

import { findLockedSection, LockStatus } from '.';

const locks: LockableSectionLockStatus[] = [
  {
    __typename: 'LockableSectionLockStatus',
    modelPlanID: '123',
    section: LockableSection.BENEFICIARIES,
    lockedByUserAccount: {
      id: '00000001-0001-0001-0001-000000000001',
      username: 'MINT',
      commonName: 'MINT Doe',
      email: 'doe@oddball.io',
      familyName: 'Doe',
      givenName: 'MINT',
      locale: 'en',
      zoneInfo: 'America/New_York',
      __typename: 'UserAccount'
    },
    isAssessment: true
  },
  {
    __typename: 'LockableSectionLockStatus',
    modelPlanID: '123',
    section: LockableSection.PAYMENT,
    lockedByUserAccount: {
      id: '00000001-0001-0001-0001-000000000001',
      username: 'MINT',
      commonName: 'MINT Doe',
      email: 'doe@oddball.io',
      familyName: 'Doe',
      givenName: 'MINT',
      locale: 'en',
      zoneInfo: 'America/New_York',
      __typename: 'UserAccount'
    },
    isAssessment: false
  }
];

const euaId = 'QWER';

describe('SubscriptionHandler functions', () => {
  it('finds a locked section', () => {
    const route: LockableSection = LockableSection.PAYMENT;

    const expectedValue: LockStatus = LockStatus.LOCKED;

    const lockStatus = findLockedSection(locks, route, euaId);

    expect(lockStatus).toEqual(expectedValue);
  });

  it('finds an unlocked section', () => {
    const route: LockableSection = LockableSection.BASICS;

    const expectedValue: LockStatus = LockStatus.UNLOCKED;

    const lockStatus = findLockedSection(locks, route, euaId);

    expect(lockStatus).toEqual(expectedValue);
  });

  it('finds an occupied section', () => {
    const route: LockableSection = LockableSection.BENEFICIARIES;

    const expectedValue: LockStatus = LockStatus.OCCUPYING;

    const lockStatus = findLockedSection(locks, route, 'MINT');

    expect(lockStatus).toEqual(expectedValue);
  });
});
