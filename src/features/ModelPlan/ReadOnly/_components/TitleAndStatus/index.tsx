import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { TaskListStatusTag } from 'features/ModelPlan/TaskList/_components/TaskListItem';
import {
  DataExchangeApproachStatus,
  ModelStatus,
  MtoStatus,
  TaskStatus
} from 'gql/generated/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import { formatDateLocal } from 'utils/date';

type TitleAndStatusProps = {
  modelID: string;
  clearance: boolean | undefined;
  clearanceTitle: string;
  heading: string;
  subHeading?: string;
  isViewingFilteredView?: boolean;
  status: ModelStatus | TaskStatus | DataExchangeApproachStatus | MtoStatus;
  modifiedOrCreatedDts?: string | null;
  editDates?: boolean;
};

const TitleAndStatus = ({
  modelID,
  clearance,
  clearanceTitle,
  heading,
  subHeading,
  isViewingFilteredView,
  status,
  modifiedOrCreatedDts,
  editDates
}: TitleAndStatusProps) => {
  const { t } = useTranslation('modelPlanTaskList');
  const { t: h } = useTranslation('generalReadOnly');
  const { t: timelineMiscT } = useTranslation('timelineMisc');

  return (
    <div>
      <div className="display-flex margin-bottom-2 ">
        <h2 className="margin-y-0 margin-right-2">
          {clearance ? clearanceTitle : heading}
        </h2>

        {subHeading && (
          <p className="mint-body-large text-base-dark margin-y-0 flex-align-self-end">
            {subHeading}
          </p>
        )}
      </div>

      {!isViewingFilteredView && status && (
        <div className="display-flex flex-align-center flex-wrap margin-right-1 margin-bottom-4">
          <p className="margin-y-0 text-bold margin-right-1">{t('status')}</p>

          <TaskListStatusTag
            status={status}
            classname="width-fit-content margin-right-1"
          />

          <div className="display-flex flex-align-center flex-wrap margin-right-1">
            {!!modifiedOrCreatedDts && (
              <p
                className={classNames(
                  'margin-y-0 text-normal margin-right-1 text-base-dark'
                )}
              >
                {h('lastUpdate')}
                {formatDateLocal(modifiedOrCreatedDts, 'MM/dd/yyyy')}
              </p>
            )}

            {editDates && (
              <>
                <div className="border-left-2px border-base-light margin-left-105 padding-left-2 height-2 margin-top-1px" />

                <Icon.Edit
                  className="margin-right-1 text-primary"
                  data-testid="edit-icon"
                />

                <UswdsReactLink
                  data-testid="edit-dates-link"
                  to={`/models/${modelID}/collaboration-area/model-timeline`}
                >
                  {timelineMiscT('editDates')}
                </UswdsReactLink>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TitleAndStatus;
