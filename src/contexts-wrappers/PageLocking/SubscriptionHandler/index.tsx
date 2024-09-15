/**
  Subscription handler for checking lock statuses, adding locks, and removing locks
  Utilizes the SubscriptionContext to listen for updates made from locking/unlocking mutations
  Uses app location to identify the model plan and current task list section of the model plan
  Redirects locked and errors states to /locked-task-list-section view
 */

import React, { useContext } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { SubscriptionContext } from 'contexts-wrappers/PageLocking/SubscriptionWrapper';
import { RouterContext } from 'contexts-wrappers/RouterContext';
import {
  GetTaskListSubscriptionsQuery,
  TaskListSection,
  useLockTaskListSectionMutation,
  useUnlockTaskListSectionMutation
} from 'gql/generated/graphql';

import { isUUID } from 'utils/modelPlan';

type LockSectionType = GetTaskListSubscriptionsQuery['taskListSectionLocks'][0];

type SubscriptionHandlerProps = {
  children: React.ReactNode;
};

export enum LockStatus {
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED',
  OCCUPYING = 'OCCUPYING',
  CANT_LOCK = 'CANT_LOCK'
}

type TaskListSectionMapType = {
  [key: string]: TaskListSection;
};

// Map used to connect url route to Subscription Task List Section
export const taskListSectionMap: TaskListSectionMapType = {
  basics: TaskListSection.BASICS,
  beneficiaries: TaskListSection.BENEFICIARIES,
  characteristics: TaskListSection.GENERAL_CHARACTERISTICS,
  'ops-eval-and-learning': TaskListSection.OPERATIONS_EVALUATION_AND_LEARNING,
  'participants-and-providers': TaskListSection.PARTICIPANTS_AND_PROVIDERS,
  payment: TaskListSection.PAYMENT
};

// Find lock and sets the LockStatus of the current task list section
// Returns - LOCKED || UNLOCKED || OCCUPYING
export const findLockedSection = (
  locks: LockSectionType[],
  route: TaskListSection,
  userEUA?: string
): LockStatus => {
  const foundLockedSection = locks.find(
    (section: LockSectionType) => section.section === route
  );

  // If the locked section is not found, set to UNLOCKED, then send mutation to lock
  if (!foundLockedSection) {
    return LockStatus.UNLOCKED;
  }
  if (
    foundLockedSection &&
    foundLockedSection.lockedByUserAccount.username !== userEUA
  ) {
    // If the locked section is found - render locked screen
    return LockStatus.LOCKED;
  }
  // user currently has the lock
  return LockStatus.OCCUPYING;
};

// Parses task list route to map to taskListSectionMap
const taskListRouteParser = (route: string): string => {
  return route.split('/')[5];
};

const SubscriptionHandler = ({ children }: SubscriptionHandlerProps) => {
  // Context used to get/set previous routes
  const { to, from, setRoute } = useContext(RouterContext);

  // Get the subscription context - messages (locks, unlocks), loading
  const { taskListSectionLocks, loading } = useContext(SubscriptionContext);

  const history = useHistory();

  const modelID = to.split('/')[2];

  const isTaskList = to.split('/')[4] === 'task-list';

  const taskListRoute = taskListRouteParser(to);

  const { euaId } = useSelector((state: RootStateOrAny) => state.auth);

  const validModelID: boolean = isUUID(modelID);

  const taskListSection: TaskListSection = taskListSectionMap[taskListRoute];

  const [addLock, { loading: addLockLoading }] =
    useLockTaskListSectionMutation();

  const [removeLock, { loading: removeLockLoading }] =
    useUnlockTaskListSectionMutation();

  let lockState: LockStatus;

  // Checks to see the status of task list section
  // Returns - 'LOCKED', 'UNLOCKED', 'OCCUPYING', or 'CANT_LOCK' (pages that don't require locking)
  // 'OCCUPYING' refers to the current user already occupying the page
  if (
    taskListSection &&
    taskListSectionLocks &&
    euaId &&
    !addLockLoading &&
    !removeLockLoading &&
    !loading
  ) {
    lockState = findLockedSection(
      taskListSectionLocks,
      taskListSection,
      euaId as string
    );
  } else {
    lockState = LockStatus.CANT_LOCK;
  }

  if (lockState === LockStatus.LOCKED) {
    return (
      <Redirect
        push
        to={{
          pathname: `/models/${modelID}/locked-task-list-section`,
          // Passing the route for breadcrumbs on locked section page
          state: { route: taskListRoute }
        }}
      />
    );
  }

  // Removes a section that is locked
  const removeLockedSection = (section: LockSectionType) => {
    removeLock({
      variables: {
        modelPlanID: section.modelPlanID,
        section: section.section
      }
    })
      .then(() => {
        setRoute((prev: any) => ({
          to,
          from: prev.to
        }));
      })
      .catch(() => {
        history.push({
          pathname: `/models/${modelID}/locked-task-list-section`,
          // Passing error status to default error page
          state: { route: taskListRoute, error: true }
        });
      });
  };

  // Removes a section that is locked
  const addLockedSection = (section: TaskListSection) => {
    addLock({
      variables: {
        modelPlanID: modelID,
        section
      }
    }).catch(() => {
      history.push({
        pathname: `/models/${modelID}/locked-task-list-section`,
        // Passing error status to default error page
        state: { route: taskListRoute, error: true }
      });
    });
  };

  // Checks to see if section should be unlocked
  if (
    validModelID &&
    !taskListSection &&
    taskListSectionLocks?.length > 0 &&
    !addLockLoading &&
    !removeLockLoading &&
    !loading &&
    from && // from will be undefined or empty string if refreshed
    from !== to
  ) {
    // Located section to be removed
    const lockedSection = taskListSectionLocks.find(
      (section: LockSectionType) =>
        section.lockedByUserAccount.username === euaId &&
        section.section === taskListSectionMap[taskListRouteParser(from)]
    );

    if (lockedSection) removeLockedSection(lockedSection);
  }

  // Checks to see if section should be locked and calls mutation to add lock
  if (
    (lockState === LockStatus.UNLOCKED || lockState === LockStatus.OCCUPYING) &&
    isTaskList &&
    taskListSection &&
    validModelID &&
    !addLockLoading &&
    !removeLockLoading &&
    !loading
  ) {
    // Check if need to unlock previous section before adding new section
    // i.e. end of task list section or any react-router redirect from one section directly to another
    const prevLockedSection = taskListSectionLocks.find(
      (section: LockSectionType) =>
        section.lockedByUserAccount.username === euaId &&
        taskListSectionMap[taskListRouteParser(from)] === section.section &&
        taskListSectionMap[taskListRouteParser(to)] !== section.section &&
        from !== to
    );

    if (prevLockedSection) {
      removeLockedSection(prevLockedSection);
    }

    if (lockState === LockStatus.UNLOCKED) {
      addLockedSection(taskListSection);
    }
  }

  return <div>{children}</div>;
};

export default SubscriptionHandler;
