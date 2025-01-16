import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, Form } from '@trussworks/react-uswds';
import {
  GetModelToOperationsMatrixDocument,
  useCreateStandardCategoriesMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import { MTOModalContext } from 'contexts/MTOModalContext';
import useMessage from 'hooks/useMessage';

const AddTemplateModal = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { setMTOModalOpen } = useContext(MTOModalContext);

  const { modelID } = useParams<{ modelID: string }>();

  const { showErrorMessageInModal, showMessage } = useMessage();

  const [create] = useCreateStandardCategoriesMutation({
    variables: { modelPlanID: modelID },
    refetchQueries: [
      {
        query: GetModelToOperationsMatrixDocument,
        variables: { id: modelID }
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
                {t('modal.addTemplate.success')}
              </Alert>
            </>
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
            {t('modal.addTemplate.error')}
          </Alert>
        );
      });
  };

  return (
    <Form
      onSubmit={e => {
        e.preventDefault();
        handleSubmit();
      }}
      className="maxw-none"
    >
      <p className="margin-bottom-0">{t('modal.addTemplate.description')}</p>

      <ul className="margin-y-1 margin-bottom-3">
        <li>{t('modal.addTemplate.item')}</li>
      </ul>

      <p>{t('modal.addTemplate.description2')}</p>

      <div className="display-flex">
        <Button type="submit" className="margin-right-3">
          {t('modal.addTemplate.addTemplate')}
        </Button>

        <Button
          type="button"
          unstyled
          onClick={() => {
            setMTOModalOpen(false);
          }}
        >
          {t('modal.addTemplate.dontAdd')}
        </Button>
      </div>
    </Form>
  );
};

export default AddTemplateModal;
