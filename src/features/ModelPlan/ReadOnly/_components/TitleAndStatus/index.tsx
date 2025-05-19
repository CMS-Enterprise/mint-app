import React from 'react';
import {
  DataExchangeApproachStatus,
  ModelStatus,
  MtoStatus,
  TaskStatus
} from 'gql/generated/graphql';

import StatusBanner from 'components/StatusBanner';

type TitleAndStatusProps = {
  modelID: string;
  clearance: boolean | undefined;
  clearanceTitle: string;
  heading: string;
  subHeading?: string;
  isViewingFilteredView?: boolean;
  status: ModelStatus | TaskStatus | DataExchangeApproachStatus | MtoStatus;
  modifiedOrCreatedDts?: string | null;
};

const TitleAndStatus = ({
  modelID,
  clearance,
  clearanceTitle,
  heading,
  subHeading,
  isViewingFilteredView,
  status,
  modifiedOrCreatedDts
}: TitleAndStatusProps) => {
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
        <StatusBanner
          modelID={modelID}
          status={status}
          updateLabel
          statusLabel
          modifiedDts={modifiedOrCreatedDts}
          modifiedOrCreateLabel
          condensed
          className="margin-bottom-4"
          type="task"
        />
      )}
    </div>
  );
};

export default TitleAndStatus;
