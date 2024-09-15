import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Menu } from '@trussworks/react-uswds';
import { ModelInfoContext } from 'contexts/ModelInfoContext';
import { StatusMessageType } from 'features/ModelPlan/TaskList';
import { useArchiveModelPlanMutation } from 'gql/generated/graphql';

import Alert from 'components/Alert';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import useMessage from 'hooks/useMessage';

import ShareExportModal, { NavModelElemet } from '.';

import './index.scss';

const ShareExportButton = ({
  modelID,
  setStatusMessage
}: {
  modelID: string;
  setStatusMessage: (message: StatusMessageType) => void;
}) => {
  const { t: generalReadOnlyT } = useTranslation('generalReadOnly');
  const { t: modelPlanTaskListT } = useTranslation('modelPlanTaskList');

  const history = useHistory();

  const { modelName } = useContext(ModelInfoContext);

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const [defaultTab, setDefaultTab] = useState<NavModelElemet>('share');

  const menuRef = useRef<HTMLDivElement>(null);

  const { showMessageOnNextPage } = useMessage();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [update] = useArchiveModelPlanMutation();

  const archiveModelPlan = () => {
    update({
      variables: {
        id: modelID,
        archived: true
      }
    })
      .then((response: any) => {
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
                  {modelPlanTaskListT('withdraw_modal.confirmationText_name', {
                    modelName
                  })}
                </span>
              </Alert>
            </>
          );
          history.push(`/`);
        }
      })
      .catch(() => {
        setIsRemoveModalOpen(false);
      });
  };

  return (
    <>
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
          defaultTab={defaultTab}
        />
      </Modal>

      <Modal
        isOpen={isRemoveModalOpen}
        closeModal={() => setIsRemoveModalOpen(false)}
        className="confirmation-modal"
      >
        <PageHeading
          headingLevel="h3"
          className="margin-top-neg-2 margin-bottom-1"
        >
          {modelPlanTaskListT('withdraw_modal.header', {
            requestName: modelName
          })}
        </PageHeading>
        <p className="margin-top-2 margin-bottom-3">
          {modelPlanTaskListT('withdraw_modal.warning')}
        </p>
        <Button
          type="button"
          className="margin-right-4 bg-error"
          onClick={() => archiveModelPlan()}
        >
          {modelPlanTaskListT('withdraw_modal.confirm')}
        </Button>
        <Button
          type="button"
          unstyled
          onClick={() => setIsRemoveModalOpen(false)}
        >
          {modelPlanTaskListT('withdraw_modal.cancel')}
        </Button>
      </Modal>

      <div ref={menuRef} style={{ all: 'inherit' }}>
        <Button
          onClick={() => setIsMenuOpen(true)}
          type="button"
          className="margin-left-1 bg-primary-lighter padding-bottom-105 padding-top-05 padding-x-2 text-bold text-no-underline"
          unstyled
        >
          ...
        </Button>
        <Menu
          className="share-export-modal__menu padding-y-05 bg-white text-black position-absolute"
          items={[
            <Button
              type="button"
              onClick={() => {
                setDefaultTab('share');
                setIsExportModalOpen(true);
                setIsMenuOpen(false);
              }}
              className="share-export-modal__menu-item text-left padding-y-1 padding-x-2 width-full text-no-underline text-black"
              unstyled
            >
              {generalReadOnlyT('modal.shareModel')}
            </Button>,
            <Button
              type="button"
              onClick={() => {
                setDefaultTab('export');
                setIsExportModalOpen(true);
                setIsMenuOpen(false);
              }}
              className="share-export-modal__menu-item text-left padding-y-1 padding-x-2 width-full text-no-underline text-black"
              unstyled
            >
              {generalReadOnlyT('modal.exportModel')}
            </Button>,
            <Button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                setIsRemoveModalOpen(true);
              }}
              className="share-export-modal__menu-item text-left padding-y-1 padding-x-2 width-full text-no-underline text-red"
              unstyled
            >
              {generalReadOnlyT('modal.removeModel')}
            </Button>
          ]}
          isOpen={isMenuOpen}
        />
      </div>
    </>
  );
};
export default ShareExportButton;
