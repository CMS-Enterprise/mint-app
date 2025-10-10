import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, Form } from '@trussworks/react-uswds';
import {
  GetModelToOperationsMatrixDocument,
  GetMtoModelPlanTemplatesDocument,
  useCreateMtoTemplateMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
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

  const [create] = useCreateMtoTemplateMutation();

  if (!mtoTemplate)
    return <Alert type="error">{t('modal.addTemplate.failedToFetch')}</Alert>;

  const handleSubmit = () => {
    setErrorMeta({
      overrideMessage: t('modal.addTemplate.error')
    });

    create({
      variables: {
        modelPlanID: modelID,
        templateID: mtoTemplate.id
      },
      refetchQueries: [
        {
          query: GetModelToOperationsMatrixDocument,
          variables: { id: modelID }
        },
        {
          query: GetMtoModelPlanTemplatesDocument,
          variables: { id: modelID }
        }
      ]
    }).then(response => {
      if (!response?.errors) {
        toastSuccess(
          <Trans
            i18nKey="modal.addTemplate.success"
            t={t}
            values={{ category: mtoTemplate.name }}
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
      <p className="margin-bottom-0">
        <Trans
          t={t}
          i18nKey="modal.addTemplate.selectedTemplate"
          components={{
            bold: <span className="text-bold" />
          }}
          values={{ template: mtoTemplate?.name }}
        />
      </p>

      <p className="margin-bottom-0">{t('modal.addTemplate.description')}</p>

      <ul className="margin-y-1 margin-bottom-3">
        <li>
          {t('modal.addTemplate.categories', {
            count: mtoTemplate.categoryCount,
            primaryCount: mtoTemplate.primaryCategoryCount
          })}
        </li>
        <li>
          {t('modal.addTemplate.milestones', {
            count: mtoTemplate.milestoneCount
          })}
        </li>
        <li>
          {t('modal.addTemplate.solutions', {
            count: mtoTemplate.solutionCount
          })}
        </li>
      </ul>

      <p className="margin-bottom-10">{t('modal.addTemplate.description2')}</p>

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
