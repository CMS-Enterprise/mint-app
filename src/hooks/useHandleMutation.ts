import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  OperationVariables,
  TypedDocumentNode,
  useMutation
} from '@apollo/client';
import { FormikProps } from 'formik';
import { DocumentNode } from 'graphql';

import dirtyInput from 'utils/formDiff';
import sanitizeStatus from 'utils/status';

type HandleMutationConfigType = {
  id: string;
  formikRef: React.RefObject<FormikProps<any>>;
};

function useHandleMutation<TData = any, TVariables = OperationVariables>(
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
  config: HandleMutationConfigType
) {
  const history = useHistory();
  const { pathname } = useLocation();

  const [destinationURL, setDestinationURL] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [update] = useMutation<TData, OperationVariables>(mutation);

  const { id, formikRef } = config;

  useEffect(() => {
    if (!isModalOpen) {
      const unblock = history.block(location => {
        if (location.pathname === pathname) {
          return false;
        }

        const changes = dirtyInput(
          formikRef?.current?.initialValues,
          formikRef?.current?.values
        );

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
              unblock();
              history.push(location.pathname);
            }
          })
          .catch(errors => {
            unblock();
            setDestinationURL(location.pathname);
            setIsModalOpen(true);

            formikRef?.current?.setErrors(errors);
          });
        return false;
      });

      return () => {
        unblock();
      };
    }
    return () => {};
  }, [history, id, update, isModalOpen, formikRef, setIsModalOpen, pathname]);

  return {
    mutationError: { isModalOpen, setIsModalOpen, destinationURL }
  };
}

export default useHandleMutation;
