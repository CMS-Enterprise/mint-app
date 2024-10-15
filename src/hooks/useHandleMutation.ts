import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  OperationVariables,
  TypedDocumentNode,
  useMutation
} from '@apollo/client';
import { FormikProps } from 'formik';
import { DocumentNode } from 'graphql';

import dirtyInput from 'utils/formUtil';
import sanitizeStatus from 'utils/status';

type HandleFormikMutationConfigType = {
  id: string;
  formikRef: React.RefObject<FormikProps<any>>;
};

type HandleRHFMutationConfigType = {
  id: string;
  rhfRef: {
    initialValues: any;
    values: any;
  };
};

type HandleMutationConfigType =
  | HandleFormikMutationConfigType
  | HandleRHFMutationConfigType;

type ModalConfigType = {
  isModalOpen: boolean;
  setIsModalOpen: (setOpen: boolean) => void;
  destinationURL: string;
};

type MutationReturnType = {
  mutationError: ModalConfigType;
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

function useHandleMutation<TData = any, TVariables = OperationVariables>(
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
  config: HandleMutationConfigType
): MutationReturnType {
  const history = useHistory();
  const { pathname } = useLocation();

  const [destinationURL, setDestinationURL] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [mutationUpdate] = useMutation<TData, OperationVariables>(mutation);

  const update = useMemo(() => mutationUpdate, [mutationUpdate]);

  const { id } = config;

  useEffect(() => {
    if (!isModalOpen) {
      // Blocks the route transition until unblock() is called
      const unblock = history.block(destination => {
        // Don't call mutation if attempting to access a locked section
        if (destination.pathname.includes('locked-task-list-section')) {
          unblock();
          history.push({
            pathname: destination.pathname,
            state: destination.state
          });
          return false;
        }

        if (destination.pathname === pathname) {
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
          unblock();
          history.push({
            pathname: destination.pathname,
            state: destination.state
          });
          return false;
        }

        if (changes.status) {
          changes.status = sanitizeStatus(changes.status);
        }

        unblock();
        history.push(destination.pathname);

        update({
          variables: {
            id,
            changes
          }
        })
          .then(response => {
            if (!response?.errors) {
              unblock();
              history.push(destination.pathname);
            }
          })
          .catch(errors => {
            unblock();
            setDestinationURL(destination.pathname);
            setIsModalOpen(true);

            if ('formikRef' in config) {
              config.formikRef.current?.setErrors(errors);
            }
          });
        return false;
      });

      return () => {
        unblock();
      };
    }
    return () => {};
  }, [history, id, update, isModalOpen, setIsModalOpen, pathname, config]);

  return {
    mutationError: { isModalOpen, setIsModalOpen, destinationURL }
  };
}

export default useHandleMutation;
