import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';

import Alert from 'components/Alert';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';

type MutationErrorModalType = {
  isOpen: boolean;
  closeModal: ({ clearDestination }: { clearDestination?: boolean }) => void;
  url: string;
};

const MutationErrorModal = ({
  isOpen,
  closeModal,
  url
}: MutationErrorModalType) => {
  const { t: generalT } = useTranslation('general');

  const navigate = useNavigate();

  return (
    <Modal
      isOpen={isOpen}
      closeModal={() => closeModal({ clearDestination: true })}
      className="external-link-modal maxw-mobile-lg"
      navigation
    >
      <div className="padding-4">
        <PageHeading headingLevel="h3" className="margin-0">
          {generalT('mutationError.heading')}
        </PageHeading>

        <p className="font-body-md line-height-sans-4 margin-top-0 margin-bottom-2">
          {generalT('mutationError.description')}
        </p>

        <Alert type="info" noIcon className="margin-bottom-3">
          {generalT('mutationError.alert')}
        </Alert>

        <div>
          <Button
            type="button"
            onClick={() => {
              closeModal({ clearDestination: true });
            }}
          >
            {generalT('mutationError.stay')}
          </Button>

          <Button
            type="button"
            className="margin-left-2 text-red"
            unstyled
            onClick={() => {
              navigate(url);
              closeModal({ clearDestination: false });
            }}
          >
            {generalT('mutationError.leave')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default MutationErrorModal;
