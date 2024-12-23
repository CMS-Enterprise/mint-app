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

const RemoveCategoryForm = ({ closeModal }: { closeModal: () => void }) => {
  const { t } = useTranslation('modelToOperationsMisc');
  const { modelID } = useParams<{ modelID: string }>();
  const {
    mtoModalState: { categoryID, subCategoryID, rowType },
    resetMTOModalState
  } = useContext(MTOModalContext);
  const { showMessage, showErrorMessageInModal, clearMessage } = useMessage();

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
              {t('modal.remove.successAlert')}
            </Alert>
          );
        }
        resetMTOModalState();
        closeModal();
      })
      .catch(() => {
        showErrorMessageInModal(
          <Alert
            type="error"
            slim
            data-testid="error-alert"
            className="margin-bottom-2"
          >
            {t('modal.remove.category.errorAlert')}
          </Alert>
        );
      });
  };

  return (
    <>
      <p>{t('modal.remove.category.copy')}</p>
      <Button
        type="button"
        className="margin-right-4 bg-error"
        onClick={() => handleRemove()}
      >
        {t('modal.remove.category.button')}
      </Button>
      <Button
        type="button"
        unstyled
        onClick={() => {
          resetMTOModalState();
          clearMessage();
          closeModal();
        }}
      >
        {t('modal.remove.goBack')}
      </Button>
    </>
  );
};

export default RemoveCategoryForm;
