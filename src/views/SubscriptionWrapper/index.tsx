/**
  Subscription wrapper and context for fetching and updating task list locked states.
  subscribeToMore method returns a previous state and a new subscription message.
  SubscriptionContext gets modified based on the addition or removal of a locked task list section.
  SubscriptionContext can be accessed from anywhere in a model plan
 */

import React, { createContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';

import GetTaskListSubscriptions from 'queries/TaskListSubscription/GetTaskListSubscriptions';
import SubscribeToTaskList from 'queries/TaskListSubscription/SubscribeToTaskList';
import { isUUID } from 'utils/modelPlan';

type SubscriptionWrapperProps = {
  children: React.ReactNode;
};

export type LockSectionType = {
  lockedBy: string;
  modelPlanID: string;
  refCount: number;
  section: string;
  __typename: 'TaskListSectionLockStatus';
};

// Updates SubscriptionContext on the removal of lock
const removeLockedSection = (
  locksToUpdate: LockSectionType[] = [],
  lockSection: LockSectionType
) => {
  const updatedLocks: LockSectionType[] = [...locksToUpdate];

  // Finds and removes the locked object from the SubscriptionContext array
  updatedLocks.splice(
    updatedLocks.findIndex((section: LockSectionType) => {
      return section.section === lockSection.section;
    }),
    1
  );
  return updatedLocks;
};

// Updates SubscriptionContext on the addition of lock
const addLockedSection = (
  locksToUpdate: LockSectionType[] = [],
  lockSection: LockSectionType
) => {
  const updatedLocks: LockSectionType[] = [...locksToUpdate];

  // Finds the lock index from the SubscriptionContext array
  const foundSectionIndex: number = locksToUpdate.findIndex(
    (section: LockSectionType) => section.section === lockSection.section
  );

  // If the lock exists, replace the lock object
  if (foundSectionIndex !== -1) {
    updatedLocks[foundSectionIndex] = lockSection;
    // Otherwise add the lock object to the SubscriptionContext array
  } else {
    updatedLocks.push(lockSection);
  }
  return updatedLocks;
};

// Create the subscription context - can be used anywhere in a model plan
export const SubscriptionContext = createContext<{
  taskListSectionLocks: LockSectionType[];
  loading: boolean;
}>({
  taskListSectionLocks: [],
  loading: true
});

const SubscriptionWrapper = ({ children }: SubscriptionWrapperProps) => {
  // Gets the model plan id from any location within the application
  const { pathname } = useLocation();
  const modelID = pathname.split('/')[2];
  const validModelID: boolean = isUUID(modelID);

  // The value that will be given to the context
  const [subscriptionContextData, setSubscriptionContextData] = useState<{
    taskListSectionLocks: LockSectionType[];
    loading: boolean;
  }>({
    taskListSectionLocks: [],
    loading: true
  });

  // useLazyQuery hook to init query and create subscription in the presence of a new model plan id
  const [getTaskListLocks, { data, subscribeToMore }] = useLazyQuery(
    GetTaskListSubscriptions
  );

  useEffect(() => {
    if (modelID && validModelID) {
      // useLazyQuery hook to fetch existing subscription data on new modelID
      getTaskListLocks({ variables: { modelPlanID: modelID } });

      // Sets the initial lock statuses once useLazyQuery data is fetched
      setSubscriptionContextData({ ...data, loading: false });

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

          const updatedSubscriptionContext =
            lockChange.changeType === 'REMOVED'
              ? // If section lock is to be freed, remove the lock from the SubscriptionContext
                removeLockedSection(
                  prev.taskListSectionLocks,
                  lockChange.lockStatus
                )
              : // If section lock is to be added, add the lock from the SubscriptionContext
                addLockedSection(
                  prev.taskListSectionLocks,
                  lockChange.lockStatus
                );

          // Formatting lock object to mirror prev updateQuery param
          const formattedSubscriptionContext = {
            taskListSectionLocks: updatedSubscriptionContext,
            loading: false
          };

          setSubscriptionContextData(formattedSubscriptionContext);
          // Returns the formatted locks to be used as the next 'prev' parameter of updateQuery
          return formattedSubscriptionContext;
        }
      });
    }
    return () => {
      getTaskListLocks();
    };
  }, [modelID, validModelID, data, getTaskListLocks, subscribeToMore]);

  return (
    // The Provider gives access to the context to its children
    <SubscriptionContext.Provider value={subscriptionContextData}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionWrapper;
