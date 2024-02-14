import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GetAllParticipantsAndProvidersQuery,
  useGetAllParticipantsAndProvidersQuery
} from 'gql/gen/graphql';

import usePlanTranslation from 'hooks/usePlanTranslation';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { NotFoundPartial } from 'views/NotFound';

import ReadOnlyBody from '../_components/Body';
import TitleAndStatus from '../_components/TitleAndStatus';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyParticipantsAndProviders = ({
  modelID,
  clearance,
  filteredView,
  isViewingFilteredView
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
        isViewingFilteredView={isViewingFilteredView}
        status={allparticipantsAndProvidersData.status}
      />

      {clearance && (
        <p className="font-body-lg margin-top-neg-2 margin-bottom-6">
          {prepareForClearanceT('forModelPlan', {
            modelName
          })}
        </p>
      )}

      <ReadOnlyBody
        data={allparticipantsAndProvidersData}
        config={participantsAndProvidersConfig}
        isViewingFilteredView={isViewingFilteredView}
        filteredView={filteredView}
      />
    </div>
  );
};

export default ReadOnlyParticipantsAndProviders;
