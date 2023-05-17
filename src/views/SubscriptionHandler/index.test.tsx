import { TaskListSubscription_onLockTaskListSectionContext_lockStatus as LockSectionType } from 'queries/TaskListSubscription/types/TaskListSubscription';
import { TaskListSection } from 'types/graphql-global-types';

import { findLockedSection, LockStatus } from '.';

const locks: LockSectionType[] = [
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
  },
  {
    __typename: 'TaskListSectionLockStatus',
    modelPlanID: '123',
    section: TaskListSection.PAYMENT,
    lockedByUserAccount: {
      id: '00000001-0001-0001-0001-000000000001',
      username: 'MINT',
      commonName: 'MINT Doe',
      __typename: 'UserAccount'
    },
    isAssessment: false
  }
];

const euaId = 'QWER';

describe('SubscriptionHandler functions', () => {
  it('finds a locked section', () => {
    const route: TaskListSection = TaskListSection.PAYMENT;

    const expectedValue: LockStatus = LockStatus.LOCKED;

    const lockStatus = findLockedSection(locks, route, euaId);

    expect(lockStatus).toEqual(expectedValue);
  });

  it('finds an unlocked section', () => {
    const route: TaskListSection = TaskListSection.BASICS;

    const expectedValue: LockStatus = LockStatus.UNLOCKED;

    const lockStatus = findLockedSection(locks, route, euaId);

    expect(lockStatus).toEqual(expectedValue);
  });

  it('finds an occupied section', () => {
    const route: TaskListSection = TaskListSection.BENEFICIARIES;

    const expectedValue: LockStatus = LockStatus.OCCUPYING;

    const lockStatus = findLockedSection(locks, route, 'MINT');

    expect(lockStatus).toEqual(expectedValue);
  });
});
