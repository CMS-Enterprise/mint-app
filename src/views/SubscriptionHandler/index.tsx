/**
  Subscription wrapper and context for fetching and updating task list locked states.
  subscribeToMore method returns a previous state and a new subscription message.
  SubscriptionContext gets modified based on the addition or removal of a locked task list section.
  SubscriptionContext can be accessed from anywhere in a model plan
 */

import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
  OCCUPYING = 'OCCUPYING'
}

type taskListSectionMapType = {
  [key: string]: string;
};

const taskListSectionMap: taskListSectionMapType = {
  characteristics: TaskListSection.GENERAL_CHARACTERISTICS
};

// Checks if current page is locked
const findLockedSection = (
  locks: LockSectionType[],
  route: string,
  userEUA: string
): LockStatus => {
  // Finds the lock index from the SubscriptionContext array
  const foundLockedSection = locks.find(
    (section: LockSectionType) => section.section === route
  );

  // If the locked section is not found send mutation to lock
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
  // Gets the model plan id from any location within the application
  const { pathname } = useLocation();
  const modelID = pathname.split('/')[2];
  const taskListRoute = pathname.split('/')[4];

  const validModelID: boolean = isUUID(modelID);

  const [prevPath, setPrevPath] = useState<string>('');
  const [locking, setLocking] = useState<boolean>(false);

  const taskListSection = taskListSectionMap[taskListRoute];

  const { authState } = useOktaAuth();

  const { taskListSectionLocks, loading } = useContext(SubscriptionContext);

  const [addLock] = useMutation<LockTaskListSectionVariables>(
    LockTaskListSection
  );

  const [removeLock] = useMutation<UnlockTaskListSectionVariables>(
    UnlockTackListSection
  );

  let lockState: LockStatus | undefined;

  /**
   * Checks to see the status of task list section
   * Returns - 'LOCKED', 'UNLOCKED', or 'OCCUPYING'
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
  }

  // Checks the location before unmounting to see if lock should be unlocked
  useEffect(() => {
    return () => {
      setPrevPath(pathname);
    };
  }, [pathname]);

  if ((!validModelID || !taskListSection) && taskListSectionLocks?.length > 0) {
    const prevModelID = prevPath.split('/')[2];

    const lockedSection = taskListSectionLocks.find(
      (section: LockSectionType) => section.lockedBy === authState?.euaId
    );

    if (lockedSection && !locking && isUUID(prevModelID)) {
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
