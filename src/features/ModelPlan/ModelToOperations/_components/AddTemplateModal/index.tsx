import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, Form } from '@trussworks/react-uswds';
import {
  GetModelToOperationsMatrixDocument,
  useCreateMtoCategoryMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import { MTOModalContext } from 'contexts/MTOModalContext';
import useMessage from 'hooks/useMessage';

const AddTemplateModal = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { setMTOModalOpen } = useContext(MTOModalContext);

  const { modelID } = useParams<{ modelID: string }>();

  const { showErrorMessageInModal, showMessage } = useMessage();

  const [create] = useCreateMtoCategoryMutation({
    refetchQueries: [
      {
        query: GetModelToOperationsMatrixDocument,
        variables: {
          id: modelID
        }
      }
    ]
  });

  const handleSubmit = () => {
    create()
      .then(response => {
        if (!response?.errors) {
          showMessage(
            <>
              <Alert
                type="success"
                slim
                data-testid="mandatory-fields-alert"
                className="margin-y-4"
              >
                {t('modal.category.alert.success')}
              </Alert>
            </>
          );
        }
      })
      .catch(() => {
        showErrorMessageInModal(
          <Alert
            type="error"
            slim
            data-testid="error-alert"
            className="margin-bottom-2"
          >
            {t('modal.category.alert.error')}
          </Alert>
        );
      });
  };

  return (
    <Form onSubmit={() => handleSubmit()}>
      <Button type="submit" className="margin-right-3">
        {t('modal.addtemplate')}
      </Button>

      <Button
        type="button"
        onClick={() => {
          setMTOModalOpen(false);
        }}
      >
        {t('modal.cancel')}
      </Button>
    </Form>
  );
};

export default AddTemplateModal;
