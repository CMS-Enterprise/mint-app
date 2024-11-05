import {
  LockableSection,
  LockableSectionLockStatus as LockSectionType
} from 'gql/generated/graphql';

import { addLockedSection, removeLockedSection } from '.';

describe('SubscriptionWrapper functions', () => {
  it('adds a locked section to subscription context', () => {
    const lockToAdd: LockSectionType = {
      __typename: 'LockableSectionLockStatus',
      modelPlanID: '123',
      section: LockableSection.BENEFICIARIES,
      lockedByUserAccount: {
        id: '00000001-0001-0001-0001-000000000001',
        username: 'MINT',
        commonName: 'MINT Doe',
        __typename: 'UserAccount',
        email: 'mint@doe.oddball.io',
        familyName: 'Doe',
        givenName: 'MINT',
        locale: 'en',
        zoneInfo: 'America/New_York'
      },
      isAssessment: true
    };

    const expectedValue: LockSectionType[] = [
      {
        __typename: 'LockableSectionLockStatus',
        modelPlanID: '123',
        section: LockableSection.BENEFICIARIES,
        lockedByUserAccount: {
          id: '00000001-0001-0001-0001-000000000001',
          username: 'MINT',
          commonName: 'MINT Doe',
          __typename: 'UserAccount',
          email: 'mint@doe.oddball.io',
          familyName: 'Doe',
          givenName: 'MINT',
          locale: 'en',
          zoneInfo: 'America/New_York'
        },
        isAssessment: true
      }
    ];

    const addedLock = addLockedSection([], lockToAdd);

    expect(addedLock).toEqual(expectedValue);
  });

  it('updates a locked section to subscription context', () => {
    const lockToAdd: LockSectionType = {
      __typename: 'LockableSectionLockStatus',
      modelPlanID: '123',
      section: LockableSection.BENEFICIARIES,
      lockedByUserAccount: {
        id: '00000000-0000-0000-0000-000000000000',
        username: 'ABCD',
        commonName: 'ABCD Doe',
        __typename: 'UserAccount',
        email: 'mint@doe.oddball.io',
        familyName: 'Doe',
        givenName: 'MINT',
        locale: 'en',
        zoneInfo: 'America/New_York'
      },
      isAssessment: false
    };

    const expectedValue: LockSectionType[] = [
      {
        __typename: 'LockableSectionLockStatus',
        modelPlanID: '123',
        section: LockableSection.BENEFICIARIES,
        lockedByUserAccount: {
          id: '00000000-0000-0000-0000-000000000000',
          username: 'ABCD',
          commonName: 'ABCD Doe',
          __typename: 'UserAccount',
          email: 'mint@doe.oddball.io',
          familyName: 'Doe',
          givenName: 'MINT',
          locale: 'en',
          zoneInfo: 'America/New_York'
        },
        isAssessment: false
      }
    ];

    const addedLock = addLockedSection(
      [
        {
          __typename: 'LockableSectionLockStatus',
          modelPlanID: '123',
          section: LockableSection.BENEFICIARIES,
          lockedByUserAccount: {
            id: '00000001-0001-0001-0001-000000000001',
            username: 'MINT',
            commonName: 'MINT Doe',
            __typename: 'UserAccount'
          },
          isAssessment: false
        }
      ],
      lockToAdd
    );

    expect(addedLock).toEqual(expectedValue);
  });

  it('removed a locked section to subscription context', () => {
    const lockToRemove: LockSectionType = {
      __typename: 'LockableSectionLockStatus',
      modelPlanID: '123',
      section: LockableSection.BENEFICIARIES,
      lockedByUserAccount: {
        id: '00000000-0000-0000-0000-000000000000',
        username: 'ABCD',
        commonName: 'ABCD Doe',
        __typename: 'UserAccount',
        email: 'mint@doe.oddball.io',
        familyName: 'Doe',
        givenName: 'MINT',
        locale: 'en',
        zoneInfo: 'America/New_York'
      },
      isAssessment: false
    };

    const expectedValue: LockSectionType[] = [];

    const addedLock = removeLockedSection(
      [
        {
          __typename: 'LockableSectionLockStatus',
          modelPlanID: '123',
          section: LockableSection.BENEFICIARIES,
          lockedByUserAccount: {
            id: '00000000-0000-0000-0000-000000000000',
            username: 'ABCD',
            commonName: 'ABCD Doe',
            __typename: 'UserAccount'
          },
          isAssessment: false
        }
      ],
      lockToRemove
    );

    expect(addedLock).toEqual(expectedValue);
  });
});
