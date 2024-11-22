import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import { TaskListStatusTag } from 'features/ModelPlan/TaskList/_components/TaskListItem';
import { MtoStatus } from 'gql/generated/graphql';

import { formatDateLocal } from 'utils/date';

import MTOReadyForReview from '../ReadyForReview';

import '../../index.scss';

const MTOStatusBanner = ({
  status,
  lastUpdated
}: {
  status: MtoStatus | undefined;
  lastUpdated: string | null | undefined;
}) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="display-flex model-to-operations">
      <MTOReadyForReview
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        status={status}
      />

      <TaskListStatusTag status={status} classname="width-fit-content" />

      {status !== MtoStatus.READY && (
        <>
          <Button
            type="button"
            unstyled
            className="margin-x-2"
            onClick={() => setIsModalOpen(true)}
          >
            {status === MtoStatus.IN_PROGRESS
              ? t('isMTOReady')
              : t('isMTOInProgress')}
          </Button>

          {lastUpdated && (
            <>
              <div style={{ paddingTop: '6px', paddingBottom: '6px' }}>
                <div className="model-to-operations__status-border" />
              </div>

              <span className="margin-left-2 text-base padding-top-05">
                {t('lastUpdated', {
                  date: formatDateLocal(lastUpdated, 'MM/dd/yyyy')
                })}
              </span>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MTOStatusBanner;
