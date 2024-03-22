import { TaskListSubscription_onLockTaskListSectionContext_lockStatus as LockSectionType } from 'gql/gen/types/TaskListSubscription';

import { TaskListSection } from 'types/graphql-global-types';

import { addLockedSection, removeLockedSection } from '.';

describe('SubscriptionWrapper functions', () => {
  it('adds a locked section to subscription context', () => {
    const lockToAdd: LockSectionType = {
      __typename: 'TaskListSectionLockStatus',
      modelPlanID: '123',
      section: TaskListSection.BENEFICIARIES,
      lockedByUserAccount: {
        id: '00000001-0001-0001-0001-000000000001',
        username: 'MINT',
        commonName: 'MINT Doe',
        __typename: 'UserAccount'
      },
      isAssessment: true
    };

    const expectedValue: LockSectionType[] = [
      {
        __typename: 'TaskListSectionLockStatus',
        modelPlanID: '123',
        section: TaskListSection.BENEFICIARIES,
        lockedByUserAccount: {
          id: '00000001-0001-0001-0001-000000000001',
          username: 'MINT',
          commonName: 'MINT Doe',
          __typename: 'UserAccount'
        },
        isAssessment: true
      }
    ];

    const addedLock = addLockedSection([], lockToAdd);

    expect(addedLock).toEqual(expectedValue);
  });

  it('updates a locked section to subscription context', () => {
    const lockToAdd: LockSectionType = {
      __typename: 'TaskListSectionLockStatus',
      modelPlanID: '123',
      section: TaskListSection.BENEFICIARIES,
      lockedByUserAccount: {
        id: '00000000-0000-0000-0000-000000000000',
        username: 'ABCD',
        commonName: 'ABCD Doe',
        __typename: 'UserAccount'
      },
      isAssessment: false
    };

    const expectedValue: LockSectionType[] = [
      {
        __typename: 'TaskListSectionLockStatus',
        modelPlanID: '123',
        section: TaskListSection.BENEFICIARIES,
        lockedByUserAccount: {
          id: '00000000-0000-0000-0000-000000000000',
          username: 'ABCD',
          commonName: 'ABCD Doe',
          __typename: 'UserAccount'
        },
        isAssessment: false
      }
    ];

    const addedLock = addLockedSection(
      [
        {
          __typename: 'TaskListSectionLockStatus',
          modelPlanID: '123',
          section: TaskListSection.BENEFICIARIES,
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
      __typename: 'TaskListSectionLockStatus',
      modelPlanID: '123',
      section: TaskListSection.BENEFICIARIES,
      lockedByUserAccount: {
        id: '00000000-0000-0000-0000-000000000000',
        username: 'ABCD',
        commonName: 'ABCD Doe',
        __typename: 'UserAccount'
      },
      isAssessment: false
    };

    const expectedValue: LockSectionType[] = [];

    const addedLock = removeLockedSection(
      [
        {
          __typename: 'TaskListSectionLockStatus',
          modelPlanID: '123',
          section: TaskListSection.BENEFICIARIES,
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
