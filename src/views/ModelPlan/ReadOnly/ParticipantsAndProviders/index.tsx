import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GetAllParticipantsAndProvidersQuery,
  useGetAllParticipantsAndProvidersQuery
} from 'gql/gen/graphql';

import usePlanTranslation from 'hooks/usePlanTranslation';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { NotFoundPartial } from 'views/NotFound';

import ReadOnlySectionNew from '../_components/ReadOnlySection/new';
import SideBySideReadOnlySectionNew from '../_components/SideBySideReadOnlySection/new';
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

      <div
        className={`${
          isViewingFilteredView
            ? ''
            : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
        }`}
      >
        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.participants}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.medicareProviderType}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.statesEngagement}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.participantsOther}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.participantsNote}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.participantsCurrentlyInModels}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={
            participantsAndProvidersConfig.participantsCurrentlyInModelsNote
          }
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.modelApplicationLevel}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />
      </div>

      <div
        className={`${
          isViewingFilteredView
            ? ''
            : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
        }`}
      >
        <SideBySideReadOnlySectionNew>
          <ReadOnlySectionNew
            config={participantsAndProvidersConfig.expectedNumberOfParticipants}
            values={allparticipantsAndProvidersData}
            namespace="participantsAndProviders"
            filteredView={filteredView}
          />

          {(!!allparticipantsAndProvidersData.expectedNumberOfParticipants ||
            allparticipantsAndProvidersData.expectedNumberOfParticipants ===
              0) && (
            <ReadOnlySectionNew
              config={participantsAndProvidersConfig.estimateConfidence}
              values={allparticipantsAndProvidersData}
              namespace="participantsAndProviders"
              filteredView={filteredView}
            />
          )}
        </SideBySideReadOnlySectionNew>

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.confidenceNote}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.recruitmentMethod}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.recruitmentNote}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.selectionMethod}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.selectionNote}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />
      </div>

      <div
        className={`${
          isViewingFilteredView
            ? ''
            : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
        }`}
      >
        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.participantAddedFrequency}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.participantAddedFrequencyNote}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.participantRemovedFrequency}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={
            participantsAndProvidersConfig.participantRemovedFrequencyNote
          }
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.communicationMethod}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.riskType}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.riskNote}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.willRiskChange}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.willRiskChangeNote}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />
      </div>

      <div
        className={`${
          isViewingFilteredView
            ? ''
            : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
        }`}
      >
        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.coordinateWork}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.coordinateWorkNote}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <SideBySideReadOnlySectionNew>
          <ReadOnlySectionNew
            config={participantsAndProvidersConfig.gainsharePayments}
            values={allparticipantsAndProvidersData}
            namespace="participantsAndProviders"
            filteredView={filteredView}
          />
          {allparticipantsAndProvidersData.gainsharePayments && (
            <ReadOnlySectionNew
              config={participantsAndProvidersConfig.gainsharePaymentsTrack}
              values={allparticipantsAndProvidersData}
              namespace="participantsAndProviders"
              filteredView={filteredView}
            />
          )}
        </SideBySideReadOnlySectionNew>

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.gainsharePaymentsEligibility}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.gainsharePaymentsNote}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.participantsIds}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />
      </div>

      <div>
        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.providerAdditionFrequency}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.providerAdditionFrequencyNote}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.providerAddMethod}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.providerAddMethodNote}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.providerLeaveMethod}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.providerLeaveMethodNote}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.providerRemovalFrequency}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.providerRemovalFrequencyNote}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.providerOverlap}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.providerOverlapHierarchy}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.providerOverlapNote}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />
      </div>
    </div>
  );
};

export default ReadOnlyParticipantsAndProviders;
