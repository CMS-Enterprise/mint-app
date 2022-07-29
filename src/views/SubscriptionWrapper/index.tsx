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

// Create the subscription context - can be used anywhere in a model plan
export const SubscriptionContext = createContext({
  data: {}
});

const SubscriptionWrapper = ({ children }: SubscriptionWrapperProps) => {
  // Gets the model plan id from any location within the application
  const { pathname } = useLocation();
  const modelID = pathname.split('/')[2];

  // The value that will be given to the context
  const [taskListData, setTaskListData] = useState({});

  // Hook useLazyQuery to only init query and subscribe on the presence of a new model plan id
  const [getTaskListLocks, { data, subscribeToMore }] = useLazyQuery(
    GetTaskListSubscriptions
  );

  useEffect(() => {
    if (modelID) {
      setTaskListData(data);

      getTaskListLocks({ variables: { modelPlanID: modelID } });
      subscribeToMore({
        document: SubscribeToTaskList,
        variables: {
          modelPlanID: modelID
        },
        updateQuery: (prev, { subscriptionData }) => {
          const lockChange = subscriptionData.data;
          if (!lockChange) return prev;

          if (
            lockChange.onTaskListSectionLocksChanged.changeType === 'REMOVED'
          ) {
            // function to update context on the removal of lock
          } else {
            // function to update context on the addition of lock
          }

          const updatedData = { ...prev, subscriptionData };
          setTaskListData(updatedData);
          return updatedData;
        }
      });
    }
  }, [modelID, data, getTaskListLocks, subscribeToMore]);

  return (
    // The Provider gives access to the context to its children
    <SubscriptionContext.Provider value={{ data: taskListData }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionWrapper;
