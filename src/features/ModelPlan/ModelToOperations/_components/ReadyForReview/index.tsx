import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import {
  GetModelToOperationsMatrixDocument,
  MtoStatus,
  useUpdateMtoReadyForReviewMutation
} from 'gql/generated/graphql';

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

  const [error, setError] = useState<boolean>(false);

  const [update] = useUpdateMtoReadyForReviewMutation({
    variables: {
      modelPlanID: modelID,
      readyForReview: status === MtoStatus.IN_PROGRESS
    },
    refetchQueries: [
      {
        query: GetModelToOperationsMatrixDocument,
        variables: {
          id: modelID
        }
      }
    ]
  });

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      className="external-link-modal maxw-mobile-lg"
    >
      <div className="margin-top-neg-3 padding-bottom-1">
        <PageHeading headingLevel="h3" className="margin-0">
          {status === MtoStatus.IN_PROGRESS
            ? t('readyForReview.headingInReview')
            : t('readyForReview.headingInProgress')}
        </PageHeading>

        {error && (
          <Alert type="error" slim>
            {t('readyForReview.error')}
          </Alert>
        )}

        <p className="font-body-md line-height-sans-4 margin-top-2 margin-bottom-3">
          {status === MtoStatus.IN_PROGRESS
            ? t('readyForReview.descriptionReady')
            : t('readyForReview.descriptionInProgress')}
        </p>

        <div>
          <Button
            type="button"
            onClick={() => {
              update()
                .then(() => {
                  setError(false);
                  closeModal();
                })
                .catch(() => {
                  setError(true);
                });
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
              setError(false);
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
