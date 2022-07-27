import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';

import SubscribeToTaskList from 'queries/TaskListSubscription/SubscribeToTaskList';

type SubscriptionWrapperProps = {
  children: React.ReactNode;
};

const SubscriptionWrapper = ({ children }: SubscriptionWrapperProps) => {
  //   const client = useApolloClient();
  //   const { pathname } = useLocation();
  //   const modelID = pathname.split('/')[2];

  //   useEffect(() => {
  //     if (modelID) {
  //       client.subscribe({
  //         query: SubscribeToTaskList,
  //         variables: { modelPlanID: modelID }
  //       });
  //     }
  //   }, [modelID, client]);

  return <>{children}</>;
};

export default SubscriptionWrapper;
