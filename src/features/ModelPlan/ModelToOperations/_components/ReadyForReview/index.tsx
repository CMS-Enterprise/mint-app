import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import { MtoStatus } from 'gql/generated/graphql';

import Alert from 'components/Alert';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';

type MTOReadyForReviewType = {
  isOpen: boolean;
  closeModal: () => void;
  status: MtoStatus | undefined;
};

const MTOReadyForReview = ({
  isOpen,
  closeModal,
  status
}: MTOReadyForReviewType) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      className="external-link-modal maxw-mobile-lg"
    >
      <div className="margin-top-neg-3 padding-bottom-1">
        <PageHeading headingLevel="h3" className="margin-0">
          {t('readyForReview.heading')}
        </PageHeading>

        <p className="font-body-md line-height-sans-4 margin-top-2 margin-bottom-3">
          {status === MtoStatus.IN_PROGRESS
            ? t('readyForReview.descriptionReady')
            : t('readyForReview.descriptionInProgress')}
        </p>

        <div>
          <Button
            type="button"
            onClick={() => {
              closeModal();
            }}
          >
            {status === MtoStatus.IN_PROGRESS
              ? t('readyForReview.markAsReady')
              : t('readyForReview.markAsInProgress')}
          </Button>

          <Button
            type="button"
            className="margin-left-2"
            unstyled
            onClick={() => {
              closeModal();
            }}
          >
            {t('readyForReview.goBack')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default MTOReadyForReview;
