import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import { TaskListStatusTag } from 'features/ModelPlan/TaskList/_components/TaskListItem';
import { MtoStatus } from 'gql/generated/graphql';

import '../../index.scss';

const MTOStatusBanner = ({
  status,
  lastUpdated
}: {
  status: MtoStatus | undefined;
  lastUpdated: string | null | undefined;
}) => {
  const { t } = useTranslation('modelToOperationsMisc');

  return (
    <div className="display-flex model-to-operations">
      <TaskListStatusTag status={status} classname="width-fit-content" />

      {status !== MtoStatus.READY && (
        <>
          <Button type="button" unstyled className="margin-x-2">
            {t('isMTOReady')}
          </Button>

          {lastUpdated && (
            <>
              <div style={{ paddingTop: '6px', paddingBottom: '6px' }}>
                <div className="model-to-operations__status-border" />
              </div>

              <span className="margin-left-2 text-base padding-top-05">
                {t('lastUpdated', {
                  date: lastUpdated
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
