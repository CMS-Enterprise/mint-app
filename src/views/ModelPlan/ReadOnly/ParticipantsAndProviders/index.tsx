import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GetAllParticipantsAndProvidersQuery,
  OverlapType,
  useGetAllParticipantsAndProvidersQuery
} from 'gql/gen/graphql';

import usePlanTranslation from 'hooks/usePlanTranslation';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { NotFoundPartial } from 'views/NotFound';

import { checkGroupMap } from '../_components/FilterView/util';
import ReadOnlySection, {
  formatListItems,
  formatListOtherItems
} from '../_components/ReadOnlySection';
import ReadOnlySectionNew from '../_components/ReadOnlySection/new';
import SideBySideReadOnlySection from '../_components/SideBySideReadOnlySection';
import SideBySideReadOnlySectionNew from '../_components/SideBySideReadOnlySection/new';
import TitleAndStatus from '../_components/TitleAndStatus';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyParticipantsAndProviders = ({
  modelID,
  clearance,
  filteredView,
  isViewingFilteredView,
  filteredQuestions
}: ReadOnlyProps) => {
  const { t: participantsAndProvidersT } = useTranslation(
    'participantsAndProviders'
  );

  const { t: participantsAndProvidersMiscT } = useTranslation(
    'participantsAndProvidersMisc'
  );
  const { t: prepareForClearanceT } = useTranslation('prepareForClearance');

  const {
    participantRemovedFrequency: participantRemovedFrequencyConfig,
    providerAdditionFrequency: providerAdditionFrequencyConfig,
    providerRemovalFrequency: providerRemovalFrequencyConfig,
    riskType: riskTypeConfig
  } = usePlanTranslation('participantsAndProviders');

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

  const {
    participants,
    medicareProviderType,
    statesEngagement,
    participantsOther,
    participantsNote,
    participantsCurrentlyInModels,
    participantsCurrentlyInModelsNote,
    modelApplicationLevel,
    expectedNumberOfParticipants,
    estimateConfidence,
    confidenceNote,
    recruitmentMethod,
    recruitmentNote,
    selectionMethod,
    selectionOther,
    selectionNote,
    participantAddedFrequency,
    participantAddedFrequencyNote,
    participantRemovedFrequency,
    participantRemovedFrequencyNote,
    communicationMethod,
    communicationMethodOther,
    communicationNote,
    riskType,
    riskOther,
    riskNote,
    willRiskChange,
    willRiskChangeNote,
    coordinateWork,
    coordinateWorkNote,
    gainsharePayments,
    gainsharePaymentsTrack,
    gainsharePaymentsNote,
    gainsharePaymentsEligibility,
    gainsharePaymentsEligibilityOther,
    participantsIds,
    participantsIdsOther,
    participantsIDSNote,
    providerAdditionFrequency,
    providerAdditionFrequencyNote,
    providerAddMethod,
    providerAddMethodOther,
    providerAddMethodNote,
    providerLeaveMethod,
    providerLeaveMethodOther,
    providerLeaveMethodNote,
    providerRemovalFrequency,
    providerRemovalFrequencyNote,
    providerOverlap,
    providerOverlapHierarchy,
    providerOverlapNote,
    status
  } = allparticipantsAndProvidersData;

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
        status={status}
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
          value={participants}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.medicareProviderType}
          value={medicareProviderType}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.statesEngagement}
          value={statesEngagement}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.participantsOther}
          value={participantsOther}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.participantsNote}
          value={participantsNote}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.participantsCurrentlyInModels}
          value={participantsCurrentlyInModels}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={
            participantsAndProvidersConfig.participantsCurrentlyInModelsNote
          }
          value={participantsCurrentlyInModelsNote}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.modelApplicationLevel}
          value={modelApplicationLevel}
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
            value={expectedNumberOfParticipants}
            values={allparticipantsAndProvidersData}
            namespace="participantsAndProviders"
            filteredView={filteredView}
          />

          {(!!expectedNumberOfParticipants ||
            expectedNumberOfParticipants === 0) && (
            <ReadOnlySectionNew
              config={participantsAndProvidersConfig.estimateConfidence}
              value={estimateConfidence}
              values={allparticipantsAndProvidersData}
              namespace="participantsAndProviders"
              filteredView={filteredView}
            />
          )}
        </SideBySideReadOnlySectionNew>

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.confidenceNote}
          value={confidenceNote}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.recruitmentMethod}
          value={recruitmentMethod}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.recruitmentNote}
          value={recruitmentNote}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.selectionMethod}
          value={selectionMethod}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.selectionNote}
          value={selectionNote}
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
          value={participantAddedFrequency}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.participantAddedFrequencyNote}
          value={participantAddedFrequencyNote}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.participantRemovedFrequency}
          value={participantRemovedFrequency}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={
            participantsAndProvidersConfig.participantRemovedFrequencyNote
          }
          value={participantRemovedFrequencyNote}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.communicationMethod}
          value={communicationMethod}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.riskType}
          value={riskType}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.riskNote}
          value={riskNote}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.willRiskChange}
          value={willRiskChange}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.willRiskChangeNote}
          value={willRiskChangeNote}
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
          value={coordinateWork}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <ReadOnlySectionNew
          config={participantsAndProvidersConfig.coordinateWorkNote}
          value={coordinateWorkNote}
          values={allparticipantsAndProvidersData}
          namespace="participantsAndProviders"
          filteredView={filteredView}
        />

        <SideBySideReadOnlySectionNew>
          <ReadOnlySectionNew
            config={participantsAndProvidersConfig.gainsharePayments}
            value={gainsharePayments}
            values={allparticipantsAndProvidersData}
            namespace="participantsAndProviders"
            filteredView={filteredView}
          />
          {gainsharePayments && (
            <ReadOnlySectionNew
              config={participantsAndProvidersConfig.gainsharePaymentsTrack}
              value={gainsharePaymentsTrack}
              values={allparticipantsAndProvidersData}
              namespace="participantsAndProviders"
              filteredView={filteredView}
            />
          )}
        </SideBySideReadOnlySectionNew>

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'gainsharePayments',
          <SideBySideReadOnlySection
            firstSection={{
              heading: participantsAndProvidersT('gainsharePayments.label'),
              copy: participantsAndProvidersT(
                `gainsharePayments.options.${gainsharePayments}`,
                ''
              )
            }}
            secondSection={
              gainsharePayments === true && {
                heading: participantsAndProvidersT(
                  'gainsharePaymentsTrack.label'
                ),
                copy: participantsAndProvidersT(
                  `gainsharePaymentsTrack.options.${gainsharePaymentsTrack}`,
                  ''
                )
              }
            }
          />
        )}

        {gainsharePayments &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'gainsharePaymentsEligibility',
            <ReadOnlySection
              heading={participantsAndProvidersT(
                'gainsharePaymentsEligibility.label'
              )}
              list
              listItems={gainsharePaymentsEligibility?.map((type): string =>
                participantsAndProvidersT(
                  `gainsharePaymentsEligibility.options.${type}`
                )
              )}
              listOtherItem={gainsharePaymentsEligibilityOther}
            />
          )}

        {gainsharePaymentsNote &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'gainsharePayments',
            <ReadOnlySection
              heading={participantsAndProvidersT('gainsharePaymentsNote.label')}
              copy={gainsharePaymentsNote}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'participantsIds',
          <ReadOnlySection
            heading={participantsAndProvidersT('participantsIds.label')}
            list
            listItems={participantsIds?.map((type): string =>
              participantsAndProvidersT(`participantsIds.options.${type}`)
            )}
            listOtherItem={participantsIdsOther}
            notes={participantsIDSNote}
          />
        )}
      </div>

      <div>
        {/* {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'providerAdditionFrequency',
          <ReadOnlySection
            heading={participantsAndProvidersT(
              'providerAdditionFrequency.label'
            )}
            list
            listItems={formatListItems(
              providerAdditionFrequencyConfig,
              providerAdditionFrequency
            )}
            listOtherItems={formatListOtherItems(
              providerAdditionFrequencyConfig,
              providerAdditionFrequency,
              allparticipantsAndProvidersData
            )}
            notes={providerAdditionFrequencyNote}
          />
        )} */}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'providerAddMethod',
          <ReadOnlySection
            heading={participantsAndProvidersT(
              'providerAddMethod.readonlyLabel'
            )}
            list
            listItems={providerAddMethod?.map((type): string =>
              participantsAndProvidersT(`providerAddMethod.options.${type}`)
            )}
            listOtherItem={providerAddMethodOther}
            notes={providerAddMethodNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'providerLeaveMethod',
          <ReadOnlySection
            heading={participantsAndProvidersT(
              'providerLeaveMethod.readonlyLabel'
            )}
            list
            listItems={providerLeaveMethod?.map((type): string =>
              participantsAndProvidersT(`providerLeaveMethod.options.${type}`)
            )}
            listOtherItem={providerLeaveMethodOther}
            notes={providerLeaveMethodNote}
          />
        )}

        {/* {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'providerRemovalFrequency',
          <ReadOnlySection
            heading={participantsAndProvidersT(
              'providerRemovalFrequency.label'
            )}
            list
            listItems={formatListItems(
              providerRemovalFrequencyConfig,
              providerRemovalFrequency
            )}
            listOtherItems={formatListOtherItems(
              providerRemovalFrequencyConfig,
              providerRemovalFrequency,
              allparticipantsAndProvidersData
            )}
            notes={providerRemovalFrequencyNote}
          />
        )} */}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'providerOverlap',
          <ReadOnlySection
            heading={participantsAndProvidersT('providerOverlap.label')}
            copy={
              providerOverlap &&
              participantsAndProvidersT(
                `providerOverlap.options.${providerOverlap}`,
                ''
              )
            }
          />
        )}

        {providerOverlap !== OverlapType.NO &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'providerOverlapHierarchy',
            <ReadOnlySection
              heading={participantsAndProvidersT(
                'providerOverlapHierarchy.label'
              )}
              copy={providerOverlapHierarchy}
            />
          )}

        {providerOverlapNote &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'providerOverlapHierarchy',
            <ReadOnlySection
              heading={participantsAndProvidersT('providerOverlapNote.label')}
              copy={providerOverlapNote}
            />
          )}
      </div>
    </div>
  );
};

export default ReadOnlyParticipantsAndProviders;
