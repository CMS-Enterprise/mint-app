import React, { useEffect, useState } from 'react';
import { BlockerFunction, useBlocker, useLocation } from 'react-router-dom';
import {
  OperationVariables,
  TypedDocumentNode,
  useMutation
} from '@apollo/client';
import { FormikProps } from 'formik';
import { DocumentNode } from 'graphql';

import dirtyInput from 'utils/formUtil';
import sanitizeStatus from 'utils/status';

type HandleFormikMutationConfigType<T> = {
  id: string;
  formikRef: React.RefObject<FormikProps<T> | null>;
};

type HandleRHFMutationConfigType<T> = {
  id: string;
  rhfRef: {
    initialValues: T;
    values: T;
  };
};

type HandleMutationConfigType<T> =
  | HandleFormikMutationConfigType<T>
  | HandleRHFMutationConfigType<T>;

type ModalConfigType = {
  isModalOpen: boolean;
  destinationURL: string;
  closeModal: () => void;
};

type MutationReturnType = {
  mutationError: ModalConfigType;
  loading: boolean;
};

/**
 * __useHandleMutation__
 *
 * Custom hook used to handle generic/most mutations on the model plan task list
 * Leverages react-router-dom history.block to wait for route transition while the mutation is called
 * On success, will forward to destinationURL, on error will set isModalOpen to true, allowing component to render a modal
 *
 *
 * @param {DocumentNode | TypedDocumentNode<TData, TVariables>} mutation
 * @param {HandleMutationConfigType} config
 * @returns MutationReturnType
 */

function useHandleMutation<T, TData = any, TVariables = OperationVariables>(
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
  config: HandleMutationConfigType<T>
): MutationReturnType {
  const { pathname } = useLocation();

  const [destinationURL, setDestinationURL] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [pendingLocation, setPendingLocation] = useState<string | null>(null);

  const [update, { loading }] = useMutation<TData, OperationVariables>(
    mutation
  );

  const { id } = config;

  // Create a blocker function that determines if navigation should be blocked
  const shouldBlock: BlockerFunction = tx => {
    // Don't call mutation if attempting to access a locked section
    if (tx.nextLocation.pathname.includes('locked-task-list-section')) {
      return false;
    }

    if (tx.nextLocation.pathname === pathname) {
      return false;
    }

    const dirtyChanges = () => {
      if ('formikRef' in config) {
        return dirtyInput(
          config.formikRef.current?.initialValues,
          config.formikRef.current?.values
        );
      }
      return dirtyInput(config.rhfRef.initialValues, config.rhfRef.values);
    };

    const changes = dirtyChanges();

    // If no changes, don't call mutation
    if (Object.keys(changes).length === 0) {
      return false;
    }

    // Store the pending location for later navigation
    setPendingLocation(tx.nextLocation.pathname);

    if (changes.status) {
      changes.status = sanitizeStatus(changes.status);
    }

    update({
      variables: {
        id,
        changes
      }
    })
      .then(response => {
        if (!response?.errors) {
          setDestinationURL(tx.nextLocation.pathname);
          blocker?.proceed?.();
        }
      })
      .catch(errors => {
        setDestinationURL(tx.nextLocation.pathname);
        setIsModalOpen(true);

        if ('formikRef' in config) {
          config.formikRef.current?.setErrors(errors);
        }
        blocker?.proceed?.();
      });

    return true; // Block the navigation
  };

  // Use the useBlocker hook
  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    if (destinationURL && !isModalOpen) {
      blocker?.proceed?.();
    }
  }, [destinationURL, blocker, isModalOpen]);

  // Handle the blocker state
  useEffect(() => {
    if (blocker.state === 'blocked' && pendingLocation) {
      // The navigation was blocked, we can handle it here if needed
      // The mutation is already running from the shouldBlock function
    }
  }, [blocker.state, pendingLocation]);

  const clearDestinationURL = () => setDestinationURL('');

  const closeModal = () => {
    setIsModalOpen(false);
    clearDestinationURL();
  };

  return {
    mutationError: {
      isModalOpen,
      destinationURL,
      closeModal
    },
    loading
  };
}

export default useHandleMutation;
