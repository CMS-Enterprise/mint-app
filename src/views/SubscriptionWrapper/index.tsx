/**
  Subscription wrapper and context for fetching and updating task list locked states.
  subscribeToMore method returns a previous state and a new subscription message.
  context get modified based on the addition or removal of a locked task list section.
  context can be accessed from anywhere in a model plan
 */

import React, { createContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';

import GetTaskListSubscriptions from 'queries/TaskListSubscription/GetTaskListSubscriptions';
import SubscribeToTaskList from 'queries/TaskListSubscription/SubscribeToTaskList';

type SubscriptionWrapperProps = {
  children: React.ReactNode;
};

type LockSectionType = {
  lockedBy: string;
  modelPlanID: string;
  refCount: number;
  section: string;
  __typename: 'TaskListSectionLockStatus';
};

// function to update SubscriptionContext on the removal of lock
const removeLockedSection = (
  locksToUpdate: LockSectionType[],
  lockSection: LockSectionType
) => {
  const updatedLock: LockSectionType[] = [...locksToUpdate];

  // Finds and removes the locked object from the SubscriptionContext array
  updatedLock.splice(
    updatedLock.findIndex((section: LockSectionType) => {
      return section.section === lockSection.section;
    }),
    1
  );
  return updatedLock;
};

// function to update context on the addition of lock
const addLockedSection = (
  locksToUpdate: LockSectionType[],
  lockSection: LockSectionType
) => {
  const updatedLock: LockSectionType[] = [...locksToUpdate];

  // Finds the lock index from the SubscriptionContext array
  const foundSectionIndex: number = locksToUpdate.findIndex(
    (section: LockSectionType) => section.section === lockSection.section
  );

  // If the lock exists, replace the lock object
  if (foundSectionIndex !== -1) {
    updatedLock[foundSectionIndex] = lockSection;
    // Otherwise add the lock object to the SubscriptionContext array
  } else {
    updatedLock.push(lockSection);
  }
  return updatedLock;
};

// Create the subscription context - can be used anywhere in a model plan
export const SubscriptionContext = createContext<{
  taskListSectionLocks: LockSectionType[];
}>({
  taskListSectionLocks: []
});

const SubscriptionWrapper = ({ children }: SubscriptionWrapperProps) => {
  // Gets the model plan id from any location within the application
  const { pathname } = useLocation();
  const modelID = pathname.split('/')[2];

  // The value that will be given to the context
  const [taskListData, setTaskListData] = useState<{
    taskListSectionLocks: LockSectionType[];
  }>({
    taskListSectionLocks: []
  });

  // Hook useLazyQuery to only init query and subscribe on the presence of a new model plan id
  const [getTaskListLocks, { data, subscribeToMore }] = useLazyQuery(
    GetTaskListSubscriptions
  );

  useEffect(() => {
    if (modelID) {
      // useLazyQuery hook to fetch data on new modelID
      getTaskListLocks({ variables: { modelPlanID: modelID } });

      // Sets the initial lock statuses once useLazyQuery data is fetched
      setTaskListData(data);

      // Subscription initiator and message update method
      subscribeToMore({
        document: SubscribeToTaskList,
        variables: {
          modelPlanID: modelID
        },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;

          const lockChange =
            subscriptionData.data.onTaskListSectionLocksChanged;

          let updatedLock;

          // If section lock is to be freed, remove the lock from the SubscriptionContext
          if (lockChange.changeType === 'REMOVED') {
            updatedLock = removeLockedSection(
              prev.taskListSectionLocks,
              lockChange.lockStatus
            );
            // If section lock is to be added, add the lock from the SubscriptionContext
          } else {
            updatedLock = addLockedSection(
              prev.taskListSectionLocks,
              lockChange.lockStatus
            );
          }

          // Formatting lock object to mirror prev updateQuery param
          const formattedLocks = {
            taskListSectionLocks: updatedLock
          };

          console.log(formattedLocks);

          setTaskListData(formattedLocks);
          // Returns the formatted locks to be used as the next 'prev' parameter of updateQuery
          return formattedLocks;
        }
      });
    }
  }, [modelID, data, getTaskListLocks, subscribeToMore]);

  return (
    // The Provider gives access to the context to its children
    <SubscriptionContext.Provider value={taskListData}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionWrapper;
