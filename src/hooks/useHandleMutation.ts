import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  OperationVariables,
  TypedDocumentNode,
  useMutation
} from '@apollo/client';
import { FormikProps } from 'formik';
import { DocumentNode } from 'graphql';

import dirtyInput from 'utils/formDiff';

function useHandleMutation<TData = any, TVariables = OperationVariables>(
  id: string,
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
  formikRef: React.RefObject<FormikProps<any>>
) {
  const history = useHistory();

  const [destinationURL, setDestinationURL] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [update] = useMutation<TData, OperationVariables>(mutation);

  useEffect(() => {
    if (!isModalOpen) {
      const unblock = history.block(location => {
        update({
          variables: {
            id,
            changes: dirtyInput(
              formikRef?.current?.initialValues,
              formikRef?.current?.values
            )
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
  }, [history, id, update, isModalOpen, formikRef, setIsModalOpen]);

  return { destinationURL, isModalOpen, setIsModalOpen };
}

export default useHandleMutation;
