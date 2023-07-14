import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GridContainer, SummaryBox } from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';

import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import GetModelSummary from 'queries/ReadOnly/GetModelSummary';
import {
  GetModelSummary as GetModelSummaryType,
  GetModelSummary_modelPlan as GetModelSummaryTypes
} from 'queries/ReadOnly/types/GetModelSummary';
import { ModelStatus } from 'types/graphql-global-types';
import { filteredViewOutput } from 'views/ModelPlan/ReadOnly';
import FilterViewBanner from 'views/ModelPlan/ReadOnly/_components/FilterView/Banner';
import { filterGroups } from 'views/ModelPlan/ReadOnly/_components/FilterView/BodyContent/_filterGroupMapping';
import TaskListStatus from 'views/ModelPlan/TaskList/_components/TaskListStatus';
import NotFound from 'views/NotFound';

const ShareExportHeader = ({
  filteredView
}: {
  filteredView?: typeof filterGroups[number];
}) => {
  const { t: h } = useTranslation('generalReadOnly');

  const flags = useFlags();

  const { modelID } = useParams<{
    modelID: string;
  }>();

  const { data, loading, error } = useQuery<GetModelSummaryType>(
    GetModelSummary,
    {
      variables: {
        id: modelID
      }
    }
  );

  const { abbreviation, modelName, createdDts, modifiedDts, status } =
    data?.modelPlan || ({} as GetModelSummaryTypes);

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFound />;
  }

  const Summary = (
    <>
      <SummaryBox
        heading=""
        className="padding-y-6 padding-x-2 border-0 bg-primary-lighter radius-0 margin-top-0"
        data-testid="read-only-model-summary"
      >
        <GridContainer className="padding-x-6">
          <PageHeading
            className="margin-0 line-height-sans-2 minh-6 margin-bottom-2"
            headingLevel="h1"
          >
            {modelName}{' '}
            {abbreviation && (
              <span className="font-sans-sm text-normal">({abbreviation})</span>
            )}
          </PageHeading>

          <TaskListStatus
            readOnly
            modelID={modelID}
            status={status}
            statusLabel
            modifiedOrCreateLabel={!!modifiedDts}
            modifiedDts={modifiedDts ?? createdDts}
          />
        </GridContainer>
      </SummaryBox>

      {!flags.hideGroupView && (
        <FilterViewBanner
          filteredView={filteredView && filteredViewOutput(filteredView)}
          openFilterModal={() => null}
        />
      )}
    </>
  );

  const ModelWarning = (
    <>
      {status !== ModelStatus.CLEARED && status !== ModelStatus.ANNOUNCED && (
        <Alert
          type="warning"
          className="margin-top-2 margin-bottom-5 desktop:margin-y-3"
        >
          {h('alert')}
        </Alert>
      )}
    </>
  );

  return (
    <>
      {Summary}
      <GridContainer className="padding-x-8">{ModelWarning}</GridContainer>
    </>
  );
};

export default ShareExportHeader;
