import { TaskListSubscription_onLockTaskListSectionContext_lockStatus as LockSectionType } from 'queries/TaskListSubscription/types/TaskListSubscription';
import { TaskListSection } from 'types/graphql-global-types';

import { findLockedSection, LockStatus } from '.';

const locks: LockSectionType[] = [
  {
    __typename: 'TaskListSectionLockStatus',
    modelPlanID: '123',
    section: TaskListSection.BENEFICIARIES,
    lockedBy: 'MINT',
    isAssessment: true
  },
  {
    __typename: 'TaskListSectionLockStatus',
    modelPlanID: '123',
    section: TaskListSection.PAYMENT,
    lockedBy: 'ABCD',
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
    const route: TaskListSection = TaskListSection.IT_TOOLS;

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
