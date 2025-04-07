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
  isViewingFilteredView?: boolean;
  status: ModelStatus | TaskStatus | DataExchangeApproachStatus | MtoStatus;
  modifiedOrCreatedDts?: string | null;
};

const TitleAndStatus = ({
  modelID,
  clearance,
  clearanceTitle,
  heading,
  isViewingFilteredView,
  status,
  modifiedOrCreatedDts
}: TitleAndStatusProps) => {
  return (
    <div>
      <h2 className="margin-top-0 margin-bottom-2">
        {clearance ? clearanceTitle : heading}
      </h2>

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
