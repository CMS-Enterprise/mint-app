/**
  Subscription wrapper and context for fetching and updating task list locked states.
  subscribeToMore method returns a previous state and a new subscription message.
  SubscriptionContext gets modified based on the addition or removal of a locked task list section.
  SubscriptionContext can be accessed from anywhere in a model plan
 */

import React, { createContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ChangeType,
  GetLockedModelPlanSectionsQuery,
  ModelPlanSubscriptionDocument,
  ModelPlanSubscriptionSubscription,
  useGetLockedModelPlanSectionsLazyQuery
} from 'gql/generated/graphql';

import { isUUID } from 'utils/modelPlan';

type LockSectionType =
  GetLockedModelPlanSectionsQuery['lockableSectionLocks'][0];

type SubscriptionWrapperProps = {
  children: React.ReactNode;
};

// Updates SubscriptionContext on the addition of lock
export const addLockedSection = (
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

// Updates SubscriptionContext on the removal of lock
export const removeLockedSection = (
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

// Create the subscription context - can be used anywhere in a model plan
export const SubscriptionContext = createContext<{
  lockableSectionLocks: LockSectionType[];
  loading: boolean;
}>({
  lockableSectionLocks: [],
  loading: true
});

const SubscriptionWrapper = ({ children }: SubscriptionWrapperProps) => {
  // Gets the model plan id from any location within the application
  const { pathname } = useLocation();
  const modelID: string | undefined = pathname.split('/')[2];
  const validModelID: boolean = isUUID(modelID);

  // Needed to only subscribe on task-list views of current model
  const taskList: boolean = pathname.split('/')[4] === 'task-list';

  // Holds reference to subscribeToMore used for closing ws connection on leaving model plan
  const subscribed = useRef<ReturnType<typeof subscribeToMore> | null>(null);

  // // The value that will be given to the context
  const subscriptionContextData = useRef<{
    lockableSectionLocks: LockSectionType[];
    loading: boolean;
  }>({
    lockableSectionLocks: [],
    loading: true
  });

  // useLazyQuery hook to init query and create subscription in the presence of a new model plan id
  const [getTaskListLocks, { data: subData, subscribeToMore }] =
    useGetLockedModelPlanSectionsLazyQuery();

  useEffect(() => {
    if (validModelID && subscribeToMore && taskList) {
      // useLazyQuery hook to fetch existing subscription data on new modelID
      getTaskListLocks({ variables: { modelPlanID: modelID } });

      if (subData) {
        // Sets the initial lock statuses once useLazyQuery data is fetched
        subscriptionContextData.current = { ...subData, loading: false };
      }

      if (!subscribed.current) {
        // Subscription initiator and message update method
        subscribed.current = subscribeToMore({
          document: ModelPlanSubscriptionDocument,
          variables: {
            modelPlanID: modelID
          },
          updateQuery: (
            prev,
            {
              subscriptionData: { data }
            }: { subscriptionData: { data: ModelPlanSubscriptionSubscription } }
          ) => {
            if (!data) return prev;

            const lockChange = data.onLockLockableSectionContext;

            const updatedSubscriptionContext =
              lockChange.changeType === ChangeType.REMOVED
                ? // If section lock is to be freed, remove the lock from the SubscriptionContext
                  removeLockedSection(
                    prev.lockableSectionLocks,
                    lockChange.lockStatus
                  )
                : // If section lock is to be added, add the lock from the SubscriptionContext
                  addLockedSection(
                    prev.lockableSectionLocks,
                    lockChange.lockStatus
                  );

            // Formatting lock object to mirror prev updateQuery param
            const formattedSubscriptionContext = {
              ...prev,
              lockableSectionLocks: updatedSubscriptionContext,
              loading: false
            };

            subscriptionContextData.current = formattedSubscriptionContext;
            // Returns the formatted locks to be used as the next 'prev' parameter of updateQuery
            return formattedSubscriptionContext;
          }
        });
      }
    } else {
      // Unsubscribe from GQL Subscription
      // Invoking the reference to subscribeToMore within subscribed.current will close the ws connection
      if (subscribed.current) subscribed.current();
      subscribed.current = null;
    }
  }, [
    modelID,
    taskList,
    validModelID,
    subData,
    getTaskListLocks,
    subscribeToMore,
    subscribed
  ]);

  return (
    // The Provider gives access to the context to its children
    <SubscriptionContext.Provider value={subscriptionContextData.current}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionWrapper;
