import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, Form } from '@trussworks/react-uswds';
import {
  GetModelToOperationsMatrixDocument,
  useCreateStandardCategoriesMutation
} from 'gql/generated/graphql';

import toastSuccess from 'components/ToastSuccess';
import { useErrorMessage } from 'contexts/ErrorContext';
import { MTOModalContext } from 'contexts/MTOModalContext';

const AddTemplateModal = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const {
    setMTOModalOpen,
    mtoModalState: { mtoTemplate }
  } = useContext(MTOModalContext);

  const { modelID = '' } = useParams<{ modelID: string }>();

  const { setErrorMeta } = useErrorMessage();

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
    setErrorMeta({
      overrideMessage: t('modal.addTemplate.error')
    });

    create().then(response => {
      if (!response?.errors) {
        toastSuccess(
          <Trans
            i18nKey="modal.addTemplate.success"
            t={t}
            components={{
              bold: <span className="text-bold " />
            }}
          />
        );
      }
      setMTOModalOpen(false);
    });
  };

  return (
    <Form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="maxw-none"
    >
      <p className="margin-bottom-0">{t('modal.addTemplate.description')}</p>

      <ul className="margin-y-1 margin-bottom-3">
        <li>{t('modal.addTemplate.item')}</li>
      </ul>

      <p className="margin-bottom-8">{t('modal.addTemplate.description2')}</p>

      <div className="display-flex mint-modal__footer">
        <Button type="submit" className="margin-right-3 margin-top-0">
          {t('modal.addTemplate.addTemplate')}
        </Button>

        <Button
          type="button"
          unstyled
          className="margin-top-0"
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
