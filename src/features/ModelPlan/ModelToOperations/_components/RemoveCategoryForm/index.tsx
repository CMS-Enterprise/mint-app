import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import {
  GetModelToOperationsMatrixDocument,
  useDeleteMtoCategoryMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import { MTOModalContext } from 'contexts/MTOModalContext';
import useMessage from 'hooks/useMessage';

const RemoveCategoryForm = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  const {
    mtoModalState: { categoryID, subCategoryID, rowType },
    setMTOModalOpen
  } = useContext(MTOModalContext);

  const { showMessage, showErrorMessageInModal } = useMessage();

  const [deleteCategory] = useDeleteMtoCategoryMutation({
    refetchQueries: [
      {
        query: GetModelToOperationsMatrixDocument,
        variables: {
          id: modelID
        }
      }
    ]
  });

  const namespace =
    rowType === 'category' ? 'removeCategory' : 'removeSubcategory';

  const handleRemove = () => {
    deleteCategory({
      variables: {
        id: rowType === 'category' ? categoryID : subCategoryID
      }
    })
      .then(response => {
        if (!response?.errors) {
          showMessage(
            <Alert
              type="success"
              slim
              data-testid="mandatory-fields-alert"
              className="margin-y-4"
            >
              {t(`modal.${namespace}.successAlert`)}
            </Alert>
          );
        }
        setMTOModalOpen(false);
      })
      .catch(() => {
        showErrorMessageInModal(
          <Alert
            type="error"
            slim
            data-testid="error-alert"
            className="margin-bottom-2"
          >
            {t(`modal.${namespace}.errorAlert`)}
          </Alert>
        );
      });
  };

  return (
    <>
      <p>{t(`modal.${namespace}.copy`)}</p>

      <Button
        type="button"
        className="margin-right-4 bg-error"
        onClick={() => handleRemove()}
      >
        {t(`modal.${namespace}.button`)}
      </Button>
      <Button
        type="button"
        unstyled
        onClick={() => {
          setMTOModalOpen(false);
        }}
      >
        {t(`modal.${namespace}.goBack`)}
      </Button>
    </>
  );
};

export default RemoveCategoryForm;
