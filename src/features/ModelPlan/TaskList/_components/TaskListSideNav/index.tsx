import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import RecentChanges from 'features/ModelPlan/ChangeHistory/components/RecentChanges';
import {
  GetModelCollaboratorsQuery,
  GetModelPlanQuery,
  useArchiveModelPlanMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import ShareExportModal from 'components/ShareExport';
import useMessage from 'hooks/useMessage';

import { StatusMessageType } from '../..';

type GetModelPlanTypes = GetModelPlanQuery['modelPlan'];
type GetCollaboratorsType =
  GetModelCollaboratorsQuery['modelPlan']['collaborators'][0];

const TaskListSideNav = ({
  modelPlan,
  collaborators,
  setStatusMessage
}: {
  modelPlan: GetModelPlanTypes;
  collaborators: GetCollaboratorsType[];
  setStatusMessage: (message: StatusMessageType) => void;
}) => {
  const { id: modelID } = modelPlan;

  const navigate = useNavigate();

  const { t } = useTranslation('modelPlanTaskList');
  const { t: generalReadOnlyT } = useTranslation('generalReadOnly');

  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const { showMessageOnNextPage } = useMessage();
  const [isModalOpen, setModalOpen] = useState(false);

  const [update] = useArchiveModelPlanMutation();

  const archiveModelPlan = () => {
    update({
      variables: {
        id: modelID,
        archived: true
      }
    })
      .then(response => {
        if (!response?.errors) {
          showMessageOnNextPage(
            <>
              <Alert
                type="success"
                slim
                data-testid="mandatory-fields-alert"
                className="margin-y-4"
              >
                <span className="mandatory-fields-alert__text">
                  {t('withdraw_modal.confirmationText_name', {
                    modelName: modelPlan.modelName
                  })}
                </span>
              </Alert>
            </>
          );
          navigate(`/`);
        }
      })
      .catch(() => {
        setModalOpen(false);
      });
  };

  const renderModal = () => {
    return (
      <Modal
        isOpen={isModalOpen}
        closeModal={() => setModalOpen(false)}
        className="confirmation-modal"
      >
        <PageHeading
          headingLevel="h3"
          className="margin-top-neg-2 margin-bottom-1"
        >
          {t('withdraw_modal.header', {
            requestName: modelPlan.modelName
          })}
        </PageHeading>
        <p className="margin-top-2 margin-bottom-3">
          {t('withdraw_modal.warning')}
        </p>
        <Button
          type="button"
          className="margin-right-4 bg-error"
          onClick={() => archiveModelPlan()}
        >
          {t('withdraw_modal.confirm')}
        </Button>
        <Button type="button" unstyled onClick={() => setModalOpen(false)}>
          {t('withdraw_modal.cancel')}
        </Button>
      </Modal>
    );
  };

  return (
    <>
      {renderModal()}

      <Modal
        isOpen={isExportModalOpen}
        closeModal={() => setIsExportModalOpen(false)}
        className="padding-0 radius-md share-export-modal__container"
        navigation
        shouldCloseOnOverlayClick
      >
        <ShareExportModal
          closeModal={() => setIsExportModalOpen(false)}
          modelID={modelID}
          setStatusMessage={setStatusMessage}
        />
      </Modal>
      <div
        className="sidenav-actions border-top-05 border-primary-lighter padding-top-2 margin-top-2"
        data-testid="sidenav-actions"
      >
        <h4 className="margin-top-0 margin-bottom-1">{t('sideNav.actions')}</h4>

        <UswdsReactLink
          to={`/models/${modelID}/read-only`}
          className="display-block line-height-body-5"
        >
          {t('sideNav.readOnlyView')}
        </UswdsReactLink>

        <div className="flex-align-self-center margin-y-2">
          <Button
            type="button"
            className="usa-button--unstyled"
            onClick={() => setIsExportModalOpen(true)}
          >
            {generalReadOnlyT('shareExportLink')}
          </Button>
        </div>

        <div className="margin-top-4 margin-bottom-6">
          <h4 className="margin-bottom-1">{t('sideNav.relatedContent')}</h4>
          <div className="margin-bottom-1">
            <UswdsReactLink
              to="/help-and-knowledge/model-plan-overview"
              target="_blank"
              className="line-height-body-5"
            >
              {t('sideNav.overview')}
            </UswdsReactLink>
          </div>

          <div>
            <UswdsReactLink
              to="/help-and-knowledge/sample-model-plan"
              target="_blank"
              className="line-height-body-5"
            >
              {t('sideNav.sampleModelPlan')}
            </UswdsReactLink>
          </div>
        </div>

        <RecentChanges modelID={modelID} />
      </div>
    </>
  );
};

export default TaskListSideNav;
