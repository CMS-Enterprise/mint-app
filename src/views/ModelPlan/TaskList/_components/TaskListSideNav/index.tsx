import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import {
  GetModelCollaboratorsQuery,
  GetModelPlanQuery,
  useArchiveModelPlanMutation
} from 'gql/gen/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import { Avatar } from 'components/shared/Avatar';
import ShareExportModal from 'components/ShareExport';
import useMessage from 'hooks/useMessage';
import { collaboratorsOrderedByModelLeads } from 'utils/modelPlan';
import RecentChanges from 'views/ModelPlan/ChangeHistory/components/RecentChanges';

import { StatusMessageType } from '../..';

type GetModelPlanTypes = GetModelPlanQuery['modelPlan'];
type GetCollaboratorsType = GetModelCollaboratorsQuery['modelPlan']['collaborators'][0];

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

  const history = useHistory();

  const { t } = useTranslation('modelPlanTaskList');
  const { t: generalReadOnlyT } = useTranslation('generalReadOnly');

  const flags = useFlags();

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
          history.push(`/`);
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
          <Button
            type="button"
            onClick={() =>
              window.open('/help-and-knowledge/model-plan-overview', '_blank')
            }
            className="usa-button usa-button--unstyled line-height-body-5 margin-bottom-1"
          >
            <Trans i18nKey="modelPlanTaskList:sideNav.overview">
              indexZero
              <span aria-hidden /> indexTwo
            </Trans>
          </Button>

          <Button
            type="button"
            onClick={() =>
              window.open('/help-and-knowledge/sample-model-plan', '_blank')
            }
            className="usa-button usa-button--unstyled line-height-body-5"
          >
            <Trans i18nKey="modelPlanTaskList:sideNav.sampleModelPlan">
              indexZero
              <span aria-hidden /> indexTwo
            </Trans>
          </Button>
        </div>

        {flags.changeHistoryEnabled && <RecentChanges modelID={modelID} />}

        <div>
          <h3 className="margin-bottom-05">{t('sideNav.modelTeam')}</h3>

          <div className="margin-bottom-2">
            <UswdsReactLink
              to={`/models/${modelID}/collaboration-area/collaborators?view=manage`}
            >
              {t('sideNav.editTeam')}
            </UswdsReactLink>
          </div>

          <div className="sidenav-actions__teamList">
            <ul className="usa-list usa-list--unstyled">
              {collaboratorsOrderedByModelLeads(collaborators).map(
                collaborator => {
                  return (
                    <li key={collaborator.userAccount.username}>
                      <Avatar
                        className="margin-bottom-1"
                        user={collaborator.userAccount.commonName}
                        teamRoles={collaborator.teamRoles}
                      />
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskListSideNav;
