import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import {
  GetModelToOperationsMatrixDocument,
  useDeleteMtoCategoryMutation
} from 'gql/generated/graphql';

import toastSuccess from 'components/ToastSuccess';
import { useErrorMessage } from 'contexts/ErrorContext';
import { MTOModalContext } from 'contexts/MTOModalContext';

const RemoveCategoryForm = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const {
    mtoModalState: { categoryID, subCategoryID, rowType },
    setMTOModalOpen
  } = useContext(MTOModalContext);

  const { setErrorMeta } = useErrorMessage();

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
    setErrorMeta({
      overrideMessage: t(`modal.${namespace}.errorAlert`)
    });

    deleteCategory({
      variables: {
        id: rowType === 'category' ? categoryID : subCategoryID
      }
    }).then(response => {
      if (!response?.errors) {
        toastSuccess(t(`modal.${namespace}.successAlert`));
      }
      setMTOModalOpen(false);
    });
  };

  return (
    <div className="margin-bottom-8">
      <p>{t(`modal.${namespace}.copy`)}</p>

      <div className="mint-modal__footer">
        <Button
          type="button"
          className="margin-right-4 bg-error margin-top-0"
          onClick={() => handleRemove()}
        >
          {t(`modal.${namespace}.button`)}
        </Button>
        <Button
          type="button"
          unstyled
          className="margin-top-0"
          onClick={() => {
            setMTOModalOpen(false);
          }}
        >
          {t(`modal.${namespace}.goBack`)}
        </Button>
      </div>
    </div>
  );
};

export default RemoveCategoryForm;
