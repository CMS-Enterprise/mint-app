import { TaskListSubscription_onLockTaskListSectionContext_lockStatus as LockSectionType } from 'queries/TaskListSubscription/types/TaskListSubscription';
import { TaskListSection } from 'types/graphql-global-types';

import { addLockedSection, removeLockedSection } from '.';

describe('SubscriptionWrapper functions', () => {
  it('adds a locked section to subscription context', () => {
    const lockToAdd: LockSectionType = {
      __typename: 'TaskListSectionLockStatus',
      modelPlanID: '123',
      section: TaskListSection.BENEFICIARIES,
      lockedBy: 'MINT',
      isAssessment: true
    };

    const expectedValue: LockSectionType[] = [
      {
        __typename: 'TaskListSectionLockStatus',
        modelPlanID: '123',
        section: TaskListSection.BENEFICIARIES,
        lockedBy: 'MINT',
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
      lockedBy: 'ABCD',
      isAssessment: false
    };

    const expectedValue: LockSectionType[] = [
      {
        __typename: 'TaskListSectionLockStatus',
        modelPlanID: '123',
        section: TaskListSection.BENEFICIARIES,
        lockedBy: 'ABCD',
        isAssessment: false
      }
    ];

    const addedLock = addLockedSection(
      [
        {
          __typename: 'TaskListSectionLockStatus',
          modelPlanID: '123',
          section: TaskListSection.BENEFICIARIES,
          lockedBy: 'MINT',
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
      lockedBy: 'ABCD',
      isAssessment: false
    };

    const expectedValue: LockSectionType[] = [];

    const addedLock = removeLockedSection(
      [
        {
          __typename: 'TaskListSectionLockStatus',
          modelPlanID: '123',
          section: TaskListSection.BENEFICIARIES,
          lockedBy: 'ABCD',
          isAssessment: false
        }
      ],
      lockToRemove
    );

    expect(addedLock).toEqual(expectedValue);
  });
});
