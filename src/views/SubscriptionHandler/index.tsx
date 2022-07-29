/**
  Subscription wrapper and context for fetching and updating task list locked states.
  subscribeToMore method returns a previous state and a new subscription message.
  SubscriptionContext gets modified based on the addition or removal of a locked task list section.
  SubscriptionContext can be accessed from anywhere in a model plan
 */

import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useOktaAuth } from '@okta/okta-react';

import LockTaskListSection from 'queries/TaskListSubscription/LockTaskListSection';
import { TaskListSection } from 'types/graphql-global-types';
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

  const [locking, setLocking] = useState<boolean>(false);

  const taskListSection = taskListSectionMap[taskListRoute];

  const { authState } = useOktaAuth();

  const subscriptionLocks = useContext(SubscriptionContext);

  const [update] = useMutation(LockTaskListSection);

  let lockState: LockStatus | undefined;
  if (
    taskListSection &&
    subscriptionLocks?.taskListSectionLocks &&
    authState?.euaId
  ) {
    lockState = findLockedSection(
      subscriptionLocks.taskListSectionLocks,
      taskListSection,
      authState?.euaId as string
    );
  }
  console.log(lockState);

  if (lockState === LockStatus.UNLOCKED && !locking) {
    setLocking(true);
    update({
      variables: {
        modelPlanID: modelID,
        section: taskListSection
      }
    })
      .then(response => {
        console.log(response);
        setLocking(false);
      })
      .catch(errors => {
        console.log(errors);
        setLocking(false);
      });
  }

  return <div>{children}</div>;
};

export default SubscriptionHandler;
