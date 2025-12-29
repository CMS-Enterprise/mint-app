import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import {
  GetModelToOperationsMatrixDocument,
  MtoStatus,
  useUpdateMtoReadyForReviewMutation
} from 'gql/generated/graphql';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import { useErrorMessage } from 'contexts/ErrorContext';

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

  const { modelID = '' } = useParams<{ modelID: string }>();

  const { setErrorMeta } = useErrorMessage();

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
      testId="mto-ready-for-review-modal"
    >
      <div className="margin-top-neg-3 padding-bottom-1">
        <PageHeading headingLevel="h3" className="margin-0">
          {status === MtoStatus.IN_PROGRESS
            ? t('readyForReview.headingInReview')
            : t('readyForReview.headingInProgress')}
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
              setErrorMeta({
                overrideMessage: t('readyForReview.error')
              });

              update().then(() => {
                closeModal();
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
              closeModal();
            }}
          >
            {t('readyForReview.cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default MTOReadyForReview;
