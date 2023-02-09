/**
  Subscription handler for checking lock statuses, adding locks, and removing locks
  Utilizes the SubscriptionContext to listen for updates made from locking/unlocking mutations
  Uses app location to identify the model plan and current task list section of the model plan
  Redirects locked and errors states to /locked-task-list-section view
 */

import React, { useContext, useEffect, useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import LockTaskListSection from 'queries/TaskListSubscription/LockTaskListSection';
import { LockTaskListSectionVariables } from 'queries/TaskListSubscription/types/LockTaskListSection';
import { TaskListSubscription_onLockTaskListSectionContext_lockStatus as LockSectionType } from 'queries/TaskListSubscription/types/TaskListSubscription';
import { UnlockTaskListSectionVariables } from 'queries/TaskListSubscription/types/UnlockTaskListSection';
import UnlockTackListSection from 'queries/TaskListSubscription/UnlockTackListSection';
import { TaskListSection } from 'types/graphql-global-types';
import { isUUID } from 'utils/modelPlan';
import { RouterContext } from 'views/RouterContext';
import { SubscriptionContext } from 'views/SubscriptionWrapper';

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
  'it-tools': TaskListSection.IT_TOOLS,
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
  if (foundLockedSection && foundLockedSection.lockedBy !== userEUA) {
    // If the locked section is found - render locked screen
    return LockStatus.LOCKED;
  }
  // user currently has the lock
  return LockStatus.OCCUPYING;
};

// Parses task list route to map to taskListSectionMap
const taskListRouteParser = (route: string): string => {
  return route.split('/')[4];
};

const SubscriptionHandler = ({ children }: SubscriptionHandlerProps) => {
  // Gets the modelID and tasklist section route from any location within the application
  const { pathname } = useLocation();

  const modelID = pathname.split('/')[2];
  const taskList = pathname.split('/')[3] === 'task-list';
  const taskListRoute = taskListRouteParser(pathname);

  const history = useHistory();

  const validModelID: boolean = isUUID(modelID);

  // Used in addtion to mutation loading states to catch delayed updates to the context
  const [locking, setLocking] = useState<boolean>(false);

  const [removed, setRemoved] = useState<boolean>(true);

  let lockState: LockStatus;

  const taskListSection: TaskListSection = taskListSectionMap[taskListRoute];

  const { euaId } = useSelector((state: RootStateOrAny) => state.auth);

  // Get the subscription context - messages (locks, unlocks), loading
  const { taskListSectionLocks, loading } = useContext(SubscriptionContext);

  const { from } = useContext(RouterContext);

  const [
    addLock,
    { loading: addLockLoading }
  ] = useMutation<LockTaskListSectionVariables>(LockTaskListSection);

  const [
    removeLock,
    { loading: removeLockLoading }
  ] = useMutation<UnlockTaskListSectionVariables>(UnlockTackListSection);

  /**
   * Checks to see the status of task list section
   * Returns - 'LOCKED', 'UNLOCKED', 'OCCUPYING', or 'CANT_LOCK' (pages that don't require locking)
   * 'OCCUPYING' refers to the current user already occupying the page
   */
  if (
    taskListSection &&
    taskListSectionLocks &&
    euaId &&
    !addLockLoading &&
    !removeLockLoading &&
    !locking &&
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

  useEffect(() => {
    setRemoved(false);
    return () => {
      setRemoved(false);
    };
  }, [pathname]);

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
  const removeLockedSection = (section: LockSectionType | undefined) => {
    const prevModelID = from.split('/')[2];

    // Check if the prev path was a part of a model plan
    if (section && isUUID(prevModelID) && from !== pathname) {
      setRemoved(false);
      removeLock({
        variables: {
          modelPlanID: section.modelPlanID,
          section: section.section
        }
      })
        .then(() => {
          setRemoved(true);
        })
        .catch(() => {
          history.push({
            pathname: `/models/${modelID}/locked-task-list-section`,
            // Passing error status to default error page
            state: { route: taskListRoute, error: true }
          });
        });
    }
  };

  // Checks to see if section should be unlocked and calls mutation
  if (
    validModelID &&
    !taskListSection &&
    taskListSectionLocks?.length > 0 &&
    !addLockLoading &&
    !removeLockLoading &&
    !locking &&
    !loading &&
    from &&
    !removed
  ) {
    const lockedSection = taskListSectionLocks.find(
      (section: LockSectionType) =>
        section.lockedBy === euaId &&
        section.section === taskListSectionMap[taskListRouteParser(from)]
    );

    removeLockedSection(lockedSection);
  }

  // Checks to see if section should be locked and calls mutation to add lock
  if (
    (lockState === LockStatus.UNLOCKED || lockState === LockStatus.OCCUPYING) &&
    taskList &&
    taskListSection &&
    validModelID &&
    !addLockLoading &&
    !removeLockLoading &&
    !locking &&
    !loading
  ) {
    const prevLockedSection = taskListSectionLocks.find(
      (section: LockSectionType) =>
        section.lockedBy === euaId &&
        taskListSectionMap[taskListRouteParser(from)] === section.section &&
        taskListSectionMap[taskListRouteParser(pathname)] !== section.section &&
        !removed
    );

    // If coming from IT Tools or end of task list section
    // (Or any react-router redirect from one section directly to another)
    if (prevLockedSection) {
      removeLockedSection(prevLockedSection);
    }

    if (lockState === LockStatus.UNLOCKED) {
      setLocking(true);

      addLock({
        variables: {
          modelPlanID: modelID,
          section: taskListSection
        }
      })
        .then(() => {
          setLocking(false);
        })
        .catch(() => {
          setLocking(false);
          history.push({
            pathname: `/models/${modelID}/locked-task-list-section`,
            // Passing error status to default error page
            state: { route: taskListRoute, error: true }
          });
        });
    }
  }

  return <div>{children}</div>;
};

export default SubscriptionHandler;
