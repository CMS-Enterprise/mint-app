/**
  Subscription wrapper and context for fetching and updating task list locked states.
  subscribeToMore method returns a previous state and a new subscription message.
  SubscriptionContext gets modified based on the addition or removal of a locked task list section.
  SubscriptionContext can be accessed from anywhere in a model plan
 */

import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useOktaAuth } from '@okta/okta-react';

import LockTaskListSection from 'queries/TaskListSubscription/LockTaskListSection';
import { LockTaskListSectionVariables } from 'queries/TaskListSubscription/types/LockTaskListSection';
import { UnlockTaskListSectionVariables } from 'queries/TaskListSubscription/types/UnlockTaskListSection';
import UnlockTackListSection from 'queries/TaskListSubscription/UnlockTackListSection';
import { TaskListSection } from 'types/graphql-global-types';
import { isUUID } from 'utils/modelPlan';
import {
  LockSectionType,
  SubscriptionContext
} from 'views/SubscriptionWrapper';

type SubscriptionHandlerProps = {
  children: React.ReactNode;
};

enum LockStatus {
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED',
  OCCUPYING = 'OCCUPYING',
  CANT_LOCK = 'CANT_LOCK'
}

type TaskListSectionMapType = {
  [key: string]: string;
};

// Map used to connect url route to Task List Section
const taskListSectionMap: TaskListSectionMapType = {
  basics: TaskListSection.MODEL_BASICS,
  beneficiaries: TaskListSection.BENEFICIARIES,
  characteristics: TaskListSection.GENERAL_CHARACTERISTICS,
  'it-tools': TaskListSection.IT_TOOLS,
  'ops-eval-and-learning': TaskListSection.OPERATIONS_EVALUATION_AND_LEARNING,
  'participants-and-providers': TaskListSection.PARTICIPANTS_AND_PROVIDERS,
  payment: TaskListSection.PAYMENT
};

// Find lock and sets the LockStatus of the current task list section
const findLockedSection = (
  locks: LockSectionType[],
  route: string,
  userEUA: string
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

const SubscriptionHandler = ({ children }: SubscriptionHandlerProps) => {
  // Gets the modelID and tasklist section route from any location within the application
  const { pathname } = useLocation();
  const modelID = pathname.split('/')[2];
  const taskListRoute = pathname.split('/')[4];

  const history = useHistory();

  const validModelID: boolean = isUUID(modelID);

  const [prevPath, setPrevPath] = useState<string>('');

  // Component states for handling locking/unlocking loading mutation loading
  // Is a more solid way to control loading without rerender interruptions
  const [locking, setLocking] = useState<boolean>(false);

  let lockState: LockStatus;

  const taskListSection = taskListSectionMap[taskListRoute];

  const { authState } = useOktaAuth();

  // Get the subscription context - messages (locks, unlocks), loading
  const { taskListSectionLocks, loading } = useContext(SubscriptionContext);

  const [addLock] = useMutation<LockTaskListSectionVariables>(
    LockTaskListSection
  );

  const [removeLock] = useMutation<UnlockTaskListSectionVariables>(
    UnlockTackListSection
  );

  /**
   * Checks to see the status of task list section
   * Returns - 'LOCKED', 'UNLOCKED', 'OCCUPYING', or 'CANT_LOCK' (pages that don't require locking)
   * 'OCCUPYING' refers to the current user already occupying the page
   */
  if (
    taskListSection &&
    taskListSectionLocks &&
    authState?.euaId &&
    !locking &&
    !loading
  ) {
    lockState = findLockedSection(
      taskListSectionLocks,
      taskListSection,
      authState?.euaId as string
    );
  } else {
    lockState = LockStatus.CANT_LOCK;
  }

  if (lockState === LockStatus.LOCKED) {
    history.push({
      pathname: `/models/${modelID}/locked-task-list-section`,
      // Passing the route for breadcrumbs on locked section page
      state: { route: taskListRoute }
    });
  }

  // Checks the location before unmounting to see if lock should be unlocked
  useEffect(() => {
    return () => {
      setPrevPath(pathname);
    };
  }, [pathname]);

  // Checks to see if section should be unlocked and calls mutation
  if (
    (!validModelID || !taskListSection) &&
    taskListSectionLocks?.length > 0 &&
    !locking
  ) {
    const prevModelID = prevPath.split('/')[2];

    const lockedSection = taskListSectionLocks.find(
      (section: LockSectionType) => section.lockedBy === authState?.euaId
    );

    if (lockedSection && isUUID(prevModelID)) {
      setLocking(true);
      removeLock({
        variables: {
          modelPlanID: lockedSection.modelPlanID,
          section: lockedSection.section
        }
      })
        .then(() => {
          setLocking(false);
        })
        .catch(() => {
          setLocking(false);
        });
    }
  }

  // Checks to see if section should be locked and calls mutation
  if (
    lockState === LockStatus.UNLOCKED &&
    taskListSection &&
    !locking &&
    !loading &&
    validModelID
  ) {
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
      });
  }

  return <div>{children}</div>;
};

export default SubscriptionHandler;
