import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GetAllParticipantsAndProvidersQuery,
  useGetAllParticipantsAndProvidersQuery
} from 'gql/gen/graphql';

import PageLoading from 'components/PageLoading';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { NotFoundPartial } from 'views/NotFound';

import ReadOnlyBody from '../_components/Body';
import TitleAndStatus from '../_components/TitleAndStatus';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyParticipantsAndProviders = ({
  modelID,
  clearance,
  filteredView
}: ReadOnlyProps) => {
  const { t: participantsAndProvidersMiscT } = useTranslation(
    'participantsAndProvidersMisc'
  );
  const { t: prepareForClearanceT } = useTranslation('prepareForClearance');

  const participantsAndProvidersConfig = usePlanTranslation(
    'participantsAndProviders'
  );

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useGetAllParticipantsAndProvidersQuery({
    variables: {
      id: modelID
    }
  });

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  const allparticipantsAndProvidersData = (data?.modelPlan
    .participantsAndProviders ||
    {}) as GetAllParticipantsAndProvidersQuery['modelPlan']['participantsAndProviders'];

  return (
    <div
      className="read-only-model-plan--participants-and-providers"
      data-testid="read-only-model-plan--participants-and-providers"
    >
      <TitleAndStatus
        clearance={clearance}
        clearanceTitle={participantsAndProvidersMiscT('clearanceHeading')}
        heading={participantsAndProvidersMiscT('heading')}
        isViewingFilteredView={!!filteredView}
        status={allparticipantsAndProvidersData.status}
      />

      {clearance && (
        <p className="font-body-lg margin-top-neg-2 margin-bottom-6">
          {prepareForClearanceT('forModelPlan', {
            modelName
          })}
        </p>
      )}

      {loading && !data ? (
        <div className="height-viewport">
          <PageLoading />
        </div>
      ) : (
        <ReadOnlyBody
          data={allparticipantsAndProvidersData}
          config={participantsAndProvidersConfig}
          filteredView={filteredView}
        />
      )}
    </div>
  );
};

export default ReadOnlyParticipantsAndProviders;
