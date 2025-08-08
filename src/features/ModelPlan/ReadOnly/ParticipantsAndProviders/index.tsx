import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { NotFoundPartial } from 'features/NotFound';
import {
  GetAllParticipantsAndProvidersQuery,
  useGetAllParticipantsAndProvidersQuery
} from 'gql/generated/graphql';

import PageLoading from 'components/PageLoading';
import usePlanTranslation from 'hooks/usePlanTranslation';

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
  const participantsAndProvidersConfig = usePlanTranslation(
    'participantsAndProviders'
  );

  const { modelID: modelIDFromParams } = useParams();

  const { data, loading, error } = useGetAllParticipantsAndProvidersQuery({
    variables: {
      id: modelID || modelIDFromParams || ''
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
        modelID={modelID || modelIDFromParams || ''}
        modifiedOrCreatedDts={
          allparticipantsAndProvidersData.modifiedDts ||
          allparticipantsAndProvidersData.createdDts
        }
      />

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
